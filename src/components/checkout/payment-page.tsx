'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import {
  ordersControllerGetMyOrderById,
  paymentsControllerCreatePaymentIntent,
} from '@/api/generated/sdk.gen';
import { useAuthStore } from '@/stores/auth.store';
import { getStripe } from '@/lib/stripe';
import { getErrorMessage } from '@/lib/api-error';
import { OrderSummary } from '@/components/checkout/order-summary';
import { StripePaymentForm } from '@/components/checkout/stripe-payment-form';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type PaymentPageProps = {
  orderId: string;
};

const stripePromise = getStripe();

export const PaymentPage = ({ orderId }: PaymentPageProps) => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/checkout/payment/' + orderId);
    }
  }, [isHydrated, accessToken, router, orderId]);

  const { data: orderData, isLoading: isOrderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () =>
      ordersControllerGetMyOrderById({
        path: { id: orderId },
        throwOnError: true,
      }),
    enabled: !!accessToken,
  });

  const {
    data: intentData,
    isLoading: isIntentLoading,
    isError: isIntentError,
    error: intentError,
    refetch: retryIntent,
  } = useQuery({
    queryKey: ['payment-intent', orderId],
    queryFn: () =>
      paymentsControllerCreatePaymentIntent({
        body: { orderId },
        throwOnError: true,
      }),
    enabled: !!accessToken,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isIntentError && intentError) {
      toast.error(getErrorMessage(intentError));
    }
  }, [isIntentError, intentError]);

  if (!isHydrated) {
    return (
      <div className='container mx-auto max-w-5xl px-4 py-8'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  if (!accessToken) return null;

  const clientSecret = intentData?.data?.data?.clientSecret;
  const order = orderData?.data?.data;

  const isLoading = isOrderLoading || isIntentLoading;

  if (isLoading) {
    return (
      <div className='container mx-auto max-w-5xl px-4 py-8'>
        <h1 className='mb-8 text-2xl font-bold'>Payment</h1>
        <div className='grid gap-8 lg:grid-cols-2'>
          <Card className='p-6'>
            <Skeleton className='mb-4 h-6 w-32' />
            <Skeleton className='mb-2 h-10 w-full' />
            <Skeleton className='mb-2 h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </Card>
          <Card className='p-6'>
            <Skeleton className='mb-4 h-6 w-40' />
            <Skeleton className='mb-2 h-4 w-full' />
            <Skeleton className='mb-2 h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </Card>
        </div>
      </div>
    );
  }

  if (isIntentError || !clientSecret) {
    return (
      <div className='container mx-auto max-w-5xl px-4 py-8 text-center'>
        <h1 className='mb-4 text-2xl font-bold'>Payment error</h1>
        <p className='text-muted-foreground mb-6'>
          Failed to initialize payment. Please try again.
        </p>
        <Button onClick={() => retryIntent()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-5xl px-4 py-8'>
      <h1 className='mb-8 text-2xl font-bold'>Payment</h1>
      <div className='grid gap-8 lg:grid-cols-2'>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: 'stripe' },
            locale: 'pl',
          }}
        >
          <StripePaymentForm orderId={orderId} />
        </Elements>
        {order && <OrderSummary order={order} />}
      </div>
    </div>
  );
};
