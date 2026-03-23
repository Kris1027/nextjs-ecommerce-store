import { useGuestCartStore } from '@/stores/guest-cart.store';
import {
  setGuestCartToken,
  getGuestCartToken,
  clearGuestCartToken,
} from '@/lib/guest-cart-token';

vi.mock('@/lib/guest-cart-token', () => ({
  setGuestCartToken: vi.fn(),
  getGuestCartToken: vi.fn(),
  clearGuestCartToken: vi.fn(),
}));

describe('useGuestCartStore', () => {
  beforeEach(() => {
    useGuestCartStore.setState({
      token: null,
      items: [],
      totalItems: 0,
      subtotal: 0,
    });
    vi.clearAllMocks();
  });

  it('should have correct initial state', () => {
    const state = useGuestCartStore.getState();
    expect(state.token).toBeNull();
    expect(state.items).toEqual([]);
    expect(state.totalItems).toBe(0);
    expect(state.subtotal).toBe(0);
  });

  describe('setToken', () => {
    it('should set token in state and cookie', () => {
      useGuestCartStore.getState().setToken('guest-abc');

      expect(useGuestCartStore.getState().token).toBe('guest-abc');
      expect(setGuestCartToken).toHaveBeenCalledWith('guest-abc');
    });
  });

  describe('setCart', () => {
    it('should update items, totalItems, and subtotal', () => {
      useGuestCartStore.getState().setCart({
        items: [{ id: '1' }] as never[],
        totalItems: 2,
        subtotal: 49.99,
      });

      const state = useGuestCartStore.getState();
      expect(state.totalItems).toBe(2);
      expect(state.subtotal).toBe(49.99);
      expect(state.items).toHaveLength(1);
    });
  });

  describe('clearCart', () => {
    it('should reset all state and clear cookie', () => {
      useGuestCartStore.getState().setToken('guest-abc');
      useGuestCartStore.getState().setCart({
        items: [{ id: '1' }] as never[],
        totalItems: 2,
        subtotal: 49.99,
      });

      useGuestCartStore.getState().clearCart();

      const state = useGuestCartStore.getState();
      expect(state.token).toBeNull();
      expect(state.items).toEqual([]);
      expect(state.totalItems).toBe(0);
      expect(state.subtotal).toBe(0);
      expect(clearGuestCartToken).toHaveBeenCalled();
    });
  });

  describe('hydrateToken', () => {
    it('should set token from cookie when it exists', () => {
      vi.mocked(getGuestCartToken).mockReturnValue('cookie-guest-token');
      useGuestCartStore.getState().hydrateToken();

      expect(useGuestCartStore.getState().token).toBe('cookie-guest-token');
    });

    it('should not change state when no cookie exists', () => {
      vi.mocked(getGuestCartToken).mockReturnValue(null);
      useGuestCartStore.getState().hydrateToken();

      expect(useGuestCartStore.getState().token).toBeNull();
    });
  });
});
