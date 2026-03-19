import { client } from '@/api/generated/client.gen';
import { authControllerRefresh } from '@/api/generated/sdk.gen';
import { env } from '@/config/env';
import {
  getAccessToken,
  getRefreshToken,
  useAuthStore,
} from '@/stores/auth.store';

client.setConfig({
  baseUrl: env.NEXT_PUBLIC_API_URL,
});

// Inject Authorization header on every request
client.interceptors.request.use((request) => {
  const token = getAccessToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
});

// Track whether a refresh is already in progress to avoid multiple simultaneous refreshes
let refreshPromise: Promise<boolean> | null = null;

const refreshTokens = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const { data } = await authControllerRefresh({
      body: { refreshToken },
      throwOnError: true,
    });

    useAuthStore
      .getState()
      .setTokens(data.data.accessToken, data.data.refreshToken);
    return true;
  } catch {
    useAuthStore.getState().clearAuth();
    return false;
  }
};

// Handle 401 responses: refresh token and retry the original request
client.interceptors.response.use(async (response, request) => {
  if (response.status !== 401) return response;

  // Don't try to refresh if this IS the refresh request (avoids infinite loop)
  if (request.url.includes('/auth/refresh')) {
    useAuthStore.getState().clearAuth();
    return response;
  }

  // Deduplicate concurrent refresh attempts
  if (!refreshPromise) {
    refreshPromise = refreshTokens().finally(() => {
      refreshPromise = null;
    });
  }

  const refreshed = await refreshPromise;
  if (!refreshed) return response;

  // Retry the original request with the new token
  const newToken = getAccessToken();
  if (newToken) {
    request.headers.set('Authorization', `Bearer ${newToken}`);
  }

  return fetch(request);
});

export { client };
