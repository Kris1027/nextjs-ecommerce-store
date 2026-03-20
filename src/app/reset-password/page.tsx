import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your account',
};

const ResetPasswordPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-6 py-12'>
      <div className='flex flex-col gap-2 text-center'>
        <h1 className='text-2xl font-bold tracking-tight'>Reset Password</h1>
        <p className='text-muted-foreground text-sm'>
          Enter your new password below
        </p>
      </div>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
