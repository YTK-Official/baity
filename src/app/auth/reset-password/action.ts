'use server';

import { z } from 'zod';

import { auth } from '@/lib/auth';
import { tryCatch } from '@/utils/tryCatch';

const ResetPasswordSchema = z
  .object({
    token: z.string({
      message: 'Token is required',
    }),
    password: z
      .string({
        message: 'Password is required',
      })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z
      .string({
        message: 'Confirm Password is required',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character',
      }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const resetPasswordAction = async (data: unknown) => {
  const {
    success,
    data: validatedData,
    error,
  } = ResetPasswordSchema.safeParse(data);

  if (!success) {
    return {
      success: false,
      data,
      error: error.flatten().fieldErrors,
    };
  }

  const [forgetPasswordError, forgetPasswordData] = await tryCatch(
    auth.api.resetPassword({
      body: {
        token: validatedData.token,
        newPassword: validatedData.password,
      },
    })
  );

  if (forgetPasswordError) {
    return {
      success: false,
      data: null,
      error: {
        form: [forgetPasswordError.message],
      },
    };
  }

  return {
    success: true,
    data: forgetPasswordData,
    error: null,
  };
};
