import { create } from 'zustand';
import type { UserProfileDto } from '@/api/generated/types.gen';
import {
  getRefreshTokenCookie,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '@/lib/auth-tokens';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfileDto | null;
};

type AuthActions = {
  setAuth: (
    accessToken: string,
    refreshToken: string,
    user: UserProfileDto,
  ) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserProfileDto) => void;
  clearAuth: () => void;
  hydrateAuth: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  setAuth: (accessToken, refreshToken, user) => {
    setRefreshTokenCookie(refreshToken);
    set({ accessToken, refreshToken, user });
  },

  setTokens: (accessToken, refreshToken) => {
    setRefreshTokenCookie(refreshToken);
    set({ accessToken, refreshToken });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    clearRefreshTokenCookie();
    set({ accessToken: null, refreshToken: null, user: null });
  },

  hydrateAuth: () => {
    const refreshToken = getRefreshTokenCookie();
    if (refreshToken) set({ refreshToken });
  },
}));

export const getAccessToken = (): string | null =>
  useAuthStore.getState().accessToken;

export const getRefreshToken = (): string | null =>
  useAuthStore.getState().refreshToken;

export const isAuthenticated = (): boolean =>
  useAuthStore.getState().accessToken !== null;
