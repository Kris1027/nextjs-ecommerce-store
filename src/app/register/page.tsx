import { Suspense } from 'react';
import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new account to start shopping',
  robots: { index: false },
};

const RegisterPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-6 py-12'>
      <div className='flex flex-col gap-2 text-center'>
        <h1 className='text-2xl font-bold tracking-tight'>Create Account</h1>
        <p className='text-muted-foreground text-sm'>
          Enter your details below to create your account
        </p>
      </div>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
};

export default RegisterPage;
