'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  UserIcon,
  PackageIcon,
  BellIcon,
  MapPinIcon,
  LockIcon,
  SignOutIcon,
  HouseIcon,
} from '@phosphor-icons/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authControllerLogout } from '@/api/generated/sdk.gen';
import { getRefreshToken, useAuthStore } from '@/stores/auth.store';
import { broadcastLogout } from '@/hooks/use-auth-broadcast';
import { useCartStore } from '@/stores/cart.store';
import { CART_QUERY_KEY } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/account', label: 'Overview', icon: HouseIcon },
  { href: '/account/profile', label: 'Profile', icon: UserIcon },
  { href: '/account/orders', label: 'Orders', icon: PackageIcon },
  { href: '/account/notifications', label: 'Notifications', icon: BellIcon },
  { href: '/account/addresses', label: 'Addresses', icon: MapPinIcon },
  {
    href: '/account/change-password',
    label: 'Change Password',
    icon: LockIcon,
  },
] as const;

const AccountSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearCart = useCartStore((s) => s.clearCart);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authControllerLogout({ body: { refreshToken } });
      }
    },
    onSettled: () => {
      clearAuth();
      clearCart();
      broadcastLogout();
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY] });
      router.push('/');
    },
  });

  const isActive = (href: string): boolean => {
    if (href === '/account') return pathname === '/account';
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label='Account navigation'
      className='grid grid-cols-2 gap-1 sm:grid-cols-3 md:flex md:flex-col'
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
            isActive(href)
              ? 'bg-muted font-medium'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
          )}
        >
          <Icon size={16} />
          {label}
        </Link>
      ))}
      <button
        type='button'
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className='text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors'
      >
        <SignOutIcon size={16} />
        {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
      </button>
    </nav>
  );
};

export { AccountSidebar };
