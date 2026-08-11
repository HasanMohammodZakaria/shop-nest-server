import { z } from 'zod';

const createReviewSchema = z.object({
  body: z.object({
    rating: z
      .number({ error: 'Rating is required' })
      .int('Rating must be a whole number')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    comment: z.string().max(1000).optional(),
    productId: z.string({ error: 'productId is required' }).uuid('Invalid productId'),
  }),
});

const updateReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int('Rating must be a whole number')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5')
      .optional(),
    comment: z.string().max(1000).optional(),
  }),
});

export const reviewValidation = {
  createReviewSchema,
  updateReviewSchema,
};