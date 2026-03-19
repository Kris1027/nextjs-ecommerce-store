import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your account settings',
};

const AccountPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-6 py-12'>
      <h1 className='text-2xl font-bold tracking-tight'>My Account</h1>
      <p className='text-muted-foreground text-sm'>
        Account management features are coming soon.
      </p>
    </div>
  );
};

export default AccountPage;
