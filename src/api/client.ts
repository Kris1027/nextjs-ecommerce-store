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

// Handle 401 responses: refresh token and retry
client.interceptors.error.use(async (error, response, request) => {
  if (response?.status !== 401) return error;

  // Don't try to refresh if this IS the refresh request (avoids infinite loop)
  if (request.url.includes('/auth/refresh')) {
    useAuthStore.getState().clearAuth();
    return error;
  }

  // Deduplicate concurrent refresh attempts
  if (!refreshPromise) {
    refreshPromise = refreshTokens().finally(() => {
      refreshPromise = null;
    });
  }

  const refreshed = await refreshPromise;
  if (!refreshed) return error;

  // Retry the original request with the new token
  const newToken = getAccessToken();
  if (newToken) {
    request.headers.set('Authorization', `Bearer ${newToken}`);
  }
  const retryResponse = await fetch(request);

  if (retryResponse.ok) {
    return retryResponse.json();
  }

  return error;
});

export { client };
