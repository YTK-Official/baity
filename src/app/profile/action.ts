'use server';

import { db } from '@/db';
import { user as userTable } from '@/db/schema';
import { auth } from '@/lib/auth';
import { authClient } from '@/lib/auth/client';
import { uploadFile } from '@/services/files';
import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be at most 50 characters long'),
  email: z.string().email('Invalid email'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits long')
    .max(15, 'Phone number must be at most 15 digits long')
    .regex(
      /^\+?\d{10,15}$/,
      'Phone number must be valid and contain only digits, optionally starting with +'
    ),
  image: z.union([z.string(), z.instanceof(File)]).optional(),
});

export const updateProfileAction = async (data: unknown) => {
  const result = updateProfileSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      data,
      error: result.error.flatten().fieldErrors,
    };
  }

  const { name, phone, email, image } = result.data;

  let imageUrl = null;
  if (image instanceof File && image.size > 0) {
    const [uploadFileError, uploadFileData] = await tryCatch(uploadFile(image));

    if (uploadFileError || !uploadFileData) {
      console.log(uploadFileError);
      return {
        success: false,
        data: null,
        error: {
          form: ['Failed to upload image'],
        },
      };
    }

    imageUrl = uploadFileData.secure_url;
  }

  const [getUserError, user] = await tryCatch(getAuth());

  if (getUserError || !user) {
    console.log(getUserError);
    return {
      success: false,
      data: null,
      error: {
        form: ['Failed to get user'],
      },
    };
  }

  if (email !== user?.email) {
    const [changeEmailError] = await tryCatch(
      auth.api.changeEmail({
        headers: await headers(),
        body: {
          newEmail: email,
        },
      })
    );

    if (changeEmailError) {
      console.log(changeEmailError);
      return {
        success: false,
        data: null,
        error: {
          form: ['Failed to change email'],
        },
      };
    }

    await db
      .update(userTable)
      .set({ emailVerified: false })
      .where(eq(userTable.id, user.id));
  }

  const [updateUserError] = await tryCatch(
    auth.api.updateUser({
      headers: await headers(),
      body: {
        name,
        phone,
        ...(imageUrl && { image: imageUrl }),
      },
    })
  );

  if (updateUserError) {
    console.log(updateUserError);
    return {
      success: false,
      data: null,
      error: {
        form: ['Failed to update user'],
      },
    };
  }

  const [getAuthError, authData] = await tryCatch(getAuth());

  if (getAuthError) {
    console.log(getAuthError);
    return {
      success: false,
      data: null,
      error: {
        form: ['Failed to get user'],
      },
    };
  }

  return {
    success: true,
    data: {
      name: authData.name,
      email,
      phone: authData.phone,
      image: imageUrl,
    },
    error: null,
  };
};

export const sendVerificationEmail = async () => {
  const [getUserError, user] = await tryCatch(getAuth());

  if (getUserError || !user) {
    console.log(getUserError);
    return {
      success: false,
      data: null,
      error: {
        form: ['Failed to get user'],
      },
    };
  }

  const [verifyEmailError] = await tryCatch(
    authClient.sendVerificationEmail({
      email: user.email,
    })
  );

  if (verifyEmailError) {
    console.log(verifyEmailError);
    return {
      success: false,
      data: null,
      error: {
        form: ['Failed to verify email'],
      },
    };
  }

  return {
    success: true,
    data: null,
    error: null,
  };
};
