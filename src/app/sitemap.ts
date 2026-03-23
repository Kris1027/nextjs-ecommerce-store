import type { MetadataRoute } from 'next';

import {
  categoriesControllerFindAll,
  productsControllerFindAll,
} from '@/api/generated/sdk.gen';
import '@/api/client';
import { env } from '@/config/env';

const siteUrl = env.NEXT_PUBLIC_SITE_URL;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { data: response } = await productsControllerFindAll({
      query: { page, limit: 100 },
    });

    if (response?.data) {
      for (const product of response.data) {
        productRoutes.push({
          url: `${siteUrl}/products/${product.slug}`,
          lastModified: new Date(product.createdAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
      hasMore = response.meta.hasNextPage;
      page++;
    } else {
      hasMore = false;
    }
  }

  const categoryRoutes: MetadataRoute.Sitemap = [];
  const { data: categoriesResponse } = await categoriesControllerFindAll({
    query: { limit: '100' },
  });

  if (categoriesResponse?.data) {
    for (const category of categoriesResponse.data) {
      categoryRoutes.push({
        url: `${siteUrl}/categories/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
};

export default sitemap;
