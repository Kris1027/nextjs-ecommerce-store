'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ordersControllerCancelOrder,
  ordersControllerRequestRefund,
} from '@/api/generated/sdk.gen';
import {
  ordersControllerGetRefundRequestOptions,
  ordersControllerGetMyOrderByIdQueryKey,
  ordersControllerGetMyOrdersQueryKey,
} from '@/api/generated/@tanstack/react-query.gen';
import { getErrorMessage } from '@/lib/api-error';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';

type OrderActionsProps = {
  orderId: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';
};

const OrderActions = ({ orderId, status }: OrderActionsProps) => {
  const queryClient = useQueryClient();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const canCancel = status === 'PENDING' || status === 'CONFIRMED';
  const canRefund = status === 'DELIVERED' || status === 'CONFIRMED';

  const { data: refundData, isError: refundNotFound } = useQuery({
    ...ordersControllerGetRefundRequestOptions({
      path: { id: orderId },
    }),
    enabled: canRefund,
    retry: false,
  });

  const existingRefund = refundNotFound ? undefined : refundData?.data;

  const cancelOrder = useMutation({
    mutationFn: () =>
      ordersControllerCancelOrder({
        path: { id: orderId },
        throwOnError: true,
      }),
    onSuccess: () => {
      toast.success('Order cancelled successfully.');
      queryClient.invalidateQueries({
        queryKey: ordersControllerGetMyOrderByIdQueryKey({
          path: { id: orderId },
        }),
      });
      queryClient.invalidateQueries({
        queryKey: ordersControllerGetMyOrdersQueryKey(),
      });
      setCancelOpen(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const requestRefund = useMutation({
    mutationFn: () =>
      ordersControllerRequestRefund({
        path: { id: orderId },
        body: { reason: refundReason },
        throwOnError: true,
      }),
    onSuccess: () => {
      toast.success('Refund request submitted.');
      queryClient.invalidateQueries({
        queryKey: ordersControllerGetMyOrderByIdQueryKey({
          path: { id: orderId },
        }),
      });
      queryClient.invalidateQueries({
        queryKey: ordersControllerGetMyOrdersQueryKey(),
      });
      setRefundOpen(false);
      setRefundReason('');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  if (!canCancel && !canRefund) return null;

  return (
    <div className='flex gap-3'>
      {canCancel && (
        <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <DialogTrigger render={<Button variant='destructive' />}>
            Cancel order
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setCancelOpen(false)}>
                Keep order
              </Button>
              <Button
                variant='destructive'
                disabled={cancelOrder.isPending}
                onClick={() => cancelOrder.mutate()}
              >
                {cancelOrder.isPending ? 'Cancelling...' : 'Yes, cancel order'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {canRefund && existingRefund && (
        <div className='flex items-center gap-2 rounded-lg border p-3'>
          <span className='text-sm'>Refund request:</span>
          <OrderStatusBadge
            status={
              existingRefund.status === 'PENDING'
                ? 'PENDING'
                : existingRefund.status === 'APPROVED' ||
                    existingRefund.status === 'COMPLETED'
                  ? 'DELIVERED'
                  : 'CANCELLED'
            }
          />
          <span className='text-muted-foreground text-sm'>
            {existingRefund.status === 'PENDING' && 'Under review'}
            {existingRefund.status === 'APPROVED' && 'Approved'}
            {existingRefund.status === 'COMPLETED' && 'Completed'}
            {existingRefund.status === 'REJECTED' && 'Rejected'}
          </span>
        </div>
      )}

      {canRefund && !existingRefund && (
        <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
          <DialogTrigger render={<Button variant='outline' />}>
            Request refund
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request refund</DialogTitle>
              <DialogDescription>
                Please describe the reason for your refund request.
              </DialogDescription>
            </DialogHeader>
            <label htmlFor='refund-reason' className='sr-only'>
              Reason for refund
            </label>
            <textarea
              id='refund-reason'
              className='border-input bg-background placeholder:text-muted-foreground min-h-24 w-full rounded-md border px-3 py-2 text-sm'
              placeholder='Reason for refund...'
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
            <DialogFooter>
              <Button variant='outline' onClick={() => setRefundOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={requestRefund.isPending || !refundReason.trim()}
                onClick={() => requestRefund.mutate()}
              >
                {requestRefund.isPending ? 'Submitting...' : 'Submit request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export { OrderActions };
