'use client';

import { use, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { authControllerVerifyEmail } from '@/api/generated/sdk.gen';

type VerifyEmailPageProps = {
  params: Promise<{ token: string }>;
};

const VerifyEmailPage = ({ params }: VerifyEmailPageProps) => {
  const { token } = use(params);
  const calledRef = useRef(false);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const { data } = await authControllerVerifyEmail({
        path: { token },
        throwOnError: true,
      });
      return data;
    },
  });

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    verifyMutation.mutate();
  }, [verifyMutation]);

  return (
    <div className='mx-auto flex w-full max-w-md flex-col items-center gap-4 py-12 text-center'>
      {verifyMutation.isPending && (
        <>
          <h1 className='text-2xl font-bold tracking-tight'>
            Verifying your email...
          </h1>
          <p className='text-muted-foreground text-sm'>
            Please wait while we verify your email address.
          </p>
        </>
      )}

      {verifyMutation.isSuccess && (
        <>
          <h1 className='text-2xl font-bold tracking-tight'>Email Verified!</h1>
          <p className='text-muted-foreground text-sm'>
            Your email has been verified successfully. You can now sign in.
          </p>
          <Link
            href='/login'
            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors'
          >
            Sign In
          </Link>
        </>
      )}

      {verifyMutation.isError && (
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
      )}
    </div>
  );
};

export default VerifyEmailPage;
