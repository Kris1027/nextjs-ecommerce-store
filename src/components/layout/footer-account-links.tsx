'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';

const GUEST_LINKS = [
  { label: 'Sign In', href: '/login' },
  { label: 'Register', href: '/register' },
] as const;

const AUTH_LINKS = [
  { label: 'My Account', href: '/account' },
  { label: 'My Orders', href: '/account/orders' },
  { label: 'My Profile', href: '/account/profile' },
  { label: 'My Addresses', href: '/account/addresses' },
] as const;

const FooterAccountLinks = () => {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const links = !isHydrated || !user ? GUEST_LINKS : AUTH_LINKS;

  return (
    <ul className='mt-3 space-y-2'>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className='text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export { FooterAccountLinks };
