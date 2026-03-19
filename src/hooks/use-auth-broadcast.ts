'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import type { UserProfileDto } from '@/api/generated/types.gen';

type AuthMessage =
  | {
      type: 'AUTH_LOGIN';
      accessToken: string;
      refreshToken: string;
      user: UserProfileDto;
    }
  | { type: 'AUTH_LOGOUT' };

const CHANNEL_NAME = 'auth-sync';

export const broadcastLogin = (
  accessToken: string,
  refreshToken: string,
  user: UserProfileDto,
): void => {
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    const message: AuthMessage = {
      type: 'AUTH_LOGIN',
      accessToken,
      refreshToken,
      user,
    };
    channel.postMessage(message);
    channel.close();
  } catch {
    // BroadcastChannel not supported (e.g., SSR, older browsers)
  }
};

export const broadcastLogout = (): void => {
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    const message: AuthMessage = { type: 'AUTH_LOGOUT' };
    channel.postMessage(message);
    channel.close();
  } catch {
    // BroadcastChannel not supported
  }
};

export const useAuthBroadcast = (): void => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    let channel: BroadcastChannel;

    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch {
      return;
    }

    const handleMessage = (event: MessageEvent<AuthMessage>) => {
      const { data } = event;

      if (data.type === 'AUTH_LOGIN') {
        setAuth(data.accessToken, data.refreshToken, data.user);
      }

      if (data.type === 'AUTH_LOGOUT') {
        clearAuth();
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [setAuth, clearAuth]);
};
