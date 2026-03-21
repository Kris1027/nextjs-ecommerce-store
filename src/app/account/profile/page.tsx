import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProfileForm } from '@/components/account/profile-form';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Edit your profile information',
};

const ProfilePage = () => {
  return (
    <Suspense fallback={<p className='text-muted-foreground'>Loading...</p>}>
      <ProfileForm />
    </Suspense>
  );
};

export default ProfilePage;
