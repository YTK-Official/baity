import type { user } from '@/db/schema';

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
