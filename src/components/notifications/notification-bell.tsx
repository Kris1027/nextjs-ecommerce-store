'use client';

import Link from 'next/link';
import { BellIcon } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { notificationsControllerGetUnreadCountOptions } from '@/api/generated/@tanstack/react-query.gen';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';

const POLL_INTERVAL = 30_000;

const NotificationBell = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const { data } = useQuery({
    ...notificationsControllerGetUnreadCountOptions(),
    enabled: !!accessToken,
    refetchInterval: POLL_INTERVAL,
  });

  if (!isHydrated || !accessToken) return null;

  const count =
    (data as { data?: { count?: number } } | undefined)?.data?.count ?? 0;

  return (
    <Button
      variant='ghost'
      size='icon'
      nativeButton={false}
      render={<Link href='/account/notifications' />}
      aria-label={`Notifications${count > 0 ? `, ${count} unread` : ''}`}
      className='relative'
    >
      <BellIcon size={18} />
      {count > 0 && (
        <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Button>
  );
};

export { NotificationBell };
