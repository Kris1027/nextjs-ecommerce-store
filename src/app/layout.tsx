import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OfflineBanner } from '@/components/layout/offline-banner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const STORE_NAME = 'Ecommerce Store';
const STORE_DESCRIPTION =
  'Discover quality products at great prices. Shop featured items, new arrivals, and browse categories.';

export const metadata: Metadata = {
  title: {
    default: STORE_NAME,
    template: `%s | ${STORE_NAME}`,
  },
  description: STORE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: STORE_NAME,
    title: {
      default: STORE_NAME,
      template: `%s | ${STORE_NAME}`,
    },
    description: STORE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: STORE_NAME,
      template: `%s | ${STORE_NAME}`,
    },
    description: STORE_DESCRIPTION,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang='en'
      className={cn(geistSans.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body className='antialiased'>
        <Providers>
          <OfflineBanner />
          <Header />
          <main className='min-h-[calc(100vh-4rem)]'>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
