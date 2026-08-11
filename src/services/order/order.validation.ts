import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string({ error: 'productId is required' }).uuid('Invalid productId'),
  quantity: z
    .number({ error: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .positive('Quantity must be greater than 0'),
});

const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z
      .string({ error: 'Shipping address is required' })
      .min(5, 'Shipping address must be at least 5 characters'),
    items: z
      .array(orderItemSchema)
      .min(1, 'Order must contain at least one item'),
  }),
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
      error: 'Valid status is required',
    }),
  }),
});

export const orderValidation = {
  createOrderSchema,
  updateOrderStatusSchema,
};