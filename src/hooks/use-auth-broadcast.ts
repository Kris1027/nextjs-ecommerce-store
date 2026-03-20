'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { authControllerRefresh } from '@/api/generated/sdk.gen';
import { usersControllerGetProfile } from '@/api/generated/sdk.gen';
import { getRefreshTokenCookie } from '@/lib/auth-tokens';
import { useCartStore } from '@/stores/cart.store';
import { queryClient } from '@/lib/query-client';
import { CART_QUERY_KEY } from '@/hooks/use-cart';

type AuthMessage = { type: 'AUTH_LOGIN' } | { type: 'AUTH_LOGOUT' };

const CHANNEL_NAME = 'auth-sync';

export const broadcastLogin = (): void => {
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: 'AUTH_LOGIN' } satisfies AuthMessage);
    channel.close();
  } catch {
    // BroadcastChannel not supported (e.g., SSR, older browsers)
  }
};

export const broadcastLogout = (): void => {
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: 'AUTH_LOGOUT' } satisfies AuthMessage);
    channel.close();
  } catch {
    // BroadcastChannel not supported
  }
};

export const useAuthBroadcast = (): void => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    let channel: BroadcastChannel;

    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch {
      return;
    }

    const handleMessage = (event: MessageEvent<AuthMessage>) => {
      const { data } = event;

      if (data.type === 'AUTH_LOGOUT') {
        clearAuth();
        clearCart();
        queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY] });
        return;
      }

      if (data.type === 'AUTH_LOGIN') {
        // Hydrate from cookie instead of receiving tokens over the channel
        const refreshToken = getRefreshTokenCookie();
        if (!refreshToken) return;

        const hydrate = async () => {
          try {
            const { data: tokenResponse } = await authControllerRefresh({
              body: { refreshToken },
              throwOnError: true,
            });

            const { data: profileResponse } = await usersControllerGetProfile({
              headers: {
                Authorization: `Bearer ${tokenResponse.data.accessToken}`,
              },
              throwOnError: true,
            });

            setAuth(
              tokenResponse.data.accessToken,
              tokenResponse.data.refreshToken,
              profileResponse.data,
            );
            queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY] });
          } catch {
            clearAuth();
          }
        };

        hydrate();
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [setAuth, clearAuth, clearCart]);
};
