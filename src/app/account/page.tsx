import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AccountOverview } from '@/components/account/account-overview';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your account settings',
};

const AccountPage = () => {
  return (
    <Suspense fallback={<p className='text-muted-foreground'>Loading...</p>}>
      <AccountOverview />
    </Suspense>
  );
};

export default AccountPage;
