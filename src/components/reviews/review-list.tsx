'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { reviewsControllerFindByProductOptions } from '@/api/generated/@tanstack/react-query.gen';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewCard } from '@/components/reviews/review-card';
import { ProductPagination } from '@/components/products/product-pagination';

type ReviewListProps = {
  productId: string;
  currentUserId?: string;
};

const ReviewList = ({ productId, currentUserId }: ReviewListProps) => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const ratingParam = searchParams.get('rating');
  const parsedRating = ratingParam ? Number(ratingParam) : null;
  const rating =
    parsedRating &&
    Number.isInteger(parsedRating) &&
    parsedRating >= 1 &&
    parsedRating <= 5
      ? parsedRating
      : null;

  const { data, isLoading, isError } = useQuery({
    ...reviewsControllerFindByProductOptions({
      path: { productId },
      query: {
        page,
        limit: '10',
        ...(rating ? { rating } : {}),
      },
    }),
  });

  const reviews = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i}>
            <CardContent className='flex flex-col gap-3'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-48' />
              <Skeleton className='h-16 w-full' />
              <Skeleton className='h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent>
          <p className='text-sm text-destructive'>
            Failed to load reviews. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            {rating ? 'No reviews match this filter.' : 'No reviews yet.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          isOwn={review.user.id === currentUserId}
          productId={productId}
        />
      ))}
      {meta && <ProductPagination meta={meta} />}
    </div>
  );
};

export { ReviewList };
