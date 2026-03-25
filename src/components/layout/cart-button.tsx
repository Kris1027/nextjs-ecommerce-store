'use client';

import Link from 'next/link';
import { ShoppingCartIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';

const CartButton = () => {
  const { totalItems } = useCart();

  return (
    <Button
      variant='ghost'
      size='icon'
      nativeButton={false}
      render={<Link href='/cart' />}
      aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
      className='relative'
    >
      <ShoppingCartIcon size={18} />
      {totalItems > 0 && (
        <span
          aria-hidden='true'
          className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
      <span className='sr-only' aria-live='polite'>
        {totalItems > 0 ? `${totalItems} items in cart` : 'Cart is empty'}
      </span>
    </Button>
  );
};

export { CartButton };
