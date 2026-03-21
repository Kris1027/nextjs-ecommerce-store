'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { ReviewSummary } from '@/components/reviews/review-summary';
import { ReviewFilters } from '@/components/reviews/review-filters';
import { ReviewList } from '@/components/reviews/review-list';
import { ReviewForm } from '@/components/reviews/review-form';

type ReviewsSectionProps = {
  productId: string;
};

const ReviewsSection = ({ productId }: ReviewsSectionProps) => {
  const { user } = useAuthStore();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className='space-y-6'>
      <h2 className='text-xl font-bold'>Customer Reviews</h2>

      <ReviewSummary productId={productId} />

      <div className='flex items-center justify-between gap-4'>
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

      {user && (
        <ReviewForm
          productId={productId}
          open={formOpen}
          onOpenChange={setFormOpen}
        />
      )}
    </section>
  );
};

export { ReviewsSection };
