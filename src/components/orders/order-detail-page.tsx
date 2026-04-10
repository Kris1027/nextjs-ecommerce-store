'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, WarningCircleIcon } from '@phosphor-icons/react';
import {
  ordersControllerGetMyOrderByIdOptions,
  paymentsControllerGetPaymentByOrderIdOptions,
} from '@/api/generated/@tanstack/react-query.gen';
import { useAuthStore } from '@/stores/auth.store';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusTimeline } from '@/components/orders/order-status-timeline';
import { OrderActions } from '@/components/orders/order-actions';

type OrderDetailPageProps = {
  orderId: string;
};

const OrderDetailPage = ({ orderId }: OrderDetailPageProps) => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace(`/login?redirect=/account/orders/${orderId}`);
    }
  }, [isHydrated, accessToken, router, orderId]);

  const { data, isLoading, isError, error } = useQuery({
    ...ordersControllerGetMyOrderByIdOptions({
      path: { id: orderId },
    }),
    enabled: !!accessToken,
  });

  const { data: paymentData } = useQuery({
    ...paymentsControllerGetPaymentByOrderIdOptions({
      path: { orderId },
    }),
    enabled: !!accessToken,
    retry: false,
  });

  if (!isHydrated) {
    return <p className='text-muted-foreground'>Loading...</p>;
  }

  if (!accessToken) return null;

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-16 w-full' />
        <Card className='p-6'>
          <Skeleton className='mb-4 h-5 w-24' />
          <Skeleton className='mb-2 h-12 w-full' />
          <Skeleton className='mb-2 h-12 w-full' />
          <Skeleton className='h-12 w-full' />
        </Card>
      </div>
    );
  }

  if (isError) {
    const is404 =
      (error as { status?: number }).status === 404 ||
      (error as { response?: { status?: number } }).response?.status === 404;

    return (
      <p className={is404 ? 'text-muted-foreground' : 'text-destructive'}>
        {is404
          ? 'Order not found.'
          : 'Failed to load order. Please try again later.'}
      </p>
    );
  }

  const order = data?.data;
  const payment = paymentData?.data;

  if (!order) return null;

  const isUnpaid =
    order.status === 'PENDING' && payment?.status !== 'SUCCEEDED';
  const expiresAt = new Date(
    new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000,
  );
  const now = new Date();
  const msRemaining = expiresAt.getTime() - now.getTime();
  const hoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor(
    (msRemaining % (1000 * 60 * 60)) / (1000 * 60),
  );

  const couponCode = order.couponCode;
  const shippingRegion = order.shippingRegion;
  const discount = Number(order.discountAmount);
  const formattedDate = new Date(order.createdAt).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className='space-y-6'>
      <Link
        href='/account/orders'
        className='text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm transition-colors'
      >
        <ArrowLeftIcon size={14} />
        Back to orders
      </Link>

      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Order #{order.orderNumber}</h1>
        <p className='text-muted-foreground text-sm'>{formattedDate}</p>
      </div>

      <div className='mb-6'>
        <OrderStatusTimeline status={order.status} />
      </div>

      {payment && (
        <div className='mb-6 flex items-center gap-2'>
          <span className='text-sm font-medium'>Payment:</span>
          <Badge
            variant={
              payment.status === 'SUCCEEDED'
                ? 'default'
                : payment.status === 'FAILED'
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {payment.status === 'SUCCEEDED' && 'Paid'}
            {payment.status === 'PENDING' && 'Pending'}
            {payment.status === 'FAILED' && 'Failed'}
            {payment.status === 'REFUND_PENDING' && 'Refund Pending'}
            {payment.status === 'REFUNDED' && 'Refunded'}
            {payment.status === 'PARTIALLY_REFUNDED' && 'Partially Refunded'}
          </Badge>
        </div>
      )}

      {isUnpaid && (
        <div className='mb-6 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-950/20'>
          <WarningCircleIcon
            size={20}
            className='mt-0.5 shrink-0 text-amber-600'
          />
          <div className='text-sm'>
            {msRemaining <= 0 ? (
              <p className='text-destructive font-medium'>
                This order has expired and will be cancelled.
              </p>
            ) : (
              <p className='text-amber-800 dark:text-amber-200'>
                This order will be automatically cancelled if not paid within 24
                hours.{' '}
                <span className='font-medium'>
                  {hoursRemaining > 0
                    ? `${hoursRemaining}h ${minutesRemaining}m remaining.`
                    : `${minutesRemaining}m remaining.`}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      <Card className='mb-6 p-6'>
        <h2 className='mb-4 text-lg font-semibold'>Items</h2>
        <div className='space-y-3'>
          {order.items.map((item) => {
            const imageUrl = item.productImageUrl;

            return (
              <div key={item.id} className='flex items-center gap-3'>
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={item.productName}
                    width={48}
                    height={48}
                    className='rounded-md object-cover'
                  />
                )}
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{item.productName}</p>
                  <p className='text-muted-foreground text-xs'>
                    {item.quantity} x {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className='text-sm font-medium'>
                  {formatPrice(item.lineTotal)}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className='mb-6 p-6'>
        <h2 className='mb-4 text-lg font-semibold'>Shipping address</h2>
        <div className='text-muted-foreground text-sm'>
          <p>{order.shippingFullName}</p>
          <p>{order.shippingStreet}</p>
          <p>
            {order.shippingPostalCode} {order.shippingCity}
            {shippingRegion ? `, ${shippingRegion}` : ''}
          </p>
          <p>{order.shippingCountry}</p>
          <p>{order.shippingPhone}</p>
        </div>
      </Card>

      <Card className='mb-6 p-6'>
        <h2 className='mb-4 text-lg font-semibold'>Price breakdown</h2>
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span>Shipping</span>
            <span>{formatPrice(order.shippingCost)}</span>
          </div>
          {discount > 0 && (
            <div className='flex justify-between text-sm text-green-600'>
              <span>Discount{couponCode ? ` (${couponCode})` : ''}</span>
              <span>-{formatPrice(order.discountAmount)}</span>
            </div>
          )}
          {Number(order.tax) > 0 && (
            <div className='flex justify-between text-sm'>
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
          )}
          <Separator />
          <div className='flex justify-between font-medium'>
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </Card>

      <div className='flex gap-3'>
        {isUnpaid && msRemaining > 0 && (
          <Button
            nativeButton={false}
            render={<Link href={`/checkout/payment/${orderId}`} />}
          >
            Pay Now
          </Button>
        )}
        <OrderActions orderId={orderId} status={order.status} />
      </div>
    </div>
  );
};

export { OrderDetailPage };
