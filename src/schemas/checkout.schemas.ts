import { z } from 'zod';

const POLISH_POSTAL_CODE = /^\d{2}-\d{3}$/;
const POLISH_PHONE = /^(\+48)?\d{9}$/;

export const addressSchema = z.object({
  type: z.enum(['SHIPPING', 'BILLING']).default('SHIPPING'),
  isDefault: z.boolean().default(false),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  phone: z
    .string()
    .regex(POLISH_PHONE, 'Phone must be 9 digits, optionally with +48 prefix'),
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
    .regex(
      POLISH_POSTAL_CODE,
      'Postal code must be in XX-XXX format (e.g. 00-001)',
    ),
  country: z
    .string()
    .length(2, 'Country must be a 2-letter ISO code')
    .default('PL'),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
