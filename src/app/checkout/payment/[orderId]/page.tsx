'use client';

import { use } from 'react';
import { PaymentPage } from '@/components/checkout/payment-page';

const CheckoutPaymentPage = ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = use(params);

  return <PaymentPage orderId={orderId} />;
};

export default CheckoutPaymentPage;
