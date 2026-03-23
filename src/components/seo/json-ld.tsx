type JsonLdProps = {
  data: Record<string, unknown>;
};

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type='application/ld+json'
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

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
      priceCurrency: 'USD',
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

const buildOrganizationJsonLd = (siteUrl: string): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ecommerce Store',
  url: siteUrl,
});

const buildWebSiteJsonLd = (siteUrl: string): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ecommerce Store',
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
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
};
