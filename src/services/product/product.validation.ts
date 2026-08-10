import { z } from 'zod';

const productStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']);

const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(200),
    description: z
      .string({ error: 'Description is required' })
      .min(10, 'Description must be at least 10 characters'),
    price: z
      .number({ error: 'Price is required' })
      .positive('Price must be greater than 0'),
    stock: z.number().int().min(0).optional(),
    images: z.array(z.string().url('Each image must be a valid URL')).optional(),
    status: productStatusEnum.optional(),
    categoryId: z.string({ error: 'categoryId is required' }).uuid('Invalid categoryId'),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(200).optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    price: z.number().positive('Price must be greater than 0').optional(),
    stock: z.number().int().min(0).optional(),
    images: z.array(z.string().url('Each image must be a valid URL')).optional(),
    status: productStatusEnum.optional(),
    categoryId: z.string().uuid('Invalid categoryId').optional(),
  }),
});

export const productValidation = {
  createProductSchema,
  updateProductSchema,
};