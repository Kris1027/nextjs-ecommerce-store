import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your account password',
};

const ForgotPasswordPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-6 py-12'>
      <div className='flex flex-col gap-2 text-center'>
        <h1 className='text-2xl font-bold tracking-tight'>Forgot Password</h1>
        <p className='text-muted-foreground text-sm'>
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
};

export default ForgotPasswordPage;
