import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProductCardSkeleton = () => {
  return (
    <Card className='overflow-hidden'>
      <div className='relative aspect-square bg-muted'>
        <Skeleton className='h-full w-full' />
      </div>

      <CardContent className='p-3'>
        <Skeleton className='mb-1.5 h-5 w-16 rounded-full' />
        <Skeleton className='h-4 w-3/4' />
        <div className='mt-1 flex items-center gap-2'>
          <Skeleton className='h-4 w-16' />
        </div>
      </CardContent>

      <CardFooter className='p-3 pt-0'>
        <Skeleton className='h-8 w-full rounded-md' />
      </CardFooter>
    </Card>
  );
};

export { ProductCardSkeleton };
