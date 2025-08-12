import { env } from '@/config/env';
import { stripeClient } from '@/config/stripe';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { sendResetPassword } from '@/services/mailer';
import { tryCatch } from '@/utils/tryCatch';
import { RegisterSchema } from '@/validations/auth';
import { stripe as stripePlugin } from '@better-auth/stripe';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { admin, openAPI } from 'better-auth/plugins';
import { randomUUID } from 'node:crypto';
import { validator } from 'validator-better-auth';
import { sendEmail } from '../mailer';

export const auth = betterAuth({
  appName: 'Baity',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
  },
  trustedOrigins: [env.BASE_URL, 'http://localhost:*'],
  baseURL: env.BASE_URL || env.NEXT_PUBLIC_BASE_URL,
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({
        newEmail,
        url,
        token,
        user: { email },
      }) => {
        const [error] = await tryCatch(
          sendEmail('changeEmailVerification', {
            to: email,
            url,
            token,
            newEmail,
          })
        );

        if (error) {
          console.log(error);
          throw new APIError('INTERNAL_SERVER_ERROR', {
            message: error.message,
          });
        }
      },
    },
    additionalFields: {
      online: {
        type: 'boolean',
        defaultValue: false,
        required: false,
      },
      role: {
        type: 'string',
        defaultValue: 'user',
        required: true,
      },
      phone: {
        type: 'string',
        unique: true,
        required: true,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 1, // 3 days
    cookieCache: { enabled: true, maxAge: 60 * 60 * 24 * 7 }, // 7 days
    storeSessionInDatabase: true,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
    resetPasswordTokenExpiresIn: 60 * 60 * 24, // 1 day,
    sendResetPassword,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user: { email }, token, url }) => {
      const [error] = await tryCatch(
        sendEmail('emailVerification', { to: email, url, token })
      );

      if (error) {
        console.log(error);
        throw new APIError('INTERNAL_SERVER_ERROR', {
          message: error.message,
        });
      }
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: profile => ({
        email: profile.email,
        phone: '',
        image: profile.picture,
        name: profile.given_name,
        emailVerified: profile.email_verified,
      }),
    },
  },
  plugins: [
    admin(),
    validator({
      middlewares: [
        { path: '/sign-up/email', schemas: { body: RegisterSchema } },
      ],
    }),
    stripePlugin({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      onCustomerCreate: async ({ customer, stripeCustomer, user }) => {
        console.log(
          `Customer ${customer.id} created for user ${user.id} with email ${stripeCustomer.email}`
        );
      },
      subscription: {
        enabled: true,
        plans: [
          {
            name: 'pro',
            priceId: 'price_1RKEDmE70QlD7oX3vUUVtvbO',
            limits: {
              projects: 1,
            },
          },
        ],
      },
    }),
    openAPI(),
    nextCookies(),
  ],
});
