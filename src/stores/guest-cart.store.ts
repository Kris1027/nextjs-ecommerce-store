import { create } from 'zustand';
import type { GuestCartItemDto } from '@/api/generated/types.gen';
import {
  getGuestCartToken,
  setGuestCartToken,
  clearGuestCartToken,
} from '@/lib/guest-cart-token';

type GuestCartState = {
  token: string | null;
  items: GuestCartItemDto[];
  totalItems: number;
  subtotal: number;
};

type GuestCartActions = {
  setToken: (token: string) => void;
  setCart: (cart: {
    items: GuestCartItemDto[];
    totalItems: number;
    subtotal: number;
  }) => void;
  clearCart: () => void;
  hydrateToken: () => void;
};

const useGuestCartStore = create<GuestCartState & GuestCartActions>()(
  (set) => ({
    token: null,
    items: [],
    totalItems: 0,
    subtotal: 0,

    setToken: (token) => {
      setGuestCartToken(token);
      set({ token });
    },

    setCart: (cart) => {
      set({
        items: cart.items,
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
      });
    },

    clearCart: () => {
      clearGuestCartToken();
      set({ token: null, items: [], totalItems: 0, subtotal: 0 });
    },

    hydrateToken: () => {
      const token = getGuestCartToken();
      if (token) set({ token });
    },
  }),
);

export { useGuestCartStore };
