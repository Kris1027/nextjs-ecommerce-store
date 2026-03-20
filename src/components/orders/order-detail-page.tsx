'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { ordersControllerGetMyOrderByIdOptions } from '@/api/generated/@tanstack/react-query.gen';
import { useAuthStore } from '@/stores/auth.store';
import { formatPrice } from '@/lib/format';
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

  if (!isHydrated) {
    return (
      <div className='container mx-auto max-w-3xl px-4 py-8'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  if (!accessToken) return null;

  if (isLoading) {
    return (
      <div className='container mx-auto max-w-3xl px-4 py-8'>
        <Skeleton className='mb-6 h-5 w-32' />
        <Skeleton className='mb-2 h-8 w-64' />
        <Skeleton className='mb-6 h-4 w-40' />
        <Skeleton className='mb-6 h-16 w-full' />
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
      <div className='container mx-auto max-w-3xl px-4 py-8'>
        <p className={is404 ? 'text-muted-foreground' : 'text-destructive'}>
          {is404
            ? 'Order not found.'
            : 'Failed to load order. Please try again later.'}
        </p>
      </div>
    );
  }

  const order = data?.data;

  if (!order) return null;

  const couponCode = order.couponCode as unknown as string | null;
  const shippingRegion = order.shippingRegion as unknown as string | null;
  const discount = Number(order.discountAmount);
  const formattedDate = new Date(order.createdAt).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className='container mx-auto max-w-3xl px-4 py-8'>
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

      <Card className='mb-6 p-6'>
        <h2 className='mb-4 text-lg font-semibold'>Items</h2>
        <div className='space-y-3'>
          {order.items.map((item) => {
            const imageUrl = item.productImageUrl as unknown as string | null;

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

      <OrderActions orderId={orderId} status={order.status} />
    </div>
  );
};

export { OrderDetailPage };
