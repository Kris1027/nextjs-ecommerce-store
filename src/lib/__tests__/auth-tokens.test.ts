import {
  getRefreshTokenCookie,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '@/lib/auth-tokens';

describe('auth-tokens', () => {
  afterEach(() => {
    clearRefreshTokenCookie();
  });

  describe('getRefreshTokenCookie', () => {
    it('should return null when no cookie is set', () => {
      expect(getRefreshTokenCookie()).toBeNull();
    });

    it('should return the token value when cookie exists', () => {
      document.cookie = 'refresh-token=my-token';
      expect(getRefreshTokenCookie()).toBe('my-token');
    });

    it('should decode URI-encoded token values', () => {
      document.cookie = `refresh-token=${encodeURIComponent('token/with+special=chars')}`;
      expect(getRefreshTokenCookie()).toBe('token/with+special=chars');
    });
  });

  describe('setRefreshTokenCookie', () => {
    it('should set cookie with correct name and 7-day max-age', () => {
      setRefreshTokenCookie('test-token');
      expect(getRefreshTokenCookie()).toBe('test-token');
    });

    it('should URI-encode the token value', () => {
      setRefreshTokenCookie('token/special=chars');
      expect(getRefreshTokenCookie()).toBe('token/special=chars');
    });
  });

  describe('clearRefreshTokenCookie', () => {
    it('should remove the cookie', () => {
      setRefreshTokenCookie('test-token');
      expect(getRefreshTokenCookie()).toBe('test-token');

      clearRefreshTokenCookie();
      expect(getRefreshTokenCookie()).toBeNull();
    });
  });
});
