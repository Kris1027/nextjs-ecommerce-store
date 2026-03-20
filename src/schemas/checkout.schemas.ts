import { z } from 'zod';

export const addressSchema = z.object({
  type: z.enum(['SHIPPING', 'BILLING']).default('SHIPPING'),
  isDefault: z.boolean().default(false),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  phone: z
    .string()
    .min(9, 'Phone number must be at least 9 characters')
    .max(15, 'Phone number must be at most 15 characters'),
  street: z
    .string()
    .min(3, 'Street must be at least 3 characters')
    .max(200, 'Street must be at most 200 characters'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be at most 100 characters'),
  region: z
    .string()
    .max(100, 'Region must be at most 100 characters')
    .optional(),
  postalCode: z
    .string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code must be at most 20 characters'),
  country: z
    .string()
    .length(2, 'Country must be a 2-letter ISO code')
    .default('PL'),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
