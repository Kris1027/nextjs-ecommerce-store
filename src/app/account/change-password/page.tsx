import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ChangePasswordForm } from '@/components/account/change-password-form';

export const metadata: Metadata = {
  title: 'Change Password',
  description: 'Update your account password',
};

const ChangePasswordPage = () => {
  return (
    <Suspense fallback={<p className='text-muted-foreground'>Loading...</p>}>
      <ChangePasswordForm />
    </Suspense>
  );
};

export default ChangePasswordPage;
