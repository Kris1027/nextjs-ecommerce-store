'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { authControllerRefresh } from '@/api/generated/sdk.gen';
import { usersControllerGetProfile } from '@/api/generated/sdk.gen';

export const useAuthHydration = (): void => {
  const calledRef = useRef(false);
  const { hydrateAuth, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    // Read refresh token from cookie into store
    hydrateAuth();

    const refreshToken = useAuthStore.getState().refreshToken;
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
      } catch {
        clearAuth();
      }
    };

    hydrate();
  }, [hydrateAuth, setAuth, clearAuth]);
};
