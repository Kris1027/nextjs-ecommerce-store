import { PaymentPage } from '@/components/checkout/payment-page';

const CheckoutPaymentPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await params;

  return <PaymentPage orderId={orderId} />;
};

export default CheckoutPaymentPage;
