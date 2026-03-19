'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash, Minus, Plus, ShoppingCart } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/format';
import { useGuestCart } from '@/hooks/use-guest-cart';

const CartContent = () => {
  const {
    items,
    subtotal,
    totalItems,
    isLoading,
    updateItem,
    removeItem,
    clear,
  } = useGuestCart();

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-28 w-full' />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className='flex flex-col items-center gap-4 p-12 text-center'>
        <ShoppingCart size={48} className='text-muted-foreground' />
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold'>Your cart is empty</h2>
          <p className='text-sm text-muted-foreground'>
            Browse our products and add something you like.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href='/products' />}>
          Continue Shopping
        </Button>
      </Card>
    );
  }

  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      <div className='space-y-4 lg:col-span-2'>
        {items.map((item) => (
          <Card key={item.id} className='flex gap-4 p-4'>
            <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted'>
              {item.product.imageUrl ? (
                <Image
                  src={item.product.imageUrl as unknown as string}
                  alt={item.product.name}
                  fill
                  sizes='96px'
                  className='object-cover'
                />
              ) : (
                <div className='flex h-full items-center justify-center text-xs text-muted-foreground'>
                  No image
                </div>
              )}
            </div>

            <div className='flex flex-1 flex-col justify-between'>
              <div className='flex items-start justify-between'>
                <div>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className='font-medium hover:text-primary'
                  >
                    {item.product.name}
                  </Link>
                  <p className='text-sm text-muted-foreground'>
                    {formatPrice(String(item.unitPrice))} each
                  </p>
                </div>
                <p className='font-semibold'>
                  {formatPrice(String(item.lineTotal))}
                </p>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center rounded-md border'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    aria-label='Decrease quantity'
                    disabled={item.quantity <= 1 || updateItem.isPending}
                    onClick={() =>
                      updateItem.mutate({
                        itemId: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                  >
                    <Minus size={14} />
                  </Button>
                  <span className='w-8 text-center text-sm'>
                    {item.quantity}
                  </span>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    aria-label='Increase quantity'
                    disabled={updateItem.isPending}
                    onClick={() =>
                      updateItem.mutate({
                        itemId: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-destructive hover:text-destructive'
                  aria-label={`Remove ${item.product.name} from cart`}
                  disabled={removeItem.isPending}
                  onClick={() => removeItem.mutate(item.id)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className='lg:col-span-1'>
        <Card className='sticky top-24 space-y-4 p-6'>
          <h2 className='text-lg font-semibold'>Order Summary</h2>
          <Separator />
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>Items ({totalItems})</span>
            <span>{formatPrice(String(subtotal))}</span>
          </div>
          <Separator />
          <div className='flex items-center justify-between font-semibold'>
            <span>Subtotal</span>
            <span>{formatPrice(String(subtotal))}</span>
          </div>
          <Button className='w-full' size='lg' disabled>
            Proceed to Checkout
          </Button>
          <p className='text-center text-xs text-muted-foreground'>
            Checkout will be available after signing in.
          </p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='flex-1'
              nativeButton={false}
              render={<Link href='/products' />}
            >
              Continue Shopping
            </Button>
            <Button
              variant='destructive'
              size='sm'
              disabled={clear.isPending}
              onClick={() => clear.mutate()}
            >
              Clear Cart
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { CartContent };
