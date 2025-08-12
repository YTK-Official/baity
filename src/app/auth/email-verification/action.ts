'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { tryCatch } from '@/utils/tryCatch';

const ForgetPasswordSchema = z.object({
  email: z
    .string({
      message: 'Email is required',
    })
    .email({ message: 'Invalid email' }),
});

export const forgetPasswordAction = async (data: unknown) => {
  const {
    success,
    data: validatedData,
    error,
  } = ForgetPasswordSchema.safeParse(data);

  if (!success) {
    return {
      success: false,
      data,
      error: error.flatten().fieldErrors,
    };
  }

  const [userExistsError, userExists] = await tryCatch(
    db.query.user.findFirst({
      where: eq(user.email, validatedData.email),
    })
  );

  if (userExistsError) {
    return {
      success: false,
      data: null,
      error: {
        form: ['Error checking user existence, please try again later'],
      },
    };
  }

  if (!userExists) {
    return {
      success: false,
      data: null,
      error: {
        form: ['Check and confirm your email address'],
      },
    };
  }

  const [forgetPasswordError, forgetPasswordData] = await tryCatch(
    auth.api.forgetPassword({
      body: {
        email: validatedData.email,
        redirectTo: '/auth/reset-password',
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
