import { useCartStore } from '@/stores/cart.store';

const INITIAL_STATE = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  couponCode: null,
  discountAmount: 0,
  estimatedTotal: 0,
};

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should have correct initial state', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.totalItems).toBe(0);
    expect(state.subtotal).toBe(0);
    expect(state.couponCode).toBeNull();
    expect(state.discountAmount).toBe(0);
    expect(state.estimatedTotal).toBe(0);
  });

  describe('setCart', () => {
    it('should update all cart fields', () => {
      const cartData = {
        items: [{ id: '1', name: 'Test' }] as never[],
        totalItems: 3,
        subtotal: 99.99,
        couponCode: 'SAVE10',
        discountAmount: 10,
        estimatedTotal: 89.99,
      };

      useCartStore.getState().setCart(cartData);
      const state = useCartStore.getState();

      expect(state.totalItems).toBe(3);
      expect(state.subtotal).toBe(99.99);
      expect(state.couponCode).toBe('SAVE10');
      expect(state.discountAmount).toBe(10);
      expect(state.estimatedTotal).toBe(89.99);
    });
  });

  describe('clearCart', () => {
    it('should reset to initial state', () => {
      useCartStore.getState().setCart({
        items: [] as never[],
        totalItems: 5,
        subtotal: 200,
        couponCode: 'CODE',
        discountAmount: 20,
        estimatedTotal: 180,
      });

      useCartStore.getState().clearCart();
      const state = useCartStore.getState();

      expect(state.totalItems).toBe(INITIAL_STATE.totalItems);
      expect(state.subtotal).toBe(INITIAL_STATE.subtotal);
      expect(state.couponCode).toBe(INITIAL_STATE.couponCode);
    });
  });
});
