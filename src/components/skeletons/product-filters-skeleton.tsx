import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const ProductFiltersSkeleton = () => {
  return (
    <div className='space-y-6 rounded-lg border p-4'>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-4.5 w-4.5' />
        <Skeleton className='h-5 w-14' />
      </div>

      <Separator />

      <div className='space-y-2'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-9 w-full rounded-md' />
      </div>

      <Separator />

      <div className='space-y-2'>
        <Skeleton className='h-4 w-28' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 flex-1 rounded-md' />
          <Skeleton className='h-4 w-3' />
          <Skeleton className='h-9 flex-1 rounded-md' />
        </div>
        <Skeleton className='h-8 w-full rounded-md' />
      </div>

      <Separator />

      <div className='space-y-2'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-9 w-full rounded-md' />
      </div>
    </div>
  );
};

export { ProductFiltersSkeleton };
