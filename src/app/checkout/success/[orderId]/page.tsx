'use client';

import { use } from 'react';
import { PaymentSuccessPage } from '@/components/checkout/payment-success-page';

const CheckoutSuccessPage = ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = use(params);

  return <PaymentSuccessPage orderId={orderId} />;
};

export default CheckoutSuccessPage;
