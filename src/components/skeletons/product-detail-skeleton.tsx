import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetailSkeleton = () => {
  return (
    <div className='grid gap-8 md:grid-cols-2'>
      <div className='space-y-4'>
        <Skeleton className='aspect-square w-full rounded-lg' />
        <div className='flex gap-2'>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className='h-20 w-20 shrink-0 rounded-md' />
          ))}
        </div>
      </div>

      <div className='space-y-6'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-3/4' />
          <Skeleton className='h-4 w-24' />
        </div>

        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-32' />
        </div>

        <Skeleton className='h-6 w-20 rounded-full' />

        <Separator />

        <div className='space-y-2'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
        </div>

        <Separator />

        <div className='flex items-center gap-4'>
          <Skeleton className='h-10 w-28 rounded-md' />
          <Skeleton className='h-10 flex-1 rounded-md' />
        </div>
      </div>
    </div>
  );
};

export { ProductDetailSkeleton };
