import type { Metadata } from 'next';
import { headers } from 'next/headers';
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

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

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
        <link rel='dns-prefetch' href='https://res.cloudinary.com' />
        <link rel='preconnect' href={new URL(env.NEXT_PUBLIC_API_URL).origin} />
        <link
          rel='dns-prefetch'
          href={new URL(env.NEXT_PUBLIC_API_URL).origin}
        />
        <link rel='preconnect' href='https://js.stripe.com' />
        <link rel='dns-prefetch' href='https://js.stripe.com' />
      </head>
      <body className='antialiased'>
        <Providers>
          <a
            href='#main-content'
            className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none'
          >
            Skip to content
          </a>
          <OfflineBanner />
          <Header />
          <main
            id='main-content'
            tabIndex={-1}
            className='min-h-[calc(100vh-4rem)] outline-none'
          >
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
