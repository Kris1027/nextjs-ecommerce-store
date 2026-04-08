'use client';

import Image from 'next/image';
import type { OrderDetailDto } from '@/api/generated/types.gen';
import { formatPrice } from '@/lib/format';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type OrderSummaryProps = {
  order: OrderDetailDto;
};

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  const couponCode = order.couponCode;
  const shippingRegion = order.shippingRegion;
  const discount = Number(order.discountAmount);

  return (
    <Card className='p-6'>
      <h2 className='mb-4 text-lg font-semibold'>Order summary</h2>
      <p className='text-muted-foreground mb-4 text-sm'>
        Order #{order.orderNumber}
      </p>

      <div className='space-y-3'>
        {order.items.map((item) => {
          const imageUrl = item.productImageUrl;

          return (
            <div key={item.id} className='flex items-center gap-3'>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={item.productName}
                  width={48}
                  height={48}
                  className='rounded-md object-cover'
                />
              )}
              <div className='flex-1'>
                <p className='text-sm font-medium'>{item.productName}</p>
                <p className='text-muted-foreground text-xs'>
                  {item.quantity} x {formatPrice(item.unitPrice)}
                </p>
              </div>
              <p className='text-sm font-medium'>
                {formatPrice(item.lineTotal)}
              </p>
            </div>
          );
        })}
      </div>

      <Separator className='my-4' />

      <div className='space-y-2'>
        <div className='flex justify-between text-sm'>
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span>Shipping</span>
          <span>{formatPrice(order.shippingCost)}</span>
        </div>
        {discount > 0 && (
          <div className='flex justify-between text-sm text-green-600'>
            <span>Discount{couponCode ? ` (${couponCode})` : ''}</span>
            <span>-{formatPrice(order.discountAmount)}</span>
          </div>
        )}
        {Number(order.tax) > 0 && (
          <div className='flex justify-between text-sm'>
            <span>Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
        )}
        <Separator />
        <div className='flex justify-between font-medium'>
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <Separator className='my-4' />

      <div>
        <h3 className='mb-2 text-sm font-medium'>Shipping address</h3>
        <div className='text-muted-foreground text-sm'>
          <p>{order.shippingFullName}</p>
          <p>{order.shippingStreet}</p>
          <p>
            {order.shippingPostalCode} {order.shippingCity}
            {shippingRegion ? `, ${shippingRegion}` : ''}
          </p>
          <p>{order.shippingCountry}</p>
          <p>{order.shippingPhone}</p>
        </div>
      </div>
    </Card>
  );
};
