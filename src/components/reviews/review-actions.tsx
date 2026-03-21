'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import type { ReviewDto } from '@/api/generated/types.gen';
import { reviewsControllerDelete } from '@/api/generated/sdk.gen';
import { reviewsControllerFindByProductQueryKey } from '@/api/generated/@tanstack/react-query.gen';
import { getErrorMessage } from '@/lib/api-error';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReviewForm } from '@/components/reviews/review-form';

type ReviewActionsProps = {
  review: ReviewDto;
  productId: string;
};

const ReviewActions = ({ review, productId }: ReviewActionsProps) => {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteReview = useMutation({
    mutationFn: () =>
      reviewsControllerDelete({
        path: { id: review.id },
        throwOnError: true,
      }),
    onSuccess: () => {
      toast.success('Review deleted.');
      queryClient.invalidateQueries({
        queryKey: reviewsControllerFindByProductQueryKey({
          path: { productId },
        }),
      });
      setDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <>
      <div className='flex gap-1'>
        <Button
          variant='ghost'
          size='icon-sm'
          aria-label='Edit review'
          onClick={() => setEditOpen(true)}
        >
          <PencilSimpleIcon size={14} />
        </Button>
        <Button
          variant='ghost'
          size='icon-sm'
          aria-label='Delete review'
          onClick={() => setDeleteOpen(true)}
        >
          <TrashIcon size={14} />
        </Button>
      </div>

      <ReviewForm
        productId={productId}
        existingReview={review}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              disabled={deleteReview.isPending}
              onClick={() => deleteReview.mutate()}
            >
              {deleteReview.isPending ? 'Deleting...' : 'Delete review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ReviewActions };
