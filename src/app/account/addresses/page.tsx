import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AddressList } from '@/components/account/address-list';

export const metadata: Metadata = {
  title: 'Addresses',
  description: 'Manage your shipping and billing addresses',
};

const AddressesPage = () => {
  return (
    <Suspense>
      <AddressList />
    </Suspense>
  );
};

export default AddressesPage;
