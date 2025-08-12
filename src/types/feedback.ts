import type { feedback } from '@/db/schemas/feedback';

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
