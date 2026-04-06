import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ProductGridSkeleton } from '@/components/skeletons/product-grid-skeleton';
import { ProductFiltersSkeleton } from '@/components/skeletons/product-filters-skeleton';

const CategoryLoading = () => {
  return (
    <div className='mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8'>
      <div className='flex items-center gap-2'>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className='flex items-center gap-2'>
            <Skeleton className='h-4 w-16' />
            {i < 2 && <Skeleton className='h-4 w-2' />}
          </div>
        ))}
      </div>

      <div>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='mt-1 h-4 w-72' />
        <Skeleton className='mt-1 h-4 w-32' />
      </div>

      <section className='space-y-4'>
        <Skeleton className='h-6 w-32' />
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className='overflow-hidden'>
              <div className='aspect-video bg-muted'>
                <Skeleton className='h-full w-full' />
              </div>
              <CardContent className='p-3'>
                <Skeleton className='h-4 w-20' />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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

export default CategoryLoading;
