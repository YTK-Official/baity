'use server';

import { db } from '@/db';
import { createOrder, createOrderWithStripe } from '@/services/order';
import { getAuth } from '@/services/user';
import { calculatePriceWithTax, calculateTax } from '@/utils/calcTax';
import { tryCatch } from '@/utils/tryCatch';
import { z } from 'zod';

const buyProductSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().positive().min(1).max(10).default(1),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters long')
    .max(255, 'Address must be at most 255 characters long'),
  note: z.string().optional(),
  paymentMethod: z.enum(['cash', 'visa']),
});

export const checkoutAction = async (data: unknown) => {
  const [authError, auth] = await tryCatch(getAuth());

  if (authError) {
    return {
      success: false,
      data: null,
      message: authError.message,
    };
  }

  const result = buyProductSchema.safeParse(data);

  if (!result.success) {
    const [firstError] = Object.values(result.error.flatten().fieldErrors);

    return {
      success: false,
      data: null,
      message: firstError.join(', '),
    };
  }

  const { paymentMethod, ...otherOrderData } = result.data;

  const [productError, dbProduct] = await tryCatch(
    db.query.product.findFirst({
      where: (product, { eq }) => eq(product.id, otherOrderData.productId),
    }),
  );

  if (productError) throw productError;
  if (!dbProduct) throw new Error('Product Not found');

  const tax = calculateTax(dbProduct.price);
  const total = calculatePriceWithTax(dbProduct.price);
  const orderData = {
    tax,
    total,
    userId: auth.id,
    ...otherOrderData,
  };

  if (result.data.paymentMethod === 'cash') {
    console.log('test');

    const [createOrderError] = await tryCatch(createOrder(orderData));

    if (createOrderError) {
      console.log(createOrderError);
      return {
        success: false,
        data: null,
        message: createOrderError.message,
      };
    }

    return {
      success: true,
      data: null,
      message: 'Checkout created',
    };
  }

  const [createOrderError, createdOrder] = await tryCatch(
    createOrderWithStripe(orderData, dbProduct),
  );
  if (createOrderError) {
    console.log(createOrderError);
    return {
      success: false,
      data: null,
      message: createOrderError.message,
    };
  }

  return {
    success: true,
    data: createdOrder,
    message: 'Checkout created',
  };
};
