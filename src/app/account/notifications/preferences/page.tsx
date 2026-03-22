import { Suspense } from 'react';
import type { Metadata } from 'next';
import { NotificationPreferencesPage } from '@/components/notifications/notification-preferences-page';

export const metadata: Metadata = {
  title: 'Notification Preferences',
};

const PreferencesPage = () => {
  return (
    <Suspense>
      <NotificationPreferencesPage />
    </Suspense>
  );
};

export default PreferencesPage;
