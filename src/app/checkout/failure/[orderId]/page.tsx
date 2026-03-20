import { PaymentFailurePage } from '@/components/checkout/payment-failure-page';

const CheckoutFailurePage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await params;

  return <PaymentFailurePage orderId={orderId} />;
};

export default CheckoutFailurePage;
