'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ListIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth.store';
import { getRefreshToken } from '@/stores/auth.store';
import { authControllerLogout } from '@/api/generated/sdk.gen';
import { broadcastLogout } from '@/hooks/use-auth-broadcast';
import type { CategoryResponseDto } from '@/api/generated/types.gen';

type MobileNavProps = {
  categories: CategoryResponseDto[];
};

const MobileNav = ({ categories }: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
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
      setOpen(false);
      router.push('/');
    },
  });

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setOpen(false);
    }
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Open menu'
          />
        }
      >
        <ListIcon size={20} />
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className='flex flex-col gap-4 p-4'>
          <form onSubmit={handleSearch} className='relative'>
            <MagnifyingGlassIcon
              size={16}
              className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground'
            />
            <Input
              type='search'
              placeholder='Search products...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-8'
            />
          </form>

          <Separator />

          <div className='space-y-1'>
            <p className='text-xs font-semibold uppercase text-muted-foreground'>
              Categories
            </p>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={handleLinkClick}
                className='block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted'
              >
                {category.name}
              </Link>
            ))}
          </div>

          <Separator />

          {isHydrated && (
            <div className='space-y-1'>
              {!user ? (
                <>
                  <Link
                    href='/login'
                    onClick={handleLinkClick}
                    className='block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted'
                  >
                    Sign In
                  </Link>
                  <Link
                    href='/register'
                    onClick={handleLinkClick}
                    className='block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted'
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href='/account'
                    onClick={handleLinkClick}
                    className='block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted'
                  >
                    My Account
                  </Link>
                  <Link
                    href='/account/orders'
                    onClick={handleLinkClick}
                    className='block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted'
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className='block w-full rounded-md px-2 py-1.5 text-left text-sm text-destructive transition-colors hover:bg-muted disabled:opacity-50'
                  >
                    {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { MobileNav };
