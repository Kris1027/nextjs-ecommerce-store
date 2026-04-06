import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  productsControllerFindBySlug,
  categoriesControllerFindAllTree,
  reviewsControllerFindByProduct,
} from '@/api/generated/sdk.gen';
import {
  Breadcrumb,
  buildBreadcrumbItems,
  type CategoryWithChildren,
} from '@/components/ui/breadcrumb';
import { ProductDetail } from '@/components/products/product-detail';
import { RelatedProducts } from '@/components/products/related-products';
import { RelatedProductsSkeleton } from '@/components/skeletons/related-products-skeleton';
import { ReviewsSection } from '@/components/reviews/reviews-section';
import {
  JsonLd,
  buildProductJsonLd,
  buildBreadcrumbJsonLd,
} from '@/components/seo/json-ld';
import { env } from '@/config/env';
import '@/api/client';

export const revalidate = 60;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: ProductPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const response = await productsControllerFindBySlug({
    path: { slug },
  }).catch(() => null);

  const product = response?.data?.data;

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const description =
    typeof product.description === 'string'
      ? product.description
      : `Buy ${product.name} at our store.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
    },
    twitter: {
      title: product.name,
      description,
    },
  };
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;

  const response = await productsControllerFindBySlug({
    path: { slug },
  }).catch(() => null);

  const product = response?.data?.data;

  if (!product) {
    notFound();
  }

  const [treeResponse, reviewsResponse] = await Promise.all([
    categoriesControllerFindAllTree().catch(() => null),
    reviewsControllerFindByProduct({
      path: { productId: product.id },
      query: { limit: '100' },
    }).catch(() => null),
  ]);

  const treeData = treeResponse?.data?.data as unknown;
  const tree: CategoryWithChildren[] = Array.isArray(treeData) ? treeData : [];

  const breadcrumbItems = buildBreadcrumbItems({
    tree,
    categoryId: product.categoryId,
    productName: product.name,
  });

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  const description =
    typeof product.description === 'string'
      ? product.description
      : `Buy ${product.name} at our store.`;

  const reviewsPayload = reviewsResponse?.data;
  const reviews = reviewsPayload?.data;
  const totalReviews = reviewsPayload?.meta?.total;

  const hasCompleteReviewData =
    Array.isArray(reviews) &&
    typeof totalReviews === 'number' &&
    totalReviews <= 100 &&
    totalReviews === reviews.length;

  const reviewData = hasCompleteReviewData
    ? reviews.map((r) => ({
        rating: r.rating,
        comment: r.comment,
        userName:
          [r.user.firstName, r.user.lastName].filter(Boolean).join(' ') ||
          'Anonymous',
      }))
    : undefined;

  return (
    <div className='mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8'>
      <JsonLd
        data={buildProductJsonLd({
          name: product.name,
          description,
          price: product.price,
          slug: product.slug,
          images: product.images,
          stock: product.stock,
          siteUrl,
          reviews: reviewData,
        })}
      />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <Breadcrumb items={breadcrumbItems} />

      <ProductDetail product={product} />

      <ReviewsSection productId={product.id} />

      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts
          categoryId={product.categoryId}
          currentProductId={product.id}
        />
      </Suspense>
    </div>
  );
};

export default ProductPage;
