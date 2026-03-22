import { Suspense } from 'react';
import type { Metadata } from 'next';
import { NotificationListPage } from '@/components/notifications/notification-list-page';

export const metadata: Metadata = {
  title: 'Notifications',
};

const NotificationsPage = () => {
  return (
    <Suspense>
      <NotificationListPage />
    </Suspense>
  );
};

export default NotificationsPage;
