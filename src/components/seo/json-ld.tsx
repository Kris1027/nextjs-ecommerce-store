import { headers } from 'next/headers';
import { STORE_CURRENCY } from '@/lib/constants';

type JsonLdProps = {
  data: Record<string, unknown>;
};

const serializeJsonLd = (data: Record<string, unknown>): string =>
  JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

const JsonLd = async ({ data }: JsonLdProps) => {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <script
      type='application/ld+json'
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
};

type ProductJsonLdParams = {
  name: string;
  description: string;
  price: string;
  slug: string;
  images: Array<{ url: string }>;
  stock: number;
  siteUrl: string;
  reviews?: Array<{ rating: number; comment?: unknown; userName: string }>;
};

const buildProductJsonLd = ({
  name,
  description,
  price,
  slug,
  images,
  stock,
  siteUrl,
  reviews,
}: ProductJsonLdParams): Record<string, unknown> => {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url: `${siteUrl}/products/${slug}`,
    image: images.map((img) => img.url),
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: STORE_CURRENCY,
      availability:
        stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/products/${slug}`,
    },
  };

  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return data;
};

type BreadcrumbJsonLdItem = {
  label: string;
  href?: string;
};

const buildBreadcrumbJsonLd = (
  items: BreadcrumbJsonLdItem[],
  siteUrl: string,
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
  })),
});

type CategoryJsonLdParams = {
  name: string;
  description: string;
  slug: string;
  siteUrl: string;
  imageUrl?: string;
  products: Array<{
    name: string;
    slug: string;
    price: string;
    imageUrl?: string;
  }>;
};

const buildCategoryJsonLd = ({
  name,
  description,
  slug,
  siteUrl,
  imageUrl,
  products,
}: CategoryJsonLdParams): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url: `${siteUrl}/categories/${slug}`,
  ...(imageUrl ? { image: imageUrl } : {}),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/products/${product.slug}`,
      item: {
        '@type': 'Product',
        name: product.name,
        url: `${siteUrl}/products/${product.slug}`,
        ...(product.imageUrl ? { image: product.imageUrl } : {}),
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: STORE_CURRENCY,
        },
      },
    })),
  },
});

const buildOrganizationJsonLd = (
  siteUrl: string,
  storeName: string,
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: storeName,
  url: siteUrl,
});

const buildWebSiteJsonLd = (
  siteUrl: string,
  storeName: string,
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: storeName,
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export {
  JsonLd,
  buildProductJsonLd,
  buildCategoryJsonLd,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
};
