import { useCheckoutStore } from '@/stores/checkout.store';

describe('useCheckoutStore', () => {
  beforeEach(() => {
    useCheckoutStore.getState().reset();
    sessionStorage.clear();
  });

  it('should have correct initial state', () => {
    const state = useCheckoutStore.getState();
    expect(state.currentStep).toBe(0);
    expect(state.shippingAddressId).toBeNull();
    expect(state.shippingMethodId).toBeNull();
    expect(state.notes).toBe('');
  });

  describe('setCurrentStep', () => {
    it('should update the current step', () => {
      useCheckoutStore.getState().setCurrentStep(2);
      expect(useCheckoutStore.getState().currentStep).toBe(2);
    });
  });

  describe('setShippingAddressId', () => {
    it('should set the shipping address ID', () => {
      useCheckoutStore.getState().setShippingAddressId('addr-1');
      expect(useCheckoutStore.getState().shippingAddressId).toBe('addr-1');
    });
  });

  describe('setShippingMethodId', () => {
    it('should set the shipping method ID', () => {
      useCheckoutStore.getState().setShippingMethodId('ship-1');
      expect(useCheckoutStore.getState().shippingMethodId).toBe('ship-1');
    });
  });

  describe('setNotes', () => {
    it('should update notes', () => {
      useCheckoutStore.getState().setNotes('Leave at door');
      expect(useCheckoutStore.getState().notes).toBe('Leave at door');
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      useCheckoutStore.getState().setCurrentStep(3);
      useCheckoutStore.getState().setShippingAddressId('addr-1');
      useCheckoutStore.getState().setShippingMethodId('ship-1');
      useCheckoutStore.getState().setNotes('Note');

      useCheckoutStore.getState().reset();

      const state = useCheckoutStore.getState();
      expect(state.currentStep).toBe(0);
      expect(state.shippingAddressId).toBeNull();
      expect(state.shippingMethodId).toBeNull();
      expect(state.notes).toBe('');
    });
  });
});
