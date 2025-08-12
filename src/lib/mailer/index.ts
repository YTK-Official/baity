import type { SendMailOptions } from 'nodemailer';

import { env } from '@/config/env';
import { transporter } from '@/config/nodemailer';

import { emailTemplates } from './templates';

export const sendEmail = async <T extends keyof typeof emailTemplates>(
  templateName: T,
  templateParams: Parameters<(typeof emailTemplates)[T]>[0],
  options?: Omit<SendMailOptions, 'from'>,
) => {
  // @ts-expect-error Type 'T' is not assignable to templateParams type
  const template = emailTemplates[templateName](templateParams);

  const info = await transporter.sendMail({
    from: env.SMTP_FROM,
    ...template,
    ...options,
  });

  return info;
};
