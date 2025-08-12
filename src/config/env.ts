import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
    BASE_URL: z.string(),
    DATABASE_URL: z.string(),
    BETTER_AUTH_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    SMTP_URL: z.string(),
    SMTP_FROM: z.string(),
    CLOUDINARY_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    SMTP_URL: process.env.SMTP_URL,
    SMTP_FROM: process.env.SMTP_FROM,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
