'use server';

import { env } from '@/config/env';
import { tryCatch } from '@/utils/tryCatch';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const ContactEmailSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  message: z.string().min(1, 'Message is required'),
});

export async function sendContactEmail(form: unknown) {
  const result = ContactEmailSchema.safeParse(form);

  if (!result.success) {
    return { success: false, error: result.error.message };
  }

  const transporter = nodemailer.createTransport({
    url: env.SMTP_URL,
    from: env.SMTP_FROM,
  });

  const [error] = await tryCatch(
    transporter.sendMail({
      from: `"${result.data.name}" <${result.data.email}>`,
      to: env.SMTP_FROM,
      subject: 'Contact Us Form Submission',
      text: result.data.message,
      html: `<p><strong>Name:</strong> ${result.data.name}</p>
             <p><strong>Email:</strong> ${result.data.email}</p>
             <p><strong>Message:</strong><br/>${result.data.message}</p>`,
    }),
  );

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
