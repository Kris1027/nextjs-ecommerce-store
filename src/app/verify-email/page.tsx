import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VerifyEmailContent } from '@/components/auth/verify-email-content';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email address',
};

const VerifyEmailPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col items-center gap-4 py-12 text-center'>
      <Suspense>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
};

export default VerifyEmailPage;
