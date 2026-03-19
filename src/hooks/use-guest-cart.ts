import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  guestCartControllerGetCart,
  guestCartControllerAddItem,
  guestCartControllerUpdateItem,
  guestCartControllerRemoveItem,
  guestCartControllerClearCart,
} from '@/api/generated/sdk.gen';
import type { GuestCartResponseDto } from '@/api/generated/types.gen';
import { useGuestCartStore } from '@/stores/guest-cart.store';
import { getErrorMessage } from '@/lib/api-error';

const CART_QUERY_KEY_PREFIX = 'guest-cart' as const;

const getCartQueryKey = (token: string | null) =>
  [CART_QUERY_KEY_PREFIX, token] as const;

const syncCartToStore = (cart: GuestCartResponseDto) => {
  useGuestCartStore.getState().setCart({
    items: cart.items ?? [],
    totalItems: cart.totalItems ?? 0,
    subtotal: cart.subtotal ?? 0,
  });
};

const useGuestCart = () => {
  const queryClient = useQueryClient();
  const token = useGuestCartStore((s) => s.token);
  const setToken = useGuestCartStore((s) => s.setToken);
  const clearCart = useGuestCartStore((s) => s.clearCart);
  const hydrateToken = useGuestCartStore((s) => s.hydrateToken);

  useEffect(() => {
    hydrateToken();
  }, [hydrateToken]);

  const cartQueryKey = getCartQueryKey(token);

  const cartQuery = useQuery({
    queryKey: cartQueryKey,
    queryFn: async () => {
      if (!token) return null;
      const response = await guestCartControllerGetCart({
        headers: { 'x-guest-cart-token': token },
      });
      return response.data?.data ?? null;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (cartQuery.data) {
      syncCartToStore(cartQuery.data);
    }
  }, [cartQuery.data]);

  const addItem = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const response = await guestCartControllerAddItem({
        headers: token ? { 'x-guest-cart-token': token } : undefined,
        body: { productId, quantity },
      });

      const newToken = response.response?.headers?.get('x-guest-cart-token');
      if (newToken) {
        setToken(newToken);
      }

      return response.data?.data ?? null;
    },
    onSuccess: (data) => {
      if (data) {
        syncCartToStore(data);
        const currentToken = useGuestCartStore.getState().token;
        queryClient.setQueryData(getCartQueryKey(currentToken), data);
      }
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
      if (!token) throw new Error('No cart token');
      const response = await guestCartControllerUpdateItem({
        headers: { 'x-guest-cart-token': token },
        path: { itemId },
        body: { quantity },
      });
      return response.data?.data ?? null;
    },
    onSuccess: (data) => {
      if (data) {
        syncCartToStore(data);
        queryClient.setQueryData(cartQueryKey, data);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      if (!token) throw new Error('No cart token');
      const response = await guestCartControllerRemoveItem({
        headers: { 'x-guest-cart-token': token },
        path: { itemId },
      });
      return response.data?.data ?? null;
    },
    onSuccess: (data) => {
      if (data) {
        syncCartToStore(data);
        queryClient.setQueryData(cartQueryKey, data);
      }
      toast.success('Removed from cart');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const clear = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error('No cart token');
      await guestCartControllerClearCart({
        headers: { 'x-guest-cart-token': token },
      });
    },
    onSuccess: () => {
      clearCart();
      queryClient.setQueryData(cartQueryKey, null);
      toast.success('Cart cleared');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    items: useGuestCartStore((s) => s.items),
    totalItems: useGuestCartStore((s) => s.totalItems),
    subtotal: useGuestCartStore((s) => s.subtotal),
    isLoading: cartQuery.isLoading,
    addItem,
    updateItem,
    removeItem,
    clear,
  };
};

export { useGuestCart };
