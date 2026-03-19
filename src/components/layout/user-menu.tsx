'use client';

import Link from 'next/link';
import { SignIn, User, UserPlus } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';

const UserMenu = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className='hidden items-center gap-1 sm:flex'>
        <Button variant='ghost' size='sm' render={<Link href='/login' />}>
          <SignIn size={16} data-icon='inline-start' />
          Sign In
        </Button>
        <Button size='sm' render={<Link href='/register' />}>
          <UserPlus size={16} data-icon='inline-start' />
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
        <User size={18} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem render={<Link href='/profile' />}>
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href='/orders' />}>
          My Orders
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserMenu };
