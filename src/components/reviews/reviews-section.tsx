'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewSummary } from '@/components/reviews/review-summary';
import { ReviewFilters } from '@/components/reviews/review-filters';
import { ReviewList } from '@/components/reviews/review-list';

const ReviewForm = dynamic(() =>
  import('@/components/reviews/review-form').then((mod) => ({
    default: mod.ReviewForm,
  })),
);

type ReviewsSectionProps = {
  productId: string;
};

const ReviewsSectionSkeleton = () => (
  <div className='space-y-6'>
    <Skeleton className='h-8 w-48' />
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
  </div>
);

const ReviewsSectionContent = ({ productId }: ReviewsSectionProps) => {
  const { user } = useAuthStore();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className='space-y-6'>
      <h2 className='text-xl font-bold'>Customer Reviews</h2>

      <ReviewSummary productId={productId} />

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <ReviewFilters />
        {user ? (
          <Button onClick={() => setFormOpen(true)}>Write a Review</Button>
        ) : (
          <Button
            variant='outline'
            nativeButton={false}
            render={<Link href='/login' />}
          >
            Sign in to write a review
          </Button>
        )}
      </div>

      <ReviewList productId={productId} currentUserId={user?.id} />

      {user && formOpen && (
        <ReviewForm
          productId={productId}
          open={formOpen}
          onOpenChange={setFormOpen}
        />
      )}
    </section>
  );
};

const ReviewsSection = ({ productId }: ReviewsSectionProps) => (
  <Suspense fallback={<ReviewsSectionSkeleton />}>
    <ReviewsSectionContent productId={productId} />
  </Suspense>
);

export { ReviewsSection, ReviewsSectionSkeleton };
