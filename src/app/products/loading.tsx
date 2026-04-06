import { Skeleton } from '@/components/ui/skeleton';
import { ProductGridSkeleton } from '@/components/skeletons/product-grid-skeleton';
import { ProductFiltersSkeleton } from '@/components/skeletons/product-filters-skeleton';

const ProductsLoading = () => {
  return (
    <div className='mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8'>
      <div>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='mt-1 h-4 w-48' />
      </div>

      <div className='flex flex-col gap-6 lg:flex-row'>
        <aside className='hidden w-full shrink-0 lg:block lg:w-64'>
          <ProductFiltersSkeleton />
        </aside>

        <div className='flex-1 space-y-4'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-9 w-24 rounded-md lg:hidden' />
            <Skeleton className='h-9 w-44 rounded-md' />
          </div>
          <ProductGridSkeleton count={12} />
          <div className='flex justify-center gap-2'>
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className='h-9 w-9 rounded-md' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsLoading;
