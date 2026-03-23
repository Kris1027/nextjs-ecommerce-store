import {
  getGuestCartToken,
  setGuestCartToken,
  clearGuestCartToken,
} from '@/lib/guest-cart-token';

describe('guest-cart-token', () => {
  afterEach(() => {
    clearGuestCartToken();
  });

  describe('getGuestCartToken', () => {
    it('should return null when no cookie is set', () => {
      expect(getGuestCartToken()).toBeNull();
    });

    it('should return the token value when cookie exists', () => {
      document.cookie = 'guest-cart-token=cart-abc-123';
      expect(getGuestCartToken()).toBe('cart-abc-123');
    });
  });

  describe('setGuestCartToken', () => {
    it('should set cookie with correct name', () => {
      setGuestCartToken('cart-xyz-789');
      expect(getGuestCartToken()).toBe('cart-xyz-789');
    });
  });

  describe('clearGuestCartToken', () => {
    it('should remove the cookie', () => {
      setGuestCartToken('cart-abc-123');
      expect(getGuestCartToken()).toBe('cart-abc-123');

      clearGuestCartToken();
      expect(getGuestCartToken()).toBeNull();
    });
  });
});
