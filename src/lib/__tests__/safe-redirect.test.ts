import { getSafeRedirect } from '@/lib/safe-redirect';

describe('getSafeRedirect', () => {
  it('should return "/" when redirect is null', () => {
    expect(getSafeRedirect(null)).toBe('/');
  });

  it('should return "/" when redirect is empty string', () => {
    expect(getSafeRedirect('')).toBe('/');
  });

  it('should return the path when it starts with a single slash', () => {
    expect(getSafeRedirect('/dashboard')).toBe('/dashboard');
  });

  it('should return "/" when redirect starts with "//" (protocol-relative)', () => {
    expect(getSafeRedirect('//evil.com')).toBe('/');
  });

  it('should return "/" when redirect is an absolute URL', () => {
    expect(getSafeRedirect('http://evil.com')).toBe('/');
    expect(getSafeRedirect('https://evil.com')).toBe('/');
  });

  it('should return "/" when redirect has no leading slash', () => {
    expect(getSafeRedirect('dashboard')).toBe('/');
  });

  it('should preserve query strings on valid paths', () => {
    expect(getSafeRedirect('/search?q=shoes')).toBe('/search?q=shoes');
  });

  it('should preserve hash fragments on valid paths', () => {
    expect(getSafeRedirect('/products#featured')).toBe('/products#featured');
  });
});
