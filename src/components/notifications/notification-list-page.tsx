'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GearIcon } from '@phosphor-icons/react';
import {
  notificationsControllerFindUserNotificationsOptions,
  notificationsControllerFindUserNotificationsQueryKey,
  notificationsControllerGetUnreadCountQueryKey,
  notificationsControllerMarkAllAsReadMutation,
  notificationsControllerMarkAsReadMutation,
} from '@/api/generated/@tanstack/react-query.gen';
import { useAuthStore } from '@/stores/auth.store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductPagination } from '@/components/products/product-pagination';
import { NotificationCard } from '@/components/notifications/notification-card';
import { NotificationReadFilter } from '@/components/notifications/notification-read-filter';
import { NotificationTypeFilter } from '@/components/notifications/notification-type-filter';
import { toast } from 'sonner';
import type { NotificationDto } from '@/api/generated/types.gen';

const NotificationListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const page = searchParams.get('page') ?? '1';
  const isRead = searchParams.get('isRead') as 'true' | 'false' | undefined;
  const type = searchParams.get('type') as NotificationDto['type'] | undefined;

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/account/notifications');
    }
  }, [isHydrated, accessToken, router]);

  const { data, isLoading, isError } = useQuery({
    ...notificationsControllerFindUserNotificationsOptions({
      query: {
        page,
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        isRead: isRead ?? undefined,
        type: type ?? undefined,
      },
    }),
    enabled: !!accessToken,
  });

  const invalidateNotifications = () => {
    queryClient.invalidateQueries({
      queryKey: notificationsControllerFindUserNotificationsQueryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: notificationsControllerGetUnreadCountQueryKey(),
    });
  };

  const markAsRead = useMutation({
    ...notificationsControllerMarkAsReadMutation(),
    onSuccess: invalidateNotifications,
  });

  const markAllAsRead = useMutation({
    ...notificationsControllerMarkAllAsReadMutation(),
    onSuccess: () => {
      invalidateNotifications();
      toast.success('All notifications marked as read');
    },
  });

  if (!isHydrated) {
    return <p className='text-muted-foreground'>Loading...</p>;
  }

  if (!accessToken) return null;

  const notifications = (data?.data ?? []) as NotificationDto[];
  const meta = data?.meta;

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold'>Notifications</h1>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => markAllAsRead.mutate({})}
            disabled={markAllAsRead.isPending}
          >
            {markAllAsRead.isPending ? 'Marking...' : 'Mark all as read'}
          </Button>
          <Button
            variant='ghost'
            size='icon'
            nativeButton={false}
            render={<Link href='/account/notifications/preferences' />}
            aria-label='Notification preferences'
          >
            <GearIcon size={18} />
          </Button>
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        <NotificationReadFilter />
        <NotificationTypeFilter />
      </div>

      {isLoading && (
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className='p-4'>
              <div className='flex items-start gap-3'>
                <Skeleton className='h-4 w-4' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-3 w-full' />
                  <Skeleton className='h-3 w-20' />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <Card className='p-8 text-center'>
          <p className='text-destructive'>
            Failed to load notifications. Please try again later.
          </p>
        </Card>
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <Card className='p-8 text-center'>
          <p className='text-muted-foreground'>No notifications yet.</p>
        </Card>
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <div className='space-y-3'>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={(id) => markAsRead.mutate({ path: { id } })}
            />
          ))}
        </div>
      )}

      {meta && (
        <div className='mt-6'>
          <ProductPagination meta={meta} />
        </div>
      )}
    </div>
  );
};

export { NotificationListPage };
