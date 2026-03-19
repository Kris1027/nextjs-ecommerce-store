'use client';

import Link from 'next/link';
import { ShoppingCart } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useGuestCartStore } from '@/stores/guest-cart.store';

const CartButton = () => {
  const totalItems = useGuestCartStore((s) => s.totalItems);

  return (
    <Button
      variant='ghost'
      size='icon'
      nativeButton={false}
      render={<Link href='/cart' />}
      aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
      className='relative'
    >
      <ShoppingCart size={18} />
      {totalItems > 0 && (
        <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'>
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Button>
  );
};

export { CartButton };
