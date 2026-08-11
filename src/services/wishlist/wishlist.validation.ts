import { z } from 'zod';

const addToWishlistSchema = z.object({
  body: z.object({
    productId: z.string({ error: 'productId is required' }).uuid('Invalid productId'),
  }),
});

export const wishlistValidation = {
  addToWishlistSchema,
};