'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  UserIcon,
  PackageIcon,
  BellIcon,
  MapPinIcon,
  LockIcon,
} from '@phosphor-icons/react';
import { ordersControllerGetMyOrdersOptions } from '@/api/generated/@tanstack/react-query.gen';
import { useAuthStore } from '@/stores/auth.store';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderListCard } from '@/components/orders/order-list-card';

const QUICK_LINKS = [
  {
    href: '/account/profile',
    label: 'Profile',
    description: 'Edit your name and email',
    icon: UserIcon,
  },
  {
    href: '/account/orders',
    label: 'Orders',
    description: 'View your order history',
    icon: PackageIcon,
  },
  {
    href: '/account/notifications',
    label: 'Notifications',
    description: 'View alerts and preferences',
    icon: BellIcon,
  },
  {
    href: '/account/addresses',
    label: 'Addresses',
    description: 'Manage shipping addresses',
    icon: MapPinIcon,
  },
  {
    href: '/account/change-password',
    label: 'Change Password',
    description: 'Update your password',
    icon: LockIcon,
  },
] as const;

const AccountOverview = () => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login?redirect=/account');
    }
  }, [isHydrated, accessToken, router]);

  const { data, isLoading, isError } = useQuery({
    ...ordersControllerGetMyOrdersOptions({
      query: {
        page: '1',
        limit: '3',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    }),
    enabled: !!accessToken,
  });

  if (!isHydrated) {
    return <p className='text-muted-foreground'>Loading...</p>;
  }

  if (!accessToken) return null;

  const orders = data?.data;

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold'>
          Welcome back, {user?.firstName ?? 'there'}
        </h1>
        <p className='text-muted-foreground text-sm'>
          Manage your account settings and view your orders.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {QUICK_LINKS.map(({ href, label, description, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className='h-full gap-0! py-0! transition-colors hover:bg-muted/50'>
              <div className='flex items-center gap-3 p-4'>
                <Icon size={20} className='shrink-0 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>{label}</p>
                  <p className='text-muted-foreground text-xs'>{description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Recent Orders</h2>
          <Link
            href='/account/orders'
            className='text-muted-foreground hover:text-foreground text-sm transition-colors'
          >
            View all
          </Link>
        </div>

        {isLoading && (
          <div className='space-y-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <Skeleton className='h-5 w-32' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-5 w-20' />
                    <Skeleton className='h-5 w-16' />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <Card className='p-6 text-center'>
            <p className='text-destructive text-sm'>
              Failed to load recent orders.
            </p>
          </Card>
        )}

        {!isLoading && !isError && orders && orders.length === 0 && (
          <Card className='p-6 text-center'>
            <p className='text-muted-foreground text-sm'>No orders yet.</p>
          </Card>
        )}

        {!isLoading && !isError && orders && orders.length > 0 && (
          <div className='space-y-3'>
            {orders.map((order) => (
              <OrderListCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { AccountOverview };
