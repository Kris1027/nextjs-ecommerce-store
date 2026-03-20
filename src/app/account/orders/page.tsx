import { Suspense } from 'react';
import type { Metadata } from 'next';
import { OrderListPage } from '@/components/orders/order-list-page';

export const metadata: Metadata = {
  title: 'My Orders',
};

const OrdersPage = () => {
  return (
    <Suspense>
      <OrderListPage />
    </Suspense>
  );
};

export default OrdersPage;
