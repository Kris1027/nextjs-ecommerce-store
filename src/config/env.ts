import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
});

const serverEnvSchema = clientEnvSchema.extend({
  API_URL: z.url(),
});

const isServer = typeof window === 'undefined';

const rawEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  ...(isServer ? { API_URL: process.env.API_URL } : {}),
};

const parsed = isServer
  ? serverEnvSchema.safeParse(rawEnv)
  : clientEnvSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten());
  throw new Error(
    `Invalid environment variables. Check ${isServer ? 'server logs' : 'browser console'}.`,
  );
}

export const env = parsed.data;
