'use client';

import type { ReviewDto } from '@/api/generated/types.gen';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StarRating } from '@/components/reviews/star-rating';
import { ReviewStatusBadge } from '@/components/reviews/review-status-badge';
import { ReviewActions } from '@/components/reviews/review-actions';

type ReviewCardProps = {
  review: ReviewDto;
  isOwn: boolean;
  productId: string;
};

const formatDate = (dateString: string): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));

const ReviewCard = ({ review, isOwn, productId }: ReviewCardProps) => {
  const title = review.title as unknown as string | undefined;
  const comment = review.comment as unknown as string | undefined;
  const firstName = review.user.firstName as unknown as string | undefined;
  const lastName = review.user.lastName as unknown as string | undefined;
  const authorName =
    [firstName, lastName].filter(Boolean).join(' ') || 'Anonymous';

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <StarRating rating={review.rating} />
              {isOwn && <ReviewStatusBadge status={review.status} />}
            </div>
            {title && <p className='text-sm font-medium'>{title}</p>}
          </div>
          {isOwn && <ReviewActions review={review} productId={productId} />}
        </div>
      </CardHeader>
      <CardContent>
        {comment && <p className='text-muted-foreground'>{comment}</p>}
        <p className='mt-2 text-xs text-muted-foreground'>
          {authorName} — {formatDate(review.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
};

export { ReviewCard };
