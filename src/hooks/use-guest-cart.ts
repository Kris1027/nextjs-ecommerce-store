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
import { useGuestCartStore } from '@/stores/guest-cart.store';
import { getErrorMessage } from '@/lib/api-error';

const CART_QUERY_KEY = ['guest-cart'] as const;

const useGuestCart = () => {
  const queryClient = useQueryClient();
  const { token, setToken, setCart, clearCart, hydrateToken } =
    useGuestCartStore();

  useEffect(() => {
    hydrateToken();
  }, [hydrateToken]);

  const cartQuery = useQuery({
    queryKey: CART_QUERY_KEY,
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
      setCart({
        items: cartQuery.data.items ?? [],
        totalItems: cartQuery.data.totalItems ?? 0,
        subtotal: cartQuery.data.subtotal ?? 0,
      });
    }
  }, [cartQuery.data, setCart]);

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
        setCart({
          items: data.items ?? [],
          totalItems: data.totalItems ?? 0,
          subtotal: data.subtotal ?? 0,
        });
      }
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
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
        setCart({
          items: data.items ?? [],
          totalItems: data.totalItems ?? 0,
          subtotal: data.subtotal ?? 0,
        });
      }
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
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
        setCart({
          items: data.items ?? [],
          totalItems: data.totalItems ?? 0,
          subtotal: data.subtotal ?? 0,
        });
      }
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
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
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
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
