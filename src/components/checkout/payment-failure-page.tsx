'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  paymentsControllerGetPaymentByOrderId,
  ordersControllerCancelOrder,
} from '@/api/generated/sdk.gen';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/lib/api-error';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { XCircleIcon } from '@phosphor-icons/react';

type PaymentFailurePageProps = {
  orderId: string;
};

export const PaymentFailurePage = ({ orderId }: PaymentFailurePageProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/checkout/failure/' + orderId);
    }
  }, [isHydrated, accessToken, router, orderId]);

  const { data: paymentData, isLoading } = useQuery({
    queryKey: ['payment', orderId],
    queryFn: () =>
      paymentsControllerGetPaymentByOrderId({
        path: { orderId },
        throwOnError: true,
      }),
    enabled: !!accessToken,
  });

  const cancelOrder = useMutation({
    mutationFn: () =>
      ordersControllerCancelOrder({
        path: { id: orderId },
        throwOnError: true,
      }),
    onSuccess: () => {
      toast.success('Order cancelled.');
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      router.push('/account/orders');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  if (!isHydrated) {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-8'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  if (!accessToken) return null;

  if (isLoading) {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-8'>
        <Card className='p-8'>
          <Skeleton className='mx-auto mb-4 h-12 w-12 rounded-full' />
          <Skeleton className='mx-auto mb-2 h-6 w-48' />
          <Skeleton className='mx-auto h-4 w-64' />
        </Card>
      </div>
    );
  }

  const payment = paymentData?.data?.data;
  const failureMessage = payment?.failureMessage;

  return (
    <div className='container mx-auto max-w-2xl px-4 py-8'>
      <Card className='p-8 text-center'>
        <XCircleIcon
          weight='fill'
          className='mx-auto mb-4 h-12 w-12 text-red-600'
        />
        <h1 className='mb-2 text-2xl font-bold'>Payment failed</h1>
        <p className='text-muted-foreground mb-6'>
          {failureMessage ?? 'Your payment could not be processed.'}
        </p>
        <div className='flex justify-center gap-4'>
          <Button
            variant='outline'
            disabled={cancelOrder.isPending}
            onClick={() => {
              if (
                window.confirm('Are you sure you want to cancel this order?')
              ) {
                cancelOrder.mutate();
              }
            }}
          >
            {cancelOrder.isPending ? 'Cancelling...' : 'Cancel order'}
          </Button>
          <Button onClick={() => router.push(`/checkout/payment/${orderId}`)}>
            Try again
          </Button>
        </div>
      </Card>
    </div>
  );
};
