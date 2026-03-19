import { ProductGrid } from '@/components/products/product-grid';
import type { ProductListItemDto } from '@/api/generated/types.gen';

type NewArrivalsProps = {
  products: ProductListItemDto[];
};

const NewArrivals = ({ products }: NewArrivalsProps) => {
  if (products.length === 0) return null;

  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <h2 className='mb-8 text-2xl font-bold tracking-tight'>New Arrivals</h2>
      <ProductGrid products={products} />
    </section>
  );
};

export { NewArrivals };
