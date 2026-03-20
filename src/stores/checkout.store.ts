import { create } from 'zustand';

type CheckoutState = {
  shippingAddressId: string | null;
  shippingMethodId: string | null;
  notes: string;
};

type CheckoutActions = {
  setShippingAddressId: (id: string) => void;
  setShippingMethodId: (id: string) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
};

const initialState: CheckoutState = {
  shippingAddressId: null,
  shippingMethodId: null,
  notes: '',
};

export const useCheckoutStore = create<CheckoutState & CheckoutActions>(
  (set) => ({
    ...initialState,
    setShippingAddressId: (id) => set({ shippingAddressId: id }),
    setShippingMethodId: (id) => set({ shippingMethodId: id }),
    setNotes: (notes) => set({ notes }),
    reset: () => set(initialState),
  }),
);
