'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  TagIcon,
  XIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/hooks/use-cart';

const CartContent = () => {
  const [couponInput, setCouponInput] = useState('');
  const {
    items,
    subtotal,
    totalItems,
    couponCode,
    discountAmount,
    estimatedTotal,
    isLoading,
    isAuthenticated,
    updateItem,
    removeItem,
    clear,
    applyCoupon,
    removeCoupon,
  } = useCart();

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
        <ShoppingCartIcon size={48} className='text-muted-foreground' />
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
              {typeof item.product.imageUrl === 'string' ? (
                <Image
                  src={item.product.imageUrl}
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
                    <MinusIcon size={14} />
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
                    <PlusIcon size={14} />
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
                  <TrashIcon size={16} />
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
          {isAuthenticated && (
            <>
              <Separator />
              {couponCode ? (
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='flex items-center gap-1 text-muted-foreground'>
                      <TagIcon size={14} />
                      {couponCode}
                    </span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6'
                      aria-label='Remove coupon'
                      disabled={removeCoupon.isPending}
                      onClick={() => removeCoupon.mutate()}
                    >
                      <XIcon size={12} />
                    </Button>
                  </div>
                  <div className='flex items-center justify-between text-sm text-green-600'>
                    <span>Discount</span>
                    <span>-{formatPrice(String(discountAmount))}</span>
                  </div>
                </div>
              ) : (
                <form
                  className='flex gap-2'
                  onSubmit={(e) => {
                    e.preventDefault();
                    const trimmed = couponInput.trim();
                    if (trimmed) {
                      applyCoupon.mutate(trimmed, {
                        onSuccess: () => setCouponInput(''),
                      });
                    }
                  }}
                >
                  <input
                    type='text'
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder='Coupon code'
                    aria-label='Coupon code'
                    className='border-input bg-background placeholder:text-muted-foreground flex-1 rounded-md border px-3 py-1.5 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
                  />
                  <Button
                    type='submit'
                    variant='outline'
                    size='sm'
                    disabled={
                      applyCoupon.isPending || couponInput.trim().length === 0
                    }
                  >
                    Apply
                  </Button>
                </form>
              )}
            </>
          )}
          <Separator />
          <div className='flex items-center justify-between font-semibold'>
            <span>Estimated Total</span>
            <span>{formatPrice(String(estimatedTotal))}</span>
          </div>
          {isAuthenticated ? (
            <Button
              className='w-full'
              size='lg'
              nativeButton={false}
              render={<Link href='/checkout' />}
            >
              Proceed to Checkout
            </Button>
          ) : (
            <>
              <Button
                className='w-full'
                size='lg'
                nativeButton={false}
                render={<Link href='/login?redirect=/cart' />}
              >
                Sign in to Checkout
              </Button>
              <p className='text-center text-xs text-muted-foreground'>
                Sign in to proceed with checkout.
              </p>
            </>
          )}
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
