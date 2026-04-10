'use client';

import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authControllerVerifyEmail } from '@/api/generated/sdk.gen';
import { useAuthStore } from '@/stores/auth.store';

export const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const calledRef = useRef(false);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = isHydrated && !!accessToken;

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error('No verification token provided');

      const { data } = await authControllerVerifyEmail({
        path: { token },
        throwOnError: true,
      });
      return data;
    },
  });

  useEffect(() => {
    if (calledRef.current || !token) return;
    calledRef.current = true;
    verifyMutation.mutate();
  }, [verifyMutation, token]);

  if (!token) {
    return (
      <>
        <h1 className='text-2xl font-bold tracking-tight'>Invalid Link</h1>
        <p className='text-muted-foreground text-sm'>
          No verification token found. Please check your email for the correct
          link.
        </p>
        <Link href='/login' className='text-primary hover:underline text-sm'>
          Go to Sign In
        </Link>
      </>
    );
  }

  if (verifyMutation.isPending) {
    return (
      <>
        <h1 className='text-2xl font-bold tracking-tight'>
          Verifying your email...
        </h1>
        <p className='text-muted-foreground text-sm'>
          Please wait while we verify your email address.
        </p>
      </>
    );
  }

  if (verifyMutation.isSuccess) {
    return (
      <>
        <h1 className='text-2xl font-bold tracking-tight'>Email Verified!</h1>
        <p className='text-muted-foreground text-sm'>
          {isAuthenticated
            ? 'Your email has been verified successfully.'
            : 'Your email has been verified successfully. You can now sign in.'}
        </p>
        {isAuthenticated ? (
          <Link
            href='/'
            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors'
          >
            Continue Shopping
          </Link>
        ) : (
          <Link
            href='/login'
            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors'
          >
            Sign In
          </Link>
        )}
      </>
    );
  }

  if (verifyMutation.isError) {
    return (
      <>
        <h1 className='text-2xl font-bold tracking-tight'>
          Verification Failed
        </h1>
        <p className='text-muted-foreground text-sm'>
          This link may have expired or already been used.
        </p>
        <Link href='/login' className='text-primary hover:underline text-sm'>
          Go to Sign In
        </Link>
      </>
    );
  }

  return null;
};
