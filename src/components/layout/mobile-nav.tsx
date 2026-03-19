'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { List, MagnifyingGlass } from '@phosphor-icons/react';
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
import type { CategoryResponseDto } from '@/api/generated/types.gen';

type MobileNavProps = {
  categories: CategoryResponseDto[];
};

const MobileNav = ({ categories }: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleSearch = (e: React.FormEvent) => {
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
        <List size={20} />
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className='flex flex-col gap-4 p-4'>
          <form onSubmit={handleSearch} className='relative'>
            <MagnifyingGlass
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
                  href='/profile'
                  onClick={handleLinkClick}
                  className='block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted'
                >
                  My Profile
                </Link>
                <Link
                  href='/orders'
                  onClick={handleLinkClick}
                  className='block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted'
                >
                  My Orders
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { MobileNav };
