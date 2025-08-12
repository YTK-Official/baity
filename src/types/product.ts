import type { product } from '@/db/schema';

export type Product = typeof product.$inferSelect;
export type NewProduct = typeof product.$inferInsert;
