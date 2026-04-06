import Link from 'next/link';
import { FooterAccountLinks } from '@/components/layout/footer-account-links';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Categories', href: '/categories' },
    {
      label: 'New Arrivals',
      href: '/products?sortBy=createdAt&sortOrder=desc',
    },
    { label: 'Featured', href: '/products?isFeatured=true' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'FAQ', href: '/faq' },
  ],
} as const;

const Footer = () => {
  return (
    <footer className='border-t bg-muted/40 safe-pl safe-pr safe-pb'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
          <div>
            <Link href='/' className='text-lg font-bold tracking-tight'>
              Store
            </Link>
            <p className='mt-2 text-sm text-muted-foreground'>
              Modern ecommerce built with quality in mind.
            </p>
          </div>

          <nav aria-label='Shop'>
            <h3 className='text-sm font-semibold'>Shop</h3>
            <ul className='mt-3 space-y-2'>
              {footerLinks.shop.map((link) => (
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
          </nav>

          <nav aria-label='Account'>
            <h3 className='text-sm font-semibold'>Account</h3>
            <FooterAccountLinks />
          </nav>

          <nav aria-label='Support'>
            <h3 className='text-sm font-semibold'>Support</h3>
            <ul className='mt-3 space-y-2'>
              {footerLinks.support.map((link) => (
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
          </nav>
        </div>

        <div className='mt-12 border-t pt-8 text-center text-sm text-muted-foreground'>
          <p>&copy; {new Date().getFullYear()} Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
