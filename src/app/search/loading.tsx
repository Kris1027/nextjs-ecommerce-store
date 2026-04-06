import { Skeleton } from '@/components/ui/skeleton';
import { ProductGridSkeleton } from '@/components/skeletons/product-grid-skeleton';

const SearchLoading = () => {
  return (
    <div className='mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8'>
      <div>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='mt-1 h-4 w-32' />
      </div>

      <div className='space-y-4'>
        <Skeleton className='h-9 w-44 rounded-md' />
        <ProductGridSkeleton count={12} />
        <div className='flex justify-center gap-2'>
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className='h-9 w-9 rounded-md' />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchLoading;
