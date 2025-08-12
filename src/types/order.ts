import type { order } from '@/db/schema';

export type Order = typeof order.$inferSelect;

export type NewOrder = typeof order.$inferInsert;
