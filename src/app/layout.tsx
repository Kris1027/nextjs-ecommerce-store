import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OfflineBanner } from '@/components/layout/offline-banner';
import { env } from '@/config/env';
import { STORE_NAME, STORE_DESCRIPTION } from '@/lib/constants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
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
      <head>
        <link
          rel='preconnect'
          href='https://res.cloudinary.com'
          crossOrigin='anonymous'
        />
      </head>
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
