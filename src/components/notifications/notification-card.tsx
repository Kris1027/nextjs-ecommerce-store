'use client';

import { useRouter } from 'next/navigation';
import { EyeIcon } from '@phosphor-icons/react';
import type { NotificationDto } from '@/api/generated/types.gen';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  formatRelativeTime,
  getNotificationHref,
  NOTIFICATION_ICON_MAP,
} from '@/components/notifications/notification-utils';
import { cn } from '@/lib/utils';

type NotificationCardProps = {
  notification: NotificationDto;
  onMarkAsRead: (id: string) => void;
};

const NotificationCard = ({
  notification,
  onMarkAsRead,
}: NotificationCardProps) => {
  const router = useRouter();
  const Icon = NOTIFICATION_ICON_MAP[notification.type];
  const href = getNotificationHref(notification);

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    if (href) {
      router.push(href);
    }
  };

  return (
    <Card
      className={cn(
        'cursor-pointer p-4 transition-colors hover:bg-muted/50',
        !notification.isRead && 'border-l-2 border-l-primary',
      )}
      onClick={handleClick}
    >
      <div className='flex items-start gap-3'>
        <Icon size={16} className='mt-0.5 shrink-0 text-muted-foreground' />
        <div className='flex-1 space-y-1'>
          <div className='flex items-start justify-between gap-2'>
            <p
              className={cn(
                'text-sm leading-tight',
                !notification.isRead && 'font-medium',
              )}
            >
              {notification.title}
            </p>
            {!notification.isRead && (
              <Button
                variant='ghost'
                size='icon-sm'
                aria-label='Mark as read'
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
              >
                <EyeIcon size={14} />
              </Button>
            )}
          </div>
          <p className='line-clamp-2 text-xs text-muted-foreground'>
            {notification.body}
          </p>
          <p className='text-xs text-muted-foreground'>
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export { NotificationCard };
