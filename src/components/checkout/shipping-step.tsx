'use client';

import { useQuery } from '@tanstack/react-query';
import { shippingControllerFindActive } from '@/api/generated/sdk.gen';
import type { ShippingMethodDto } from '@/api/generated/types.gen';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/format';

const getThreshold = (method: ShippingMethodDto): string | null =>
  method.freeShippingThreshold ?? null;

const getDescription = (method: ShippingMethodDto): string | null =>
  method.description ?? null;

export const ShippingStep = () => {
  const { shippingMethodId, setShippingMethodId } = useCheckoutStore();
  const subtotal = useCartStore((s) => s.subtotal);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['shipping-methods'],
    queryFn: () => shippingControllerFindActive({ throwOnError: true }),
  });

  const methods = data?.data?.data ?? [];

  if (isLoading) {
    return <p className='text-muted-foreground'>Loading shipping methods...</p>;
  }

  if (isError) {
    return (
      <p className='text-sm text-red-500'>
        Failed to load shipping methods. Please try again.
      </p>
    );
  }

  if (methods.length === 0) {
    return (
      <p className='text-muted-foreground'>No shipping methods available.</p>
    );
  }

  return (
    <div className='space-y-3'>
      {methods.map((method) => {
        const threshold = getThreshold(method);
        const description = getDescription(method);
        const isFree = threshold && Number(subtotal) >= Number(threshold);
        const price = isFree ? 0 : Number(method.basePrice);

        return (
          <button
            key={method.id}
            type='button'
            aria-label={`Select ${method.name} shipping`}
            aria-pressed={shippingMethodId === method.id}
            onClick={() => setShippingMethodId(method.id)}
            className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors ${
              shippingMethodId === method.id
                ? 'border-primary bg-primary/5 ring-primary ring-2'
                : 'hover:border-primary/50'
            }`}
          >
            <div>
              <p className='font-medium'>{method.name}</p>
              {description && (
                <p className='text-muted-foreground text-sm'>{description}</p>
              )}
              <p className='text-muted-foreground text-sm'>
                Estimated delivery: {method.estimatedDays}{' '}
                {method.estimatedDays === 1 ? 'day' : 'days'}
              </p>
            </div>
            <div className='text-right'>
              {isFree ? (
                <span className='font-medium text-green-600'>Free</span>
              ) : (
                <span className='font-medium'>
                  {formatPrice(String(price))}
                </span>
              )}
            </div>
          </button>
        );
      })}

      {methods.some((m) => getThreshold(m)) && (
        <FreeShippingHint methods={methods} subtotal={Number(subtotal)} />
      )}
    </div>
  );
};

type FreeShippingHintProps = {
  methods: ShippingMethodDto[];
  subtotal: number;
};

const FreeShippingHint = ({ methods, subtotal }: FreeShippingHintProps) => {
  const cheapestFree = methods
    .filter((m) => getThreshold(m))
    .sort((a, b) => Number(getThreshold(a)) - Number(getThreshold(b)))[0];

  const threshold = cheapestFree ? getThreshold(cheapestFree) : null;
  if (!threshold) return null;

  const remaining = Number(threshold) - subtotal;

  if (remaining <= 0) return null;

  return (
    <p className='text-muted-foreground text-sm'>
      Spend {formatPrice(String(remaining))} more for free {cheapestFree.name}!
    </p>
  );
};
