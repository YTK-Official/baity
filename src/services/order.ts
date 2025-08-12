'use server';

import { env } from '@/config/env';
import { stripeClient } from '@/config/stripe';
import { db } from '@/db';
import { order } from '@/db/schema';
import type { NewOrder, Order } from '@/types/order';
import type { Product } from '@/types/product';
import { tryCatch } from '@/utils/tryCatch';
import { and, eq } from 'drizzle-orm';
import { getAuth } from './user';

export const createOrder = async (orderData: NewOrder) => {
  const orders = await db.insert(order).values(orderData).returning();

  return orders[0];
};

export const createOrderWithStripe = async (
  orderData: NewOrder,
  orderProduct: Product
) => {
  const successUrlParams = new URLSearchParams(
    Object.entries(orderData).reduce(
      (acc, [key, value]) => {
        acc[key] = value?.toString() ?? '';
        return acc;
      },
      {} as Record<string, string>
    )
  );
  const [checkoutSessionError, checkoutSession] = await tryCatch(
    stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      currency: 'egp',
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: orderProduct.name,
              images: orderProduct.images ?? [],
              description: orderProduct.description ?? '',
            },
            unit_amount: Math.floor(orderData.total * 100),
            tax_behavior: 'exclusive',
          },
          quantity: orderData.quantity,
        },
      ],
      mode: 'payment',
      success_url: `${env.BASE_URL}/checkout/success?${successUrlParams.toString()}`,
      cancel_url: `${env.BASE_URL}/checkout/cancelled`,
    })
  );

  if (checkoutSessionError) throw checkoutSessionError;

  return checkoutSession.url;
};

export const getOrderById = async (id: string) => {
  const auth = await getAuth();

  const result = await db.query.order.findFirst({
    where:
      auth.role !== 'user'
        ? eq(order.id, id)
        : and(eq(order.id, id), eq(order.userId, auth.id)),
    with: {
      user: true,
      product: {
        with: { user: true },
      },
    },
  });

  if (!result) return null;

  const isOwner = result.product.userId === auth.id;

  if (!isOwner && auth.role === 'chef') {
    return null;
  }

  return result;
};

export const getOrders = async (
  {
    page = 1,
    limit = 10,
    paid = false,
  }: { page?: number; limit?: number; paid?: boolean } = {
    page: 1,
    limit: 10,
    paid: false,
  }
) => {
  const auth = await getAuth();

  const orders = await db.query.order.findMany({
    with: {
      user: true,
      product: {
        with: { user: true },
      },
    },
    where: eq(order.userId, auth.id),
  });

  const offset = (page - 1) * limit;
  const paginatedOrders = orders.slice(offset, offset + limit);

  if (paid) {
    return paginatedOrders.filter(order => order.status === 'paid');
  }

  return paginatedOrders;
};

export const getDashboardOrders = async (
  { page = 1, limit = 10 }: { page?: number; limit?: number } = {
    page: 1,
    limit: 10,
  }
) => {
  const auth = await getAuth();

  const products = await db.query.product.findMany({
    with: {
      user: true,
      orders: {
        with: {
          user: true,
          product: true,
        },
      },
    },
    where: (product, { eq }) => eq(product.userId, auth.id),
  });

  const orders = products.flatMap(product => product.orders);

  const offset = (page - 1) * limit;
  const paginatedOrders = orders.slice(offset, offset + limit);

  return paginatedOrders;
};

export const getChefOrders = async (
  { limit, offset }: { limit?: number; offset?: number } = { offset: 0 }
) => {
  const auth = await getAuth();

  const orders = await db.query.order.findMany({
    where: eq(order.userId, auth.id),
    limit,
    offset,
    with: {
      user: true,
      product: {
        with: { user: true },
      },
    },
  });

  const chefOrders = orders.filter(order => order.product.userId === auth.id);

  return {
    orders: chefOrders,
    total: limit ? Math.ceil(chefOrders.length / limit) : chefOrders.length,
  };
};

export const getOrdersByProductId = async (productId: string) => {
  const orders = await db.query.order.findMany({
    where: (order, { eq }) => eq(order.productId, productId),
  });

  return orders;
};

export const updateOrder = async (id: string, orderData: Partial<Order>) => {
  const [getOrderError] = await tryCatch(getOrderById(id));

  if (getOrderError) throw getOrderError;

  const orders = await db
    .update(order)
    .set(orderData)
    .where(and(eq(order.id, id)))
    .returning();

  return orders[0];
};

export const approveOrder = async (id: string) => {
  const [getOrderError] = await tryCatch(getOrderById(id));
  if (getOrderError) throw getOrderError;

  const orders = await db
    .update(order)
    .set({ status: 'approved' })
    .where(and(eq(order.id, id)))
    .returning();

  if (orders.length === 0) {
    throw new Error('Order not found');
  }

  return orders[0];
};

export const cancelOrder = async (id: string) => {
  const [getOrderError] = await tryCatch(getOrderById(id));
  if (getOrderError) throw getOrderError;

  const orders = await db
    .update(order)
    .set({ status: 'cancelled' })
    .where(and(eq(order.id, id)))
    .returning();

  if (orders.length === 0) {
    throw new Error('Order not found');
  }

  return orders[0];
};
