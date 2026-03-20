import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type CheckoutState = {
  currentStep: number;
  shippingAddressId: string | null;
  shippingMethodId: string | null;
  notes: string;
};

type CheckoutActions = {
  setCurrentStep: (step: number) => void;
  setShippingAddressId: (id: string) => void;
  setShippingMethodId: (id: string) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
};

const initialState: CheckoutState = {
  currentStep: 0,
  shippingAddressId: null,
  shippingMethodId: null,
  notes: '',
};

export const useCheckoutStore = create<CheckoutState & CheckoutActions>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentStep: (step) => set({ currentStep: step }),
      setShippingAddressId: (id) => set({ shippingAddressId: id }),
      setShippingMethodId: (id) => set({ shippingMethodId: id }),
      setNotes: (notes) => set({ notes }),
      reset: () => set(initialState),
    }),
    {
      name: 'checkout',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
