import {
  boolean,
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth';

export const product = pgTable(
  'product',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description').default(''),
    price: doublePrecision('price').notNull(),
    images: text('images').array(),
    featured: boolean('featured').default(false),
    status: text('status', {
      enum: ['active', 'inactive', 'pending', 'rejected'],
    })
      .notNull()
      .default('pending'),
    priceId: text('price_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (product) => [
    index('product_id_idx').on(product.id),
    index('product_user_id_idx').on(product.userId),
    index('product_name_idx').on(product.name),
  ],
);
