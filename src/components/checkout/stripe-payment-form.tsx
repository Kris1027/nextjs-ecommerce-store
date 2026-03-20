'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type StripePaymentFormProps = {
  orderId: string;
};

export const StripePaymentForm = ({ orderId }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success/${orderId}`,
      },
    });

    if (error) {
      toast.error(error.message ?? 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <Card className='p-6'>
      <h2 className='mb-4 text-lg font-semibold'>Payment details</h2>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <PaymentElement />
        <Button
          type='submit'
          className='w-full'
          size='lg'
          disabled={!stripe || !elements || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay now'}
        </Button>
      </form>
    </Card>
  );
};
