import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

const LoginPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-6 py-12'>
      <div className='flex flex-col gap-2 text-center'>
        <h1 className='text-2xl font-bold tracking-tight'>Welcome Back</h1>
        <p className='text-muted-foreground text-sm'>
          Enter your credentials to access your account
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
