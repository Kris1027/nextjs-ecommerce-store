import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  productsControllerFindBySlug,
  productsControllerFindAll,
  categoriesControllerFindAllTree,
} from '@/api/generated/sdk.gen';
import type { ProductListItemDto } from '@/api/generated/types.gen';
import {
  Breadcrumb,
  buildBreadcrumbItems,
  type CategoryWithChildren,
} from '@/components/ui/breadcrumb';
import { ProductDetail } from '@/components/products/product-detail';
import { ProductGrid } from '@/components/products/product-grid';
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
    return { title: 'Product Not Found | Ecommerce Store' };
  }

  return {
    title: `${product.name} | Ecommerce Store`,
    description:
      typeof product.description === 'string'
        ? product.description
        : `Buy ${product.name} at our store.`,
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
  const tree =
    (treeResponse?.data?.data as unknown as CategoryWithChildren[]) ?? [];

  const breadcrumbItems = buildBreadcrumbItems({
    tree,
    categoryId: product.categoryId,
    productName: product.name,
  });

  const relatedResponse = await productsControllerFindAll({
    query: {
      categoryId: product.categoryId,
      limit: 4,
    },
  }).catch(() => null);

  const relatedProducts: ProductListItemDto[] = (
    relatedResponse?.data?.data ?? []
  ).filter((p) => p.id !== product.id);

  return (
    <div className='space-y-12'>
      <Breadcrumb items={breadcrumbItems} />

      <ProductDetail product={product} />

      {relatedProducts.length > 0 && (
        <section className='space-y-4'>
          <h2 className='text-xl font-bold'>Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductPage;
