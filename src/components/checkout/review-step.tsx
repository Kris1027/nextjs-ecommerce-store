'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  usersControllerGetAddresses,
  shippingControllerFindActive,
  ordersControllerCheckout,
} from '@/api/generated';
import type { ShippingMethodDto, UserAddressDto } from '@/api/generated';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/format';
import { getErrorMessage } from '@/lib/api-error';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const getThreshold = (method: ShippingMethodDto): string | null =>
  (method.freeShippingThreshold as unknown as string) ?? null;

const getRegion = (address: UserAddressDto): string | null =>
  (address.region as unknown as string) ?? null;

export const ReviewStep = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { shippingAddressId, shippingMethodId, notes, reset } =
    useCheckoutStore();
  const cart = useCartStore();

  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => usersControllerGetAddresses({ throwOnError: true }),
  });

  const { data: shippingData } = useQuery({
    queryKey: ['shipping-methods'],
    queryFn: () => shippingControllerFindActive({ throwOnError: true }),
  });

  const address = addressesData?.data?.data?.find(
    (a) => a.id === shippingAddressId,
  );
  const method = shippingData?.data?.data?.find(
    (m) => m.id === shippingMethodId,
  );

  const threshold = method ? getThreshold(method) : null;
  const isFreeShipping =
    threshold && Number(cart.subtotal) >= Number(threshold);
  const shippingCost = isFreeShipping ? 0 : Number(method?.basePrice ?? 0);
  const discount = Number(cart.discountAmount ?? 0);
  const subtotal = Number(cart.subtotal);
  const total = subtotal + shippingCost - discount;

  const placeOrder = useMutation({
    mutationFn: () => {
      if (!shippingAddressId || !shippingMethodId) {
        return Promise.reject(
          new Error('Please select address and shipping method'),
        );
      }
      return ordersControllerCheckout({
        body: {
          shippingAddressId,
          shippingMethodId,
          ...(cart.couponCode ? { couponCode: cart.couponCode } : {}),
          ...(notes ? { notes } : {}),
        },
        throwOnError: true,
      });
    },
    onSuccess: async (response) => {
      reset();
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      router.push(`/checkout/payment/${response.data.data.id}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-2 font-medium'>Shipping address</h3>
        {address ? (
          <div className='text-muted-foreground text-sm'>
            <p>{address.fullName}</p>
            <p>{address.street}</p>
            <p>
              {address.postalCode} {address.city}
              {getRegion(address) ? `, ${getRegion(address)}` : ''}
            </p>
            <p>{address.phone}</p>
          </div>
        ) : (
          <p className='text-sm text-red-500'>No address selected</p>
        )}
      </div>

      <Separator />

      <div>
        <h3 className='mb-2 font-medium'>Shipping method</h3>
        {method ? (
          <div className='text-muted-foreground text-sm'>
            <p>
              {method.name} —{' '}
              {isFreeShipping ? (
                <span className='text-green-600'>Free</span>
              ) : (
                formatPrice(method.basePrice)
              )}
            </p>
            <p>
              Estimated delivery: {method.estimatedDays}{' '}
              {method.estimatedDays === 1 ? 'day' : 'days'}
            </p>
          </div>
        ) : (
          <p className='text-sm text-red-500'>No shipping method selected</p>
        )}
      </div>

      <Separator />

      <div>
        <h3 className='mb-2 font-medium'>Items ({cart.totalItems})</h3>
        <div className='space-y-2'>
          {cart.items.map((item) => (
            <div
              key={item.id}
              className='flex items-center justify-between text-sm'
            >
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span className='text-muted-foreground'>
                {formatPrice(String(item.lineTotal))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className='space-y-2'>
        <div className='flex justify-between text-sm'>
          <span>Subtotal</span>
          <span>{formatPrice(String(subtotal))}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span>Shipping</span>
          <span>
            {isFreeShipping ? (
              <span className='text-green-600'>Free</span>
            ) : (
              formatPrice(String(shippingCost))
            )}
          </span>
        </div>
        {discount > 0 && (
          <div className='flex justify-between text-sm text-green-600'>
            <span>Discount ({cart.couponCode})</span>
            <span>-{formatPrice(String(discount))}</span>
          </div>
        )}
        <Separator />
        <div className='flex justify-between font-medium'>
          <span>Total</span>
          <span>{formatPrice(String(total))}</span>
        </div>
      </div>

      <Button
        className='w-full'
        size='lg'
        disabled={!address || !method || placeOrder.isPending}
        onClick={() => placeOrder.mutate()}
      >
        {placeOrder.isPending ? 'Placing order...' : 'Place order'}
      </Button>
    </div>
  );
};
