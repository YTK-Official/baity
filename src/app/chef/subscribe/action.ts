'use server';

import { db } from '@/db';
import { subscription } from '@/db/schema';
import { auth } from '@/lib/auth';
import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export const getSubscriptionAction = async () => {
  const [authError, auth] = await tryCatch(getAuth());

  console.log(auth);

  if (authError || auth.role !== 'chef' || !auth.stripeCustomerId) {
    return {
      success: false,
      message: authError?.message,
      data: null,
    };
  }

  const result = await db.query.subscription.findFirst({
    where: eq(subscription.stripeCustomerId, auth.stripeCustomerId),
  });

  console.log(result);

  return {
    success: true,
    message: '',
    data: result,
  };
};

export const subscribeAction = async (planId: 'pro' | (string & {})) => {
  const { url } = await auth.api.upgradeSubscription({
    headers: await headers(),
    body: {
      plan: planId,
      successUrl: `${process.env.BASE_URL}/chef`,
    },
  });

  return { url };
};

export const cancelSubscriptionAction = async () => {
  const { url } = await auth.api.cancelSubscription({
    headers: await headers(),
    body: {
      returnUrl: `${process.env.BASE_URL}/chef`,
    },
  });

  return { url };
};
