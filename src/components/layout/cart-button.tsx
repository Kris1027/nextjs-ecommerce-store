'use client';

import Link from 'next/link';
import { ShoppingCart } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

const CartButton = () => {
  return (
    <Button
      variant='ghost'
      size='icon'
      render={<Link href='/cart' />}
      aria-label='Shopping cart'
    >
      <ShoppingCart size={18} />
    </Button>
  );
};

export { CartButton };
