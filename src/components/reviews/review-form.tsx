'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@/lib/zod-resolver';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ReviewDto } from '@/api/generated/types.gen';
import {
  reviewsControllerCreate,
  reviewsControllerUpdate,
} from '@/api/generated/sdk.gen';
import { reviewsControllerFindByProductQueryKey } from '@/api/generated/@tanstack/react-query.gen';
import { getErrorMessage } from '@/lib/api-error';
import { reviewSchema, type ReviewFormValues } from '@/schemas/review.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StarRatingInput } from '@/components/reviews/star-rating-input';

type ReviewFormProps = {
  productId: string;
  existingReview?: ReviewDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ReviewForm = ({
  productId,
  existingReview,
  open,
  onOpenChange,
}: ReviewFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!existingReview;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating ?? 0,
      title: (existingReview?.title as unknown as string) ?? '',
      comment: (existingReview?.comment as unknown as string) ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        rating: existingReview?.rating ?? 0,
        title: (existingReview?.title as unknown as string) ?? '',
        comment: (existingReview?.comment as unknown as string) ?? '',
      });
    }
  }, [open, existingReview, reset]);

  const createReview = useMutation({
    mutationFn: (data: ReviewFormValues) =>
      reviewsControllerCreate({
        path: { productId },
        body: {
          rating: data.rating,
          title: data.title,
          comment: data.comment,
        },
        throwOnError: true,
      }),
    onSuccess: () => {
      toast.success('Review submitted! It will appear after moderation.');
      queryClient.invalidateQueries({
        queryKey: reviewsControllerFindByProductQueryKey({
          path: { productId },
        }),
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateReview = useMutation({
    mutationFn: (data: ReviewFormValues) =>
      reviewsControllerUpdate({
        path: { id: existingReview?.id ?? '' },
        body: {
          rating: data.rating,
          title: data.title || null,
          comment: data.comment,
        },
        throwOnError: true,
      }),
    onSuccess: () => {
      toast.success('Review updated! It will be re-moderated.');
      queryClient.invalidateQueries({
        queryKey: reviewsControllerFindByProductQueryKey({
          path: { productId },
        }),
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const isPending = createReview.isPending || updateReview.isPending;

  const onSubmit = (data: ReviewFormValues) => {
    if (isEditing) {
      updateReview.mutate(data);
    } else {
      createReview.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Review' : 'Write a Review'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your review. It will be re-moderated after changes.'
              : 'Share your experience with this product.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-2'>
            <Label>Rating</Label>
            <Controller
              name='rating'
              control={control}
              render={({ field }) => (
                <StarRatingInput
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.rating && (
              <p className='text-xs text-destructive'>
                {errors.rating.message}
              </p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='review-title'>Title (optional)</Label>
            <Input
              id='review-title'
              placeholder='Summarize your experience'
              {...register('title')}
            />
            {errors.title && (
              <p className='text-xs text-destructive'>{errors.title.message}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='review-comment'>Review</Label>
            <textarea
              id='review-comment'
              className='border-input bg-background placeholder:text-muted-foreground min-h-24 w-full rounded-none border px-3 py-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50'
              placeholder='Tell others about your experience...'
              {...register('comment')}
            />
            {errors.comment && (
              <p className='text-xs text-destructive'>
                {errors.comment.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending
                ? 'Submitting...'
                : isEditing
                  ? 'Update Review'
                  : 'Submit Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { ReviewForm };
