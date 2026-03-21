'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ordersControllerGetMyOrdersOptions } from '@/api/generated/@tanstack/react-query.gen';
import { useAuthStore } from '@/stores/auth.store';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductPagination } from '@/components/products/product-pagination';
import { OrderListCard } from '@/components/orders/order-list-card';
import { OrderStatusFilter } from '@/components/orders/order-status-filter';

const OrderListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const page = searchParams.get('page') ?? '1';
  const status = searchParams.get('status') as
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | undefined;

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/account/orders');
    }
  }, [isHydrated, accessToken, router]);

  const { data, isLoading, isError } = useQuery({
    ...ordersControllerGetMyOrdersOptions({
      query: {
        page,
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: status ?? undefined,
      },
    }),
    enabled: !!accessToken,
  });

  if (!isHydrated) {
    return <p className='text-muted-foreground'>Loading...</p>;
  }

  if (!accessToken) return null;

  const orders = data?.data;
  const meta = data?.meta;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>My Orders</h1>
        <OrderStatusFilter />
      </div>

      {isLoading && (
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <Skeleton className='h-5 w-32' />
                  <Skeleton className='h-4 w-24' />
                </div>
                <div className='flex items-center gap-4'>
                  <Skeleton className='h-5 w-20' />
                  <Skeleton className='h-5 w-16' />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <Card className='p-8 text-center'>
          <p className='text-destructive'>
            Failed to load orders. Please try again later.
          </p>
        </Card>
      )}

      {!isLoading && !isError && orders && orders.length === 0 && (
        <Card className='p-8 text-center'>
          <p className='text-muted-foreground'>No orders yet.</p>
        </Card>
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className='space-y-3'>
          {orders.map((order) => (
            <OrderListCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {meta && (
        <div className='mt-6'>
          <ProductPagination meta={meta} />
        </div>
      )}
    </div>
  );
};

export { OrderListPage };
