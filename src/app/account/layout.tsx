import type { Metadata } from 'next';
import { AccountSidebar } from '@/components/account/account-sidebar';

export const metadata: Metadata = {
  robots: { index: false },
};

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='container mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row'>
      <aside className='md:w-56 md:shrink-0'>
        <AccountSidebar />
      </aside>
      <div className='flex-1'>{children}</div>
    </div>
  );
};

export default AccountLayout;
