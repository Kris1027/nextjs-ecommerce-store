import { Skeleton } from '@/components/ui/skeleton';
import { ProductGridSkeleton } from '@/components/skeletons/product-grid-skeleton';

const RelatedProductsSkeleton = () => {
  return (
    <section className='space-y-4'>
      <Skeleton className='h-7 w-40' />
      <ProductGridSkeleton count={4} />
    </section>
  );
};

export { RelatedProductsSkeleton };
