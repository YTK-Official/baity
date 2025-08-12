'use server';

import { db } from '@/db';
import { subscription } from '@/db/schema';
import { product } from '@/db/schemas/product';
import type { NewProduct, Product } from '@/types/product';
import { tryCatch } from '@/utils/tryCatch';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { getAuth } from './user';

const createProductSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z
    .string()
    .min(3, 'Description is required')
    .nullable()
    .optional(),
  price: z.number().positive('Price must be positive'),
  images: z.array(z.string().url()).nullable().optional(),
});

export const createProduct = async (data: Omit<NewProduct, 'userId'>) => {
  const parsed = createProductSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map(e => e.message).join(', '));
  }

  const [authError, auth] = await tryCatch(getAuth());

  if (authError || auth.role !== 'chef' || !auth.stripeCustomerId) {
    throw new Error('Unauthorized');
  }

  const [subscriptionError, userSubscription] = await tryCatch(
    db.query.subscription.findFirst({
      where: eq(subscription.stripeCustomerId, auth.stripeCustomerId),
    })
  );

  if (subscriptionError) throw subscriptionError;

  const [createProductError, createdProduct] = await tryCatch(
    db
      .insert(product)
      .values({
        ...parsed.data,
        images: !data.images?.length
          ? [
              'https://res.cloudinary.com/dzjto7pvb/image/upload/v1750948003/default-product_jaiit2.jpg',
            ]
          : data.images,
        featured: userSubscription
          ? userSubscription.status === 'active'
          : false,
        userId: auth.id,
      })
      .returning()
  );

  if (createProductError) throw createProductError;

  return createdProduct[0];
};

export const getProductsByUserId = async (userId: string) => {
  return await db.query.product.findMany({
    where: eq(product.userId, userId),
    with: {
      orders: true,
    },
  });
};

export const getDashboardProducts = async () => {
  const auth = await getAuth();

  if (auth.role !== 'admin') {
    return await db.query.product.findMany({
      where: eq(product.userId, auth.id),
      with: {
        user: true,
        orders: true,
        feedbacks: {
          with: { user: true },
        },
      },
    });
  }

  return await db.query.product.findMany({
    with: {
      user: true,
      orders: true,
      feedbacks: {
        with: { user: true },
      },
    },
  });
};

export const getProducts = async ({
  limit = 10,
  page = 1,
  status = 'all',
}: {
  limit?: number;
  page?: number;
  status?: Product['status'][] | Product['status'] | 'all';
}) => {
  const dbProduct = await db.query.product.findMany({
    with: {
      orders: true,
      user: true,
    },
    orderBy: (product, { desc }) => [desc(product.createdAt)],
    ...(status !== 'all' && {
      where: (product, { eq, inArray }) =>
        Array.isArray(status)
          ? inArray(product.status, status)
          : eq(product.status, status),
    }),
  });

  const unbannedChefProducts = dbProduct.filter(
    product => product.user.role === 'chef' && !product.user.banned
  );

  const sortedByFeatured = unbannedChefProducts.sort((a, b) =>
    a.featured === b.featured ? 0 : a.featured ? -1 : 1
  );

  const offset = (page - 1) * limit;
  const products = sortedByFeatured.slice(offset, offset + limit);

  return products;
};

export const getProductById = async (id: string) => {
  const [productError, result] = await tryCatch(
    db.query.product.findFirst({
      with: {
        user: true,
        orders: true,
        feedbacks: {
          with: { user: true },
        },
      },
      where: eq(product.id, id),
    })
  );

  if (productError) throw productError;
  if (!result) throw new Error('Product not found');

  const paidOrders = result.orders.filter(order => order.status === 'paid');

  return { ...result, orders: paidOrders };
};

export const getNewArrival = async (
  { limit, offset }: { limit?: number; offset?: number } = {
    limit: undefined,
    offset: 0,
  }
) => {
  const products = await db.query.product.findMany({
    limit,
    offset,
    with: {
      user: true,
    },
    orderBy: (order, { desc }) => desc(order.createdAt),
    where: (product, { and, gt, inArray }) =>
      and(
        gt(
          product.createdAt,
          new Date(new Date().setMonth(new Date().getMonth() - 1))
        ),
        inArray(product.status, ['active', 'inactive'])
      ),
  });

  const unbannedUsersProducts = products.filter(
    product => !product.user.banned
  );

  const sortedByFeatured = unbannedUsersProducts.sort((a, b) =>
    a.featured === b.featured ? 0 : a.featured ? -1 : 1
  );

  return sortedByFeatured;
};

export const updateProductStatus = async (
  id: string,
  status: Product['status']
) => {
  const auth = await getAuth();

  // Soft delete: set status to 'deleted'
  const [productError, result] = await tryCatch(
    db
      .update(product)
      .set({ status })
      .where(
        auth.role !== 'admin'
          ? and(eq(product.id, id), eq(product.userId, auth.id))
          : eq(product.id, id)
      )
      .returning()
  );

  if (productError) throw productError;
  if (!result) throw new Error('Product not found');

  return result[0];
};

export const updateProductById = async (
  id: string,
  data: Partial<NewProduct>
) => {
  const auth = await getAuth();
  const { name, description, price, images } = data;

  const [productError, result] = await tryCatch(
    db
      .update(product)
      .set({ name, description, price, images: images ?? [] })
      .where(
        auth.role !== 'admin'
          ? and(eq(product.id, id), eq(product.userId, auth.id))
          : eq(product.id, id)
      )
      .returning()
  );

  if (productError) throw productError;
  if (!result) throw new Error('Product not found');

  return result[0];
};
