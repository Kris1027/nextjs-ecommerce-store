import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Please select a rating').max(5),
  title: z
    .string()
    .max(100, 'Title must be 100 characters or less')
    .optional()
    .refine((val) => !val || val.length >= 3, {
      message: 'Title must be at least 3 characters',
    }),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review must be 2000 characters or less'),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
