import type { Metadata } from 'next';
import { CartContent } from '@/components/cart/cart-content';

export const metadata: Metadata = {
  title: 'Cart | Ecommerce Store',
  description: 'View and manage items in your shopping cart.',
};

const CartPage = () => {
  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      <h1 className='text-2xl font-bold'>Shopping Cart</h1>
      <CartContent />
    </div>
  );
};

export default CartPage;
