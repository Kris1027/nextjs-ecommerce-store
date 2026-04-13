'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkout.store';
import { AddressStep } from '@/components/checkout/address-step';
import { ShippingStep } from '@/components/checkout/shipping-step';
import { ReviewStep } from '@/components/checkout/review-step';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const STEPS = [
  { label: 'Shipping address', short: 'Address' },
  { label: 'Shipping method', short: 'Shipping' },
  { label: 'Review order', short: 'Review' },
] as const;

const CheckoutPage = () => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const totalItems = useCartStore((s) => s.totalItems);
  const {
    currentStep,
    setCurrentStep,
    shippingAddressId,
    shippingMethodId,
    isOrderPlaced,
    reset,
  } = useCheckoutStore();

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/checkout');
    }
  }, [isHydrated, accessToken, router]);

  useEffect(() => {
    if (isOrderPlaced && totalItems > 0) {
      reset();
    }
  }, [isOrderPlaced, totalItems, reset]);

  if (!isHydrated) {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-8'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  if (!accessToken) return null;

  if (isOrderPlaced) return null;

  if (totalItems === 0) {
    return (
      <div className='container mx-auto max-w-2xl px-4 py-8 text-center'>
        <h1 className='mb-4 text-2xl font-bold'>Your cart is empty</h1>
        <p className='text-muted-foreground mb-6'>
          Add some products before checking out.
        </p>
        <Button onClick={() => router.push('/products')}>
          Browse products
        </Button>
      </div>
    );
  }

  const canProceedFromAddress = !!shippingAddressId;
  const canProceedFromShipping = !!shippingMethodId;

  return (
    <div className='container mx-auto max-w-2xl px-4 py-8'>
      <h1 className='mb-8 text-2xl font-bold'>Checkout</h1>

      <nav className='mb-8' aria-label='Checkout steps'>
        <ol className='flex items-center gap-2'>
          {STEPS.map((step, index) => (
            <li
              key={step.label}
              className='flex items-center gap-2'
              aria-current={index === currentStep ? 'step' : undefined}
            >
              <span
                aria-hidden='true'
                className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index < currentStep
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`text-sm sm:hidden ${
                  index === currentStep
                    ? 'font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {step.short}
              </span>
              <span
                className={`hidden text-sm sm:inline ${
                  index === currentStep
                    ? 'font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
              <span className='sr-only'>
                {index < currentStep
                  ? '(completed)'
                  : index === currentStep
                    ? '(current)'
                    : ''}
              </span>
              {index < STEPS.length - 1 && (
                <span aria-hidden='true' className='text-muted-foreground mx-2'>
                  —
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {currentStep === 0 && <AddressStep />}
      {currentStep === 1 && <ShippingStep />}
      {currentStep === 2 && <ReviewStep />}

      <div className='mt-8 flex justify-between'>
        {currentStep > 0 && (
          <Button
            variant='outline'
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Back
          </Button>
        )}
        {currentStep < 2 && (
          <Button
            className='ml-auto'
            disabled={
              (currentStep === 0 && !canProceedFromAddress) ||
              (currentStep === 1 && !canProceedFromShipping)
            }
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
