'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  paymentsControllerGetPaymentByOrderId,
  ordersControllerGetMyOrderById,
} from '@/api/generated/sdk.gen';
import { useAuthStore } from '@/stores/auth.store';
import { formatPrice } from '@/lib/format';
import { getErrorMessage } from '@/lib/api-error';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckCircleIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';

type PaymentSuccessPageProps = {
  orderId: string;
};

const POLL_INTERVAL = 3000;
const MAX_POLLS = 10;

export const PaymentSuccessPage = ({ orderId }: PaymentSuccessPageProps) => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/checkout/success/' + orderId);
    }
  }, [isHydrated, accessToken, router, orderId]);

  const {
    data: paymentData,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
    error: paymentError,
  } = useQuery({
    queryKey: ['payment', orderId],
    queryFn: () =>
      paymentsControllerGetPaymentByOrderId({
        path: { orderId },
        throwOnError: true,
      }),
    enabled: !!accessToken,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.data?.status;
      const fetchCount = query.state.dataUpdateCount;
      if (status === 'PENDING' && fetchCount < MAX_POLLS) {
        return POLL_INTERVAL;
      }
      return false;
    },
  });

  const { data: orderData, isLoading: isOrderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () =>
      ordersControllerGetMyOrderById({
        path: { id: orderId },
        throwOnError: true,
      }),
    enabled: !!accessToken,
  });

  useEffect(() => {
    const status = paymentData?.data?.data?.status;
    if (status === 'FAILED') {
      router.replace(`/checkout/failure/${orderId}`);
    }
  }, [paymentData, router, orderId]);

  if (!isHydrated) {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-8'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  if (!accessToken) return null;

  const payment = paymentData?.data?.data;
  const order = orderData?.data?.data;
  const isLoading = isPaymentLoading || isOrderLoading;

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

  if (isPaymentError) {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-8'>
        <Card className='p-8 text-center'>
          <WarningCircleIcon
            weight='fill'
            className='mx-auto mb-4 h-12 w-12 text-red-600'
          />
          <h1 className='mb-2 text-2xl font-bold'>Something went wrong</h1>
          <p className='text-muted-foreground mb-6'>
            {getErrorMessage(paymentError)}
          </p>
          <Button onClick={() => router.push('/account/orders')}>
            View orders
          </Button>
        </Card>
      </div>
    );
  }

  if (payment?.status === 'PENDING') {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-8'>
        <Card className='p-8 text-center'>
          <SpinnerGapIcon className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
          <h1 className='mb-2 text-2xl font-bold'>
            Processing your payment...
          </h1>
          <p className='text-muted-foreground'>
            This usually takes a few seconds.
          </p>
        </Card>
      </div>
    );
  }

  if (payment?.status === 'SUCCEEDED') {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-8'>
        <Card className='p-8 text-center'>
          <CheckCircleIcon
            weight='fill'
            className='mx-auto mb-4 h-12 w-12 text-green-600'
          />
          <h1 className='mb-2 text-2xl font-bold'>Payment successful!</h1>
          <p className='text-muted-foreground mb-6'>
            Thank you for your order.
            {order && (
              <>
                {' '}
                Order <span className='font-medium'>
                  #{order.orderNumber}
                </span>{' '}
                — {formatPrice(order.total)} paid.
              </>
            )}
          </p>
          <div className='flex justify-center gap-4'>
            <Button variant='outline' onClick={() => router.push('/products')}>
              Continue shopping
            </Button>
            <Button onClick={() => router.push('/account/orders')}>
              View orders
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-2xl px-4 py-8'>
      <Card className='p-8 text-center'>
        <WarningCircleIcon className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
        <h1 className='mb-2 text-2xl font-bold'>Unknown payment status</h1>
        <p className='text-muted-foreground mb-6'>
          Please check your orders for the latest status.
        </p>
        <Button onClick={() => router.push('/account/orders')}>
          View orders
        </Button>
      </Card>
    </div>
  );
};
