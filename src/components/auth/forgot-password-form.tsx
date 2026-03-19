'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@/lib/zod-resolver';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { authControllerForgotPassword } from '@/api/generated/sdk.gen';
import { forgotPasswordSchema } from '@/schemas/auth.schemas';
import type { ForgotPasswordFormValues } from '@/schemas/auth.schemas';

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const forgotMutation = useMutation({
    mutationFn: async (values: ForgotPasswordFormValues) => {
      const { data } = await authControllerForgotPassword({
        body: { email: values.email },
        throwOnError: true,
      });
      return data;
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotMutation.mutate(values);
  };

  if (forgotMutation.isSuccess) {
    return (
      <div className='flex flex-col gap-4 text-center'>
        <p className='text-sm'>
          If an account exists with that email, we&apos;ve sent a password reset
          link. Please check your inbox.
        </p>
        <Link href='/login' className='text-primary hover:underline text-sm'>
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1.5'>
        <label htmlFor='email' className='text-sm font-medium'>
          Email
        </label>
        <input
          id='email'
          type='email'
          autoComplete='email'
          className='border-input bg-background placeholder:text-muted-foreground rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none'
          placeholder='john@example.com'
          {...register('email')}
        />
        {errors.email && (
          <p className='text-destructive text-xs'>{errors.email.message}</p>
        )}
      </div>

      <button
        type='submit'
        disabled={forgotMutation.isPending}
        className='bg-primary text-primary-foreground hover:bg-primary/90 mt-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50'
      >
        {forgotMutation.isPending ? 'Sending...' : 'Send Reset Link'}
      </button>

      <p className='text-muted-foreground text-center text-sm'>
        Remember your password?{' '}
        <Link href='/login' className='text-primary hover:underline'>
          Sign in
        </Link>
      </p>
    </form>
  );
};
