'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  notificationsControllerGetPreferencesOptions,
  notificationsControllerGetPreferencesQueryKey,
  notificationsControllerUpdatePreferenceMutation,
} from '@/api/generated/@tanstack/react-query.gen';
import { useAuthStore } from '@/stores/auth.store';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_TYPE_LABELS,
} from '@/components/notifications/notification-utils';
import type {
  NotificationDto,
  NotificationPreferenceDto,
} from '@/api/generated/types.gen';

type Channel = NotificationPreferenceDto['channel'];

const CHANNELS: { value: Channel; label: string }[] = [
  { value: 'IN_APP', label: 'In-app' },
  { value: 'EMAIL', label: 'Email' },
];

const NotificationPreferencesPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/account/notifications/preferences');
    }
  }, [isHydrated, accessToken, router]);

  const { data, isLoading, isError } = useQuery({
    ...notificationsControllerGetPreferencesOptions(),
    enabled: !!accessToken,
  });

  const updatePreference = useMutation({
    ...notificationsControllerUpdatePreferenceMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsControllerGetPreferencesQueryKey(),
      });
      toast.success('Preference updated');
    },
  });

  if (!isHydrated) {
    return <p className='text-muted-foreground'>Loading...</p>;
  }

  if (!accessToken) return null;

  const preferences = (data?.data ?? []) as NotificationPreferenceDto[];

  const isEnabled = (
    type: NotificationDto['type'],
    channel: Channel,
  ): boolean => {
    const pref = preferences.find(
      (p) => p.type === type && p.channel === channel,
    );
    return pref?.enabled ?? true;
  };

  const handleToggle = (
    type: NotificationDto['type'],
    channel: Channel,
    enabled: boolean,
  ) => {
    updatePreference.mutate({ body: { type, channel, enabled } });
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Notification Preferences</h1>
        <p className='text-sm text-muted-foreground'>
          Choose which notifications you receive and how.
        </p>
      </div>

      {isLoading && (
        <div className='space-y-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className='space-y-4 p-6'>
              <Skeleton className='h-5 w-24' />
              <div className='space-y-3'>
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <Card className='p-8 text-center'>
          <p className='text-destructive'>
            Failed to load preferences. Please try again later.
          </p>
        </Card>
      )}

      {!isLoading && !isError && (
        <div className='space-y-4'>
          {NOTIFICATION_CATEGORIES.map((category) => (
            <Card key={category.label} className='p-6'>
              <h2 className='mb-4 text-sm font-semibold'>{category.label}</h2>
              <div className='space-y-4'>
                {category.types.map((type) => (
                  <div
                    key={type}
                    className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'
                  >
                    <Label className='text-sm'>
                      {NOTIFICATION_TYPE_LABELS[type]}
                    </Label>
                    <div className='flex items-center gap-4'>
                      {CHANNELS.map((channel) => (
                        <div
                          key={channel.value}
                          className='flex items-center gap-2'
                        >
                          <Switch
                            checked={isEnabled(type, channel.value)}
                            onCheckedChange={(checked) =>
                              handleToggle(type, channel.value, checked)
                            }
                            disabled={updatePreference.isPending}
                          />
                          <span className='text-xs text-muted-foreground'>
                            {channel.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export { NotificationPreferencesPage };
