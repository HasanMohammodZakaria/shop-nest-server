import { z } from 'zod';

const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(['USER', 'ADMIN'], { error: 'Valid role is required' }),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
    phone: z.string().min(6, 'Invalid phone number').max(20).optional(),
    address: z.string().max(300).optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({ error: 'Old password is required' }),
    newPassword: z
      .string({ error: 'New password is required' })
      .min(6, 'New password must be at least 6 characters'),
  }),
});

export const userValidation = {
  updateRoleSchema,
  updateProfileSchema,
  changePasswordSchema,
};