import { Suspense } from 'react';
import { VerifyEmailContent } from '@/components/auth/verify-email-content';

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
