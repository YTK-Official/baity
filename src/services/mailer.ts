import { APIError } from 'better-auth/api';

import { sendEmail } from '@/lib/mailer';
import { tryCatch } from '@/utils/tryCatch';

export const sendResetPassword = async ({
  token,
  user,
  url,
}: {
  token: string;
  user: { email: string };
  url: string;
}) => {
  const [error] = await tryCatch(sendEmail('passwordReset', { to: user.email, url, token }));

  if (error) {
    throw new APIError(500, {
      message: 'Failed to send email',
      details: error.message,
    });
  }
};

export const sendVerificationOTP = async ({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: 'email-verification' | 'password-reset';
}) => {
  const emailTemplate = type === 'email-verification' ? 'emailVerification' : 'passwordForgot';

  const [error] = await tryCatch(sendEmail(emailTemplate, { to: email, code: otp }));

  if (error) {
    throw new APIError(500, {
      message: 'Failed to send email',
      details: error.message,
    });
  }
};
