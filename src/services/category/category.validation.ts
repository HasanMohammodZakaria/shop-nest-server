import { z } from 'zod';

const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100),
    description: z.string().max(500).optional(),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
    description: z.string().max(500).optional(),
  }),
});

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};