import { Suspense } from 'react';
import type { Metadata } from 'next';
import { OrderDetailPage } from '@/components/orders/order-detail-page';

export const metadata: Metadata = {
  title: 'Order Details',
};

type OrderDetailRouteProps = {
  params: Promise<{ id: string }>;
};

const OrderDetailRoute = async ({ params }: OrderDetailRouteProps) => {
  const { id } = await params;

  return (
    <Suspense>
      <OrderDetailPage orderId={id} />
    </Suspense>
  );
};

export default OrderDetailRoute;
