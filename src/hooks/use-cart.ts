import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  cartControllerGetCart,
  cartControllerAddItem,
  cartControllerUpdateItem,
  cartControllerRemoveItem,
  cartControllerClearCart,
  cartControllerApplyCoupon,
  cartControllerRemoveCoupon,
  guestCartControllerGetCart,
  guestCartControllerAddItem,
  guestCartControllerUpdateItem,
  guestCartControllerRemoveItem,
  guestCartControllerClearCart,
} from '@/api/generated/sdk.gen';
import type {
  CartResponseDto,
  GuestCartResponseDto,
} from '@/api/generated/types.gen';
import { useCartStore } from '@/stores/cart.store';
import { useGuestCartStore } from '@/stores/guest-cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/lib/api-error';

const CART_QUERY_KEY = ['cart'] as const;

const syncGuestCartToStore = (cart: GuestCartResponseDto) => {
  useCartStore.getState().setCart({
    items: cart.items ?? [],
    totalItems: cart.totalItems ?? 0,
    subtotal: cart.subtotal ?? 0,
    couponCode: null,
    discountAmount: 0,
    estimatedTotal: cart.subtotal ?? 0,
  });
};

const syncAuthCartToStore = (cart: CartResponseDto) => {
  const couponCode = cart.couponCode as unknown as string | null;
  useCartStore.getState().setCart({
    items: cart.items ?? [],
    totalItems: cart.totalItems ?? 0,
    subtotal: cart.subtotal ?? 0,
    couponCode: couponCode ?? null,
    discountAmount: cart.discountAmount ?? 0,
    estimatedTotal: cart.estimatedTotal ?? cart.subtotal ?? 0,
  });
};

const useCart = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = !!accessToken;

  const guestToken = useGuestCartStore((s) => s.token);
  const setGuestToken = useGuestCartStore((s) => s.setToken);
  const hydrateGuestToken = useGuestCartStore((s) => s.hydrateToken);

  useEffect(() => {
    if (!isAuthenticated) {
      hydrateGuestToken();
    }
  }, [isAuthenticated, hydrateGuestToken]);

  const cartQuery = useQuery({
    queryKey: [...CART_QUERY_KEY, isAuthenticated ? 'auth' : guestToken],
    queryFn: async () => {
      if (isAuthenticated) {
        const response = await cartControllerGetCart();
        return { type: 'auth' as const, data: response.data?.data ?? null };
      }

      if (!guestToken) return null;
      const response = await guestCartControllerGetCart({
        headers: { 'x-guest-cart-token': guestToken },
      });
      return { type: 'guest' as const, data: response.data?.data ?? null };
    },
    enabled: isAuthenticated || !!guestToken,
  });

  useEffect(() => {
    if (!cartQuery.data?.data) return;
    if (cartQuery.data.type === 'auth') {
      syncAuthCartToStore(cartQuery.data.data as CartResponseDto);
    } else {
      syncGuestCartToStore(cartQuery.data.data as GuestCartResponseDto);
    }
  }, [cartQuery.data]);

  const invalidateCart = () => {
    queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
  };

  const addItem = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      if (isAuthenticated) {
        const response = await cartControllerAddItem({
          body: { productId, quantity },
        });
        return { type: 'auth' as const, data: response.data?.data ?? null };
      }

      const response = await guestCartControllerAddItem({
        headers: guestToken ? { 'x-guest-cart-token': guestToken } : undefined,
        body: { productId, quantity },
      });

      const newToken = response.response?.headers?.get('x-guest-cart-token');
      if (newToken) {
        setGuestToken(newToken);
      }

      return { type: 'guest' as const, data: response.data?.data ?? null };
    },
    onSuccess: (result) => {
      if (result.data) {
        if (result.type === 'auth') {
          syncAuthCartToStore(result.data as CartResponseDto);
        } else {
          syncGuestCartToStore(result.data as GuestCartResponseDto);
        }
      }
      invalidateCart();
      toast.success('Added to cart');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      if (isAuthenticated) {
        const response = await cartControllerUpdateItem({
          path: { itemId },
          body: { quantity },
        });
        return { type: 'auth' as const, data: response.data?.data ?? null };
      }

      if (!guestToken) throw new Error('No cart token');
      const response = await guestCartControllerUpdateItem({
        headers: { 'x-guest-cart-token': guestToken },
        path: { itemId },
        body: { quantity },
      });
      return { type: 'guest' as const, data: response.data?.data ?? null };
    },
    onSuccess: (result) => {
      if (result.data) {
        if (result.type === 'auth') {
          syncAuthCartToStore(result.data as CartResponseDto);
        } else {
          syncGuestCartToStore(result.data as GuestCartResponseDto);
        }
      }
      invalidateCart();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      if (isAuthenticated) {
        const response = await cartControllerRemoveItem({
          path: { itemId },
        });
        return { type: 'auth' as const, data: response.data?.data ?? null };
      }

      if (!guestToken) throw new Error('No cart token');
      const response = await guestCartControllerRemoveItem({
        headers: { 'x-guest-cart-token': guestToken },
        path: { itemId },
      });
      return { type: 'guest' as const, data: response.data?.data ?? null };
    },
    onSuccess: (result) => {
      if (result.data) {
        if (result.type === 'auth') {
          syncAuthCartToStore(result.data as CartResponseDto);
        } else {
          syncGuestCartToStore(result.data as GuestCartResponseDto);
        }
      }
      invalidateCart();
      toast.success('Removed from cart');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const clear = useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        await cartControllerClearCart();
        return;
      }

      if (!guestToken) throw new Error('No cart token');
      await guestCartControllerClearCart({
        headers: { 'x-guest-cart-token': guestToken },
      });
    },
    onSuccess: () => {
      useCartStore.getState().clearCart();
      if (!isAuthenticated) {
        useGuestCartStore.getState().clearCart();
      }
      invalidateCart();
      toast.success('Cart cleared');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const applyCoupon = useMutation({
    mutationFn: async (code: string) => {
      const response = await cartControllerApplyCoupon({
        body: { code },
      });
      return response.data?.data ?? null;
    },
    onSuccess: (data) => {
      if (data) {
        syncAuthCartToStore(data);
      }
      invalidateCart();
      toast.success('Coupon applied');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const removeCoupon = useMutation({
    mutationFn: async () => {
      const response = await cartControllerRemoveCoupon();
      return response.data?.data ?? null;
    },
    onSuccess: (data) => {
      if (data) {
        syncAuthCartToStore(data);
      }
      invalidateCart();
      toast.success('Coupon removed');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    items: useCartStore((s) => s.items),
    totalItems: useCartStore((s) => s.totalItems),
    subtotal: useCartStore((s) => s.subtotal),
    couponCode: useCartStore((s) => s.couponCode),
    discountAmount: useCartStore((s) => s.discountAmount),
    estimatedTotal: useCartStore((s) => s.estimatedTotal),
    isLoading: cartQuery.isLoading,
    isAuthenticated,
    addItem,
    updateItem,
    removeItem,
    clear,
    applyCoupon,
    removeCoupon,
  };
};

export { useCart, CART_QUERY_KEY };
