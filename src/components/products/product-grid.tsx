import { ProductCard } from '@/components/products/product-card';
import type { ProductListItemDto } from '@/api/generated/types.gen';

type ProductGridProps = {
  products: ProductListItemDto[];
};

const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <p className='text-center text-sm text-muted-foreground'>
        No products found.
      </p>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export { ProductGrid };
