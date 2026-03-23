import { productsControllerFindAll } from '@/api/generated/sdk.gen';
import type { ProductListItemDto } from '@/api/generated/types.gen';
import { ProductGrid } from '@/components/products/product-grid';
import '@/api/client';

type RelatedProductsProps = {
  categoryId: string;
  currentProductId: string;
};

const RelatedProducts = async ({
  categoryId,
  currentProductId,
}: RelatedProductsProps) => {
  const response = await productsControllerFindAll({
    query: {
      categoryId,
      limit: 4,
    },
  }).catch(() => null);

  const products: ProductListItemDto[] = (response?.data?.data ?? []).filter(
    (p) => p.id !== currentProductId,
  );

  if (products.length === 0) return null;

  return (
    <section className='space-y-4'>
      <h2 className='text-xl font-bold'>Related Products</h2>
      <ProductGrid products={products} />
    </section>
  );
};

export { RelatedProducts };
