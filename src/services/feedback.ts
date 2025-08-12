'use server';

import { db } from '@/db';
import { order } from '@/db/schema';
import { feedback } from '@/db/schemas/feedback';
import type { NewFeedback } from '@/types/feedback';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const feedbackSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  productId: z.string(),
  comment: z.string().min(1, 'Comment is required'),
  rating: z.number().int().min(1).max(5),
});

export const createFeedback = async (newFeedback: NewFeedback) => {
  const parsed = feedbackSchema.safeParse(newFeedback);

  if (!parsed.success) {
    throw new Error(parsed.error.errors.map(e => e.message).join(', '));
  }

  // Check if user already left feedback for this product
  const existing = await db.query.feedback.findFirst({
    where: and(
      eq(feedback.userId, parsed.data.userId),
      eq(feedback.productId, parsed.data.productId)
    ),
  });

  if (existing) {
    throw new Error('You have already submitted feedback for this product.');
  }

  // Check if user has ordered this product before
  const existingOrder = await db.query.order.findFirst({
    where: and(
      eq(order.userId, parsed.data.userId),
      eq(order.productId, parsed.data.productId)
    ),
  });

  if (!existingOrder) {
    throw new Error(
      'You can only leave feedback for products you have ordered.'
    );
  }

  const { id, ...feedbackData } = parsed.data;
  const result = await db.insert(feedback).values(feedbackData);

  return result;
};

export const getFeedbacks = async () => {
  const result = await db.query.feedback.findMany();

  return result;
};

export const getFeedbackById = async (id: string) => {
  const result = await db.query.feedback.findFirst({
    where: eq(feedback.id, id),
  });

  return result;
};

export const updateFeedback = async (
  id: string,
  data: Partial<NewFeedback>
) => {
  const result = await db.update(feedback).set(data).where(eq(feedback.id, id));

  return result;
};

export const deleteFeedback = async (id: string) => {
  const result = await db.delete(feedback).where(eq(feedback.id, id));

  return result;
};
