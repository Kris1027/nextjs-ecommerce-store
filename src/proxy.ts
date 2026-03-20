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

export const proxy = (request: NextRequest): NextResponse | undefined => {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has('refresh-token');

  // Unauthenticated user trying to access protected route → redirect to login
  if (isProtectedRoute(pathname) && !hasRefreshToken) {
    const loginUrl = new URL('/login', request.url);
    const redirectPath = pathname + request.nextUrl.search;
    loginUrl.searchParams.set('redirect', redirectPath);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access auth pages → redirect to home
  if (isAuthRoute(pathname) && hasRefreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return undefined;
};

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
