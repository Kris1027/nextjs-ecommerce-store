import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  productsControllerFindBySlug,
  categoriesControllerFindAllTree,
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
import '@/api/client';

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

  const firstImage = product.images[0]?.url;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      ...(firstImage && {
        images: [{ url: firstImage, alt: product.name }],
      }),
    },
    twitter: {
      title: product.name,
      description,
      ...(firstImage && {
        images: [{ url: firstImage, alt: product.name }],
      }),
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

  const treeResponse = await categoriesControllerFindAllTree().catch(
    () => null,
  );
  const treeData = treeResponse?.data?.data as unknown;
  const tree: CategoryWithChildren[] = Array.isArray(treeData) ? treeData : [];

  const breadcrumbItems = buildBreadcrumbItems({
    tree,
    categoryId: product.categoryId,
    productName: product.name,
  });

  return (
    <div className='space-y-12'>
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
