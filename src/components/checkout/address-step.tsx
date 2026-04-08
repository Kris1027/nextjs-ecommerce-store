'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersControllerGetAddresses } from '@/api/generated/sdk.gen';
import type { UserAddressDto } from '@/api/generated/types.gen';
import { useCheckoutStore } from '@/stores/checkout.store';
import { Button } from '@/components/ui/button';
import { AddressForm } from './address-form';

const getRegion = (address: UserAddressDto): string | null =>
  address.region ?? null;

export const AddressStep = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { shippingAddressId, setShippingAddressId } = useCheckoutStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => usersControllerGetAddresses({ throwOnError: true }),
  });

  const addresses = data?.data?.data ?? [];

  if (isLoading) {
    return <p className='text-muted-foreground'>Loading addresses...</p>;
  }

  if (isError) {
    return (
      <p className='text-sm text-red-500'>
        Failed to load addresses. Please try again.
      </p>
    );
  }

  if (isAdding) {
    return (
      <AddressForm
        onSuccessAction={(id) => {
          setShippingAddressId(id);
          setIsAdding(false);
        }}
        onCancelAction={() => setIsAdding(false)}
      />
    );
  }

  return (
    <div className='space-y-4'>
      {addresses.length === 0 ? (
        <div className='text-center'>
          <p className='text-muted-foreground mb-4'>
            No saved addresses. Add one to continue.
          </p>
          <Button onClick={() => setIsAdding(true)}>Add new address</Button>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {addresses.map((address) => {
              const region = getRegion(address);
              return (
                <button
                  key={address.id}
                  type='button'
                  aria-label={`Select address for ${address.fullName} at ${address.street}`}
                  aria-pressed={shippingAddressId === address.id}
                  onClick={() => setShippingAddressId(address.id)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    shippingAddressId === address.id
                      ? 'border-primary bg-primary/5 ring-primary ring-2'
                      : 'hover:border-primary/50'
                  }`}
                >
                  <p className='font-medium'>{address.fullName}</p>
                  <p className='text-muted-foreground text-sm'>
                    {address.street}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {address.postalCode} {address.city}
                    {region ? `, ${region}` : ''}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {address.phone}
                  </p>
                  {address.isDefault && (
                    <span className='mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                      Default
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <Button variant='outline' onClick={() => setIsAdding(true)}>
            Add new address
          </Button>
        </>
      )}
    </div>
  );
};
