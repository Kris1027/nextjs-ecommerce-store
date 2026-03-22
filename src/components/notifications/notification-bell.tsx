'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BellIcon, GearIcon, PackageIcon } from '@phosphor-icons/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  notificationsControllerFindUserNotificationsOptions,
  notificationsControllerFindUserNotificationsQueryKey,
  notificationsControllerGetUnreadCountOptions,
  notificationsControllerGetUnreadCountQueryKey,
  notificationsControllerMarkAsReadMutation,
} from '@/api/generated/@tanstack/react-query.gen';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  formatRelativeTime,
  getNotificationHref,
  NOTIFICATION_ICON_MAP,
} from '@/components/notifications/notification-utils';
import type { NotificationDto } from '@/api/generated/types.gen';

const POLL_INTERVAL = 30_000;

const NotificationBell = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const { data: unreadData } = useQuery({
    ...notificationsControllerGetUnreadCountOptions(),
    enabled: !!accessToken,
    refetchInterval: POLL_INTERVAL,
  });

  const { data: notificationsData } = useQuery({
    ...notificationsControllerFindUserNotificationsOptions({
      query: { limit: '5', sortBy: 'createdAt', sortOrder: 'desc' },
    }),
    enabled: !!accessToken,
  });

  const markAsRead = useMutation({
    ...notificationsControllerMarkAsReadMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsControllerFindUserNotificationsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsControllerGetUnreadCountQueryKey(),
      });
    },
  });

  if (!isHydrated || !accessToken) return null;

  const count =
    (unreadData as { data?: { count?: number } } | undefined)?.data?.count ?? 0;
  const notifications = (notificationsData?.data ?? []) as NotificationDto[];

  const handleNotificationClick = (notification: NotificationDto) => {
    if (!notification.isRead) {
      markAsRead.mutate({ path: { id: notification.id } });
    }
    const href = getNotificationHref(notification);
    if (href) {
      router.push(href);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant='ghost'
            size='icon'
            aria-label={`Notifications${count > 0 ? `, ${count} unread` : ''}`}
            className='relative'
          />
        }
      >
        <BellIcon size={18} />
        {count > 0 && (
          <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'>
            {count > 99 ? '99+' : count}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <div className='flex items-center justify-between px-2 py-2'>
          <span className='text-xs text-muted-foreground'>Notifications</span>
          <Link
            href='/account/notifications/preferences'
            className='text-muted-foreground transition-colors hover:text-foreground'
            aria-label='Notification preferences'
          >
            <GearIcon size={14} />
          </Link>
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className='p-4 text-center text-sm text-muted-foreground'>
            No notifications yet
          </div>
        ) : (
          <>
            {notifications.map((notification) => {
              const Icon =
                NOTIFICATION_ICON_MAP[notification.type] ?? PackageIcon;
              return (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className='flex items-start gap-3 p-3'
                >
                  <Icon
                    size={16}
                    className='mt-0.5 shrink-0 text-muted-foreground'
                  />
                  <div className='flex-1 space-y-1'>
                    <p
                      className={`text-xs leading-tight ${!notification.isRead ? 'font-medium' : ''}`}
                    >
                      {notification.title}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-primary' />
                  )}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href='/account/notifications' />}
              className='justify-center text-xs text-muted-foreground'
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { NotificationBell };
