'use client';

import Link from 'next/link';
import { SearchInput } from '@/components/layout/search-input';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { CartButton } from '@/components/layout/cart-button';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { UserMenu } from '@/components/layout/user-menu';
import { MobileNav } from '@/components/layout/mobile-nav';
import type { CategoryResponseDto } from '@/api/generated/types.gen';

type HeaderClientProps = {
  categories: CategoryResponseDto[];
};

const HeaderClient = ({ categories }: HeaderClientProps) => {
  return (
    <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8'>
        <MobileNav categories={categories} />

        <Link href='/' className='text-lg font-bold tracking-tight'>
          Store
        </Link>

        <nav className='hidden items-center gap-4 md:flex'>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className='text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className='ml-auto flex items-center gap-2'>
          <SearchInput />
          <ThemeToggle />
          <NotificationBell />
          <CartButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export { HeaderClient };
