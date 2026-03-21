'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { reviewsControllerFindByProductOptions } from '@/api/generated/@tanstack/react-query.gen';
import { StarRating } from '@/components/reviews/star-rating';
import { Skeleton } from '@/components/ui/skeleton';

type ReviewSummaryProps = {
  productId: string;
};

const ReviewSummary = ({ productId }: ReviewSummaryProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, isLoading } = useQuery({
    ...reviewsControllerFindByProductOptions({
      path: { productId },
      query: { limit: '100' },
    }),
    staleTime: 5 * 60 * 1000,
  });

  const reviews = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const ratingCounts = [0, 0, 0, 0, 0];
  for (const review of reviews) {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  }

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleFilterClick = (rating: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = searchParams.get('rating');
    if (current === String(rating)) {
      params.delete('rating');
    } else {
      params.set('rating', String(rating));
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-4 w-24' />
      </div>
    );
  }

  if (total === 0) {
    return (
      <p className='text-sm text-muted-foreground'>
        No reviews yet. Be the first to review!
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-3'>
        <StarRating rating={average} size={20} />
        <span className='text-sm font-medium'>
          {average.toFixed(1)} out of 5
        </span>
        <span className='text-sm text-muted-foreground'>
          ({total} {total === 1 ? 'review' : 'reviews'})
        </span>
      </div>
      <div className='flex flex-col gap-1'>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingCounts[star - 1];
          const percentage =
            reviews.length > 0 ? (count / reviews.length) * 100 : 0;

          return (
            <button
              key={star}
              type='button'
              className='flex items-center gap-2 text-xs hover:opacity-80'
              onClick={() => handleFilterClick(star)}
            >
              <span className='w-12'>
                {star} star{star !== 1 ? 's' : ''}
              </span>
              <div className='h-2 flex-1 rounded-full bg-muted'>
                <div
                  className='h-full rounded-full bg-yellow-500 transition-all'
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className='w-6 text-right text-muted-foreground'>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { ReviewSummary };
