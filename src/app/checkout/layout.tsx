import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false },
};

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default CheckoutLayout;
