'use server';

import { auth } from '@/lib/auth';
import { tryCatch } from '@/utils/tryCatch';
import { RegisterSchema } from '@/validations/auth';

export const registerAction = async (data: unknown) => {
  const result = RegisterSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      data: null,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const validatedData = result.data;

  const [error] = await tryCatch(
    auth.api.signUpEmail({
      body: {
        ...validatedData,
        // @ts-ignore
        image:
          'https://res.cloudinary.com/dzjto7pvb/image/upload/v1751103773/default-avatar_eurwt8.png',
      },
    })
  );

  if (error) {
    return {
      success: false,
      data: null,
      errors: {
        form: [error.message],
      },
    };
  }

  return {
    success: true,
    data: validatedData,
    errors: null,
  };
};
