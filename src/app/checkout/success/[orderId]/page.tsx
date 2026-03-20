import { PaymentSuccessPage } from '@/components/checkout/payment-success-page';

const CheckoutSuccessPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await params;

  return <PaymentSuccessPage orderId={orderId} />;
};

export default CheckoutSuccessPage;
