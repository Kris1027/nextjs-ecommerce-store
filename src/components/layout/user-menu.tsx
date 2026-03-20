'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SignInIcon,
  UserIcon,
  UserPlusIcon,
  SignOutIcon,
} from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { authControllerLogout } from '@/api/generated/sdk.gen';
import { getRefreshToken } from '@/stores/auth.store';
import { broadcastLogout } from '@/hooks/use-auth-broadcast';

const UserMenu = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authControllerLogout({
          body: { refreshToken },
        });
      }
    },
    onSettled: () => {
      clearAuth();
      broadcastLogout();
      router.push('/');
    },
  });

  // Wait for auth hydration to avoid flashing Sign In/Register buttons
  if (!isHydrated) return null;

  if (!user) {
    return (
      <div className='hidden items-center gap-1 sm:flex'>
        <Button
          variant='ghost'
          size='sm'
          nativeButton={false}
          render={<Link href='/login' />}
        >
          <SignInIcon size={16} data-icon='inline-start' />
          Sign In
        </Button>
        <Button
          size='sm'
          nativeButton={false}
          render={<Link href='/register' />}
        >
          <UserPlusIcon size={16} data-icon='inline-start' />
          Register
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant='ghost' size='icon' aria-label='User menu' />}
      >
        <UserIcon size={18} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem render={<Link href='/account' />}>
          My Account
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href='/account/orders' />}>
          My Orders
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <SignOutIcon size={16} />
          {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserMenu };
