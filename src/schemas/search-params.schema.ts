import { z } from 'zod';

const sortOrderSchema = z.enum(['asc', 'desc']).optional();

const pageSchema = z.coerce.number().int().positive().optional().default(1);

const priceSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/)
  .optional();

export const productsSearchParamsSchema = z.object({
  category: z.string().uuid().optional(),
  minPrice: priceSchema,
  maxPrice: priceSchema,
  isFeatured: z.enum(['true', 'false']).optional(),
  sortBy: z.string().optional(),
  sortOrder: sortOrderSchema,
  page: pageSchema,
  search: z.string().max(200).optional(),
});

export const searchPageParamsSchema = z.object({
  q: z.string().max(200).optional(),
  sortBy: z.string().optional(),
  sortOrder: sortOrderSchema,
  page: pageSchema,
});

export const categorySearchParamsSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: sortOrderSchema,
  page: pageSchema,
  minPrice: priceSchema,
  maxPrice: priceSchema,
  isFeatured: z.enum(['true', 'false']).optional(),
});

export type ProductsSearchParams = z.infer<typeof productsSearchParamsSchema>;
export type SearchPageParams = z.infer<typeof searchPageParamsSchema>;
export type CategorySearchParams = z.infer<typeof categorySearchParamsSchema>;
