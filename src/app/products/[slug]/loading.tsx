import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ProductDetailSkeleton } from '@/components/skeletons/product-detail-skeleton';
import { RelatedProductsSkeleton } from '@/components/skeletons/related-products-skeleton';

const ProductLoading = () => {
  return (
    <div className='space-y-12'>
      <div className='flex items-center gap-2'>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className='flex items-center gap-2'>
            <Skeleton className='h-4 w-16' />
            {i < 2 && <Skeleton className='h-4 w-2' />}
          </div>
        ))}
      </div>

      <ProductDetailSkeleton />

      <section className='space-y-6'>
        <Skeleton className='h-7 w-48' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-24' />
        </div>
        {Array.from({ length: 2 }, (_, i) => (
          <Card key={i}>
            <CardContent className='flex flex-col gap-3'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-16 w-full' />
            </CardContent>
          </Card>
        ))}
      </section>

      <RelatedProductsSkeleton />
    </div>
  );
};

export default ProductLoading;
