import { ProductCardSkeleton } from '@/components/skeletons/product-card-skeleton';

type ProductGridSkeletonProps = {
  count?: number;
};

const ProductGridSkeleton = ({ count = 8 }: ProductGridSkeletonProps) => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export { ProductGridSkeleton };
