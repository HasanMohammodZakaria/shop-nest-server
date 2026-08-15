import { z } from 'zod';

const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100),
    email: z.string({ error: 'Email is required' }).email('Invalid email address'),
    password: z
      .string({ error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    image: z.string().url('Image must be a valid URL').optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({ error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ error: 'Password is required' }),
     phone: z.string().min(6, 'Invalid phone number').max(20).optional(),
    address: z.string().max(300).optional(),
  }),
});

export const authValidation = {
  registerSchema,
  loginSchema,
};