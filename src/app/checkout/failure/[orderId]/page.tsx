'use client';

import { use } from 'react';
import { PaymentFailurePage } from '@/components/checkout/payment-failure-page';

const CheckoutFailurePage = ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = use(params);

  return <PaymentFailurePage orderId={orderId} />;
};

export default CheckoutFailurePage;
