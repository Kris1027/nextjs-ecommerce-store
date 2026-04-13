import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/account', '/checkout'];
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

const isProtectedRoute = (pathname: string): boolean =>
  PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

const isAuthRoute = (pathname: string): boolean =>
  AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-DNS-Prefetch-Control': 'on',
} as const;

const buildCsp = (nonce: string): string => {
  const isDev = process.env.NODE_ENV === 'development';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://js.stripe.com${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    "img-src 'self' blob: data: https://res.cloudinary.com https://placehold.co",
    "font-src 'self'",
    `connect-src 'self' ${apiUrl} https://api.stripe.com`,
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ];

  return directives.join('; ');
};

const applySecurityHeaders = (response: NextResponse): void => {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
  }
};

export const proxy = (request: NextRequest): NextResponse => {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has('refresh-token');

  // Unauthenticated user trying to access protected route → redirect to login
  if (isProtectedRoute(pathname) && !hasRefreshToken) {
    const loginUrl = new URL('/login', request.url);
    const redirectPath = pathname + request.nextUrl.search;
    loginUrl.searchParams.set('redirect', redirectPath);
    const response = NextResponse.redirect(loginUrl);
    applySecurityHeaders(response);
    return response;
  }

  // Authenticated user trying to access auth pages → redirect to home
  if (isAuthRoute(pathname) && hasRefreshToken) {
    const response = NextResponse.redirect(new URL('/', request.url));
    applySecurityHeaders(response);
    return response;
  }

  // Generate CSP nonce for every request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildCsp(nonce);

  // Pass nonce to server components via request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set('Content-Security-Policy', csp);
  applySecurityHeaders(response);

  return response;
};

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - image/icon assets with extensions: svg, png, jpg, jpeg, gif, webp, ico
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
