'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { tryCatch } from '@/utils/tryCatch';

const LoginSchema = z.object({
  email: z
    .string({
      message: 'Email is required',
    })
    .email('Invalid email'),
  password: z
    .string({
      message: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().default(false),
});

export const loginAction = async (data: unknown) => {
  const result = LoginSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      data,
      error: result.error.flatten().fieldErrors,
    };
  }

  const [signInError, signedUser] = await tryCatch(
    auth.api.signInEmail({
      body: result.data,
    }),
  );

  if (signInError) {
    return {
      success: false,
      data: null,
      error: {
        form: [signInError.message],
      },
    };
  }

  return {
    success: true,
    data: signedUser,
    error: null,
  };
};

export const loginWithGoogle = async () => {
  const [error, data] = await tryCatch(
    auth.api.signInSocial({
      body: {
        provider: 'google',
      },
    }),
  );

  if (error) {
    return {
      success: false,
      data: null,
      error: {
        form: [error.message],
      },
    };
  }

  if (!data.url) {
    return {
      success: false,
      data: null,
      error: {
        form: ['An unknown error occurred'],
      },
    };
  }

  redirect(data.url);
};
