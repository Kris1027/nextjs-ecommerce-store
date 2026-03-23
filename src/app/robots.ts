import type { MetadataRoute } from 'next';

import { env } from '@/config/env';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: [
      '/account',
      '/cart',
      '/checkout',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/verify-email',
    ],
  },
  sitemap: `${env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')}/sitemap.xml`,
});

export default robots;
