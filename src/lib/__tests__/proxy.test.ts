import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

const createRequest = (path: string, cookies?: Record<string, string>) => {
  const url = `http://localhost:3002${path}`;
  const request = new NextRequest(url);

  if (cookies) {
    for (const [name, value] of Object.entries(cookies)) {
      request.cookies.set(name, value);
    }
  }

  return request;
};

describe('proxy', () => {
  describe('security headers', () => {
    it('should set X-Frame-Options to DENY', () => {
      const response = proxy(createRequest('/'));
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('should set X-Content-Type-Options to nosniff', () => {
      const response = proxy(createRequest('/'));
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    it('should set Referrer-Policy', () => {
      const response = proxy(createRequest('/'));
      expect(response.headers.get('Referrer-Policy')).toBe(
        'strict-origin-when-cross-origin',
      );
    });

    it('should set Permissions-Policy', () => {
      const response = proxy(createRequest('/'));
      expect(response.headers.get('Permissions-Policy')).toBe(
        'camera=(), microphone=(), geolocation=()',
      );
    });

    it('should set X-DNS-Prefetch-Control', () => {
      const response = proxy(createRequest('/'));
      expect(response.headers.get('X-DNS-Prefetch-Control')).toBe('on');
    });
  });

  describe('Content Security Policy', () => {
    it('should set CSP header on response', () => {
      const response = proxy(createRequest('/'));
      const csp = response.headers.get('Content-Security-Policy');
      expect(csp).toBeTruthy();
    });

    it('should include nonce in script-src directive', () => {
      const response = proxy(createRequest('/'));
      const csp = response.headers.get('Content-Security-Policy') ?? '';
      expect(csp).toMatch(/script-src[^;]*'nonce-[a-f0-9-]+'[^;]*/);
    });

    it('should include strict-dynamic in script-src', () => {
      const response = proxy(createRequest('/'));
      const csp = response.headers.get('Content-Security-Policy') ?? '';
      expect(csp).toContain("'strict-dynamic'");
    });

    it('should allow Stripe domains', () => {
      const response = proxy(createRequest('/'));
      const csp = response.headers.get('Content-Security-Policy') ?? '';
      expect(csp).toContain('https://js.stripe.com');
      expect(csp).toContain('https://api.stripe.com');
    });

    it('should allow Cloudinary images', () => {
      const response = proxy(createRequest('/'));
      const csp = response.headers.get('Content-Security-Policy') ?? '';
      expect(csp).toContain('https://res.cloudinary.com');
    });

    it('should deny object-src', () => {
      const response = proxy(createRequest('/'));
      const csp = response.headers.get('Content-Security-Policy') ?? '';
      expect(csp).toContain("object-src 'none'");
    });

    it('should deny frame-ancestors', () => {
      const response = proxy(createRequest('/'));
      const csp = response.headers.get('Content-Security-Policy') ?? '';
      expect(csp).toContain("frame-ancestors 'none'");
    });

    it('should generate unique nonce per request', () => {
      const response1 = proxy(createRequest('/'));
      const response2 = proxy(createRequest('/'));
      const csp1 = response1.headers.get('Content-Security-Policy') ?? '';
      const csp2 = response2.headers.get('Content-Security-Policy') ?? '';
      expect(csp1).not.toBe(csp2);
    });
  });

  describe('auth redirects', () => {
    it('should redirect unauthenticated users from protected routes to login', () => {
      const response = proxy(createRequest('/account'));
      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/login');
    });

    it('should include redirect path in login URL', () => {
      const response = proxy(createRequest('/account/orders'));
      const location = response.headers.get('Location') ?? '';
      expect(location).toContain('redirect=%2Faccount%2Forders');
    });

    it('should redirect authenticated users from auth pages to home', () => {
      const response = proxy(
        createRequest('/login', { 'refresh-token': 'token' }),
      );
      expect(response.status).toBe(307);
      expect(new URL(response.headers.get('Location') ?? '').pathname).toBe(
        '/',
      );
    });

    it('should add security headers to redirect responses', () => {
      const response = proxy(createRequest('/account'));
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    it('should pass through authenticated users on protected routes', () => {
      const response = proxy(
        createRequest('/account', { 'refresh-token': 'token' }),
      );
      expect(response.status).toBe(200);
    });

    it('should pass through unauthenticated users on public pages', () => {
      const response = proxy(createRequest('/products'));
      expect(response.status).toBe(200);
    });
  });
});
