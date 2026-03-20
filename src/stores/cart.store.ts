import { create } from 'zustand';
import type { CartItemDto, GuestCartItemDto } from '@/api/generated/types.gen';

type CartItem = CartItemDto | GuestCartItemDto;

type CartState = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  couponCode: string | null;
  discountAmount: number;
  estimatedTotal: number;
};

type CartActions = {
  setCart: (cart: CartState) => void;
  clearCart: () => void;
};

const INITIAL_STATE: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  couponCode: null,
  discountAmount: 0,
  estimatedTotal: 0,
};

const useCartStore = create<CartState & CartActions>()((set) => ({
  ...INITIAL_STATE,

  setCart: (cart) => set(cart),

  clearCart: () => set(INITIAL_STATE),
}));

export { useCartStore };
export type { CartItem };
