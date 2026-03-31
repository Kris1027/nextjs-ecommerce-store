import type { MetadataRoute } from 'next';
import { STORE_NAME, STORE_DESCRIPTION } from '@/lib/constants';

const manifest = (): MetadataRoute.Manifest => ({
  name: STORE_NAME,
  short_name: STORE_NAME,
  description: STORE_DESCRIPTION,
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#171717',
  icons: [
    {
      src: '/favicon.ico',
      sizes: '48x48',
      type: 'image/x-icon',
    },
    {
      src: '/icon',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: '/icon',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
});

export default manifest;
