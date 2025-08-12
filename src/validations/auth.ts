import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be at most 50 characters long')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, apostrophes, and hyphens'
    ),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits long')
    .max(15, 'Phone number must be at most 15 digits long')
    .regex(
      /^\+?\d{10,15}$/,
      'Phone number must be valid and contain only digits, optionally starting with +'
    ),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
