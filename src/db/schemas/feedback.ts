import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { product } from './product';

export const feedback = pgTable('feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id),
  productId: uuid('product_id')
    .notNull()
    .references(() => product.id),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
