'use server';

import { db } from '@/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { getTranslations } from '@/lib/translates';
import type { NewUser } from '@/types/user';
import { tryCatch } from '@/utils/tryCatch';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export const getAuth = async () => {
  const t = await getTranslations('auth');
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error(t('shared.unauthorized'));
  }

  const dbUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, session.user.id),
  });

  if (!dbUser) {
    throw new Error('Unauthorized');
  }

  return dbUser;
};

export const updateUser = async (data: Partial<NewUser>) => {
  const auth = await getAuth();

  const [error] = await tryCatch(
    db.update(user).set(data).where(eq(user.id, auth.id))
  );

  if (error) {
    throw error;
  }

  return auth;
};

export const toggleUserStatus = async () => {
  const auth = await getAuth();

  const [error] = await tryCatch(
    db.update(user).set({ online: !auth.online }).where(eq(user.id, auth.id))
  );

  if (error) {
    throw new Error('Failed to update user status');
  }

  return true;
};

export const getUsers = async () => {
  const [authError, user] = await tryCatch(getAuth());

  if (authError || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const users = await db.query.user.findMany();

  return users;
};

export const getBestSellers = async (limit = 10) => {
  const users = await db.query.user.findMany({
    limit,
    columns: {
      id: true,
      name: true,
      emailVerified: true,
      image: true,
      stripeCustomerId: true,
      role: true,
      online: true,
      banned: true,
    },
    with: {
      subscriptions: true,
      orders: {
        columns: {
          id: true,
          total: true,
          userId: true,
          status: true,
          createdAt: true,
        },
      },
    },
    where: (user, { eq }) => eq(user.role, 'chef'),
  });

  const unbannedUsers = users.filter(user => !user.banned);

  const usersSortedByTotalAmount = unbannedUsers
    .map(user => {
      const totalAmount = user.orders.reduce(
        (acc, order) => acc + order.total,
        0
      );
      return { ...user, totalAmount };
    })
    .toSorted((a, b) => b.totalAmount - a.totalAmount);

  const sortedBySubscriptionStatus = usersSortedByTotalAmount.toSorted(
    (a, b) =>
      a.subscriptions?.status === b.subscriptions?.status
        ? 0
        : a.subscriptions?.status === 'active'
          ? -1
          : 1
  );

  return sortedBySubscriptionStatus;
};

export const getChefs = async (page = 1, limit = 12) => {
  const offset = (page - 1) * limit;

  const chefs = await db.query.user.findMany({
    limit,
    offset,
    orderBy: (user, { desc }) => [desc(user.createdAt)],
    where: (user, { and, eq }) => and(eq(user.role, 'chef')),
  });

  const unbannedUsers = chefs.filter(user => !user.banned);

  return {
    chefs: unbannedUsers,
    totalPages: Math.ceil(chefs.length / limit),
    currentPage: page,
  };
};

export const getChefById = async (id: string) => {
  const chef = await db.query.user.findFirst({
    where: (user, { and, eq }) => and(eq(user.id, id), eq(user.role, 'chef')),
    with: {
      products: {
        orderBy: (product, { desc }) => [desc(product.createdAt)],
        with: {
          user: true,
          orders: true,
          feedbacks: true,
        },
      },
    },
  });

  if (!chef) {
    throw new Error('chef not found');
  }

  const activeChefProducts = chef.products.filter(
    product => product.status === 'active'
  );

  const paidOrders = activeChefProducts.flatMap(product =>
    product.orders.filter(order => order.status === 'paid')
  );

  const totalOrders = paidOrders.length;

  const rating =
    activeChefProducts.reduce((acc, product) => {
      const productRating =
        product.feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) /
          product.feedbacks.length || 0;
      return acc + productRating;
    }, 0) / activeChefProducts.length || 0;

  return {
    chef: { ...chef, products: activeChefProducts },
    totalOrders,
    rating,
  };
};

export const getChefByProductId = async (productId: string) => {
  const product = await db.query.product.findFirst({
    where: (product, { eq }) => eq(product.id, productId),
    with: {
      user: true,
    },
  });

  if (!product) {
    throw new Error('chef not found');
  }

  return product.user;
};
