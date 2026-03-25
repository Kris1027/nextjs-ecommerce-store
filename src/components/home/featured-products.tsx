import { ProductGrid } from '@/components/products/product-grid';
import type { ProductListItemDto } from '@/api/generated/types.gen';

type FeaturedProductsProps = {
  products: ProductListItemDto[];
};

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  if (products.length === 0) return null;

  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <h2 className='mb-8 text-2xl font-bold tracking-tight'>
        Featured Products
      </h2>
      <ProductGrid products={products} priorityCount={4} />
    </section>
  );
};

export { FeaturedProducts };
