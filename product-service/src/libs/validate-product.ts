import { z } from 'zod';
import { ProductRequest } from '../models/product';

const ProductRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  count: z.optional(z.number()),
});

export const isValidProductRequest = (productRequest: ProductRequest): boolean => {
  const parsedBody = ProductRequestSchema.safeParse(productRequest);
  return parsedBody.success;
};
