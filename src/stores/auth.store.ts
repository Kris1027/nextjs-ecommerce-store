import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: unknown;
};

type AuthActions = {
  setAuth: (accessToken: string, refreshToken: string, user: unknown) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  setAuth: (accessToken, refreshToken, user) =>
    set({ accessToken, refreshToken, user }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
}));

export const getAccessToken = (): string | null =>
  useAuthStore.getState().accessToken;

export const getRefreshToken = (): string | null =>
  useAuthStore.getState().refreshToken;
