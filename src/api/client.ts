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

const DEFAULT_RETRY_MS = 2000;
const MAX_RETRY_MS = 10_000;

const computeRetryAfterMs = (retryAfter: string | null): number => {
  if (!retryAfter) return DEFAULT_RETRY_MS;

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1000, MAX_RETRY_MS);
  }

  const parsedDateMs = Date.parse(retryAfter);
  if (!Number.isNaN(parsedDateMs)) {
    const deltaMs = parsedDateMs - Date.now();
    if (deltaMs > 0) return Math.min(deltaMs, MAX_RETRY_MS);
  }

  return DEFAULT_RETRY_MS;
};

// Handle 429 responses: rate limited — wait and retry once
client.interceptors.response.use(async (response, request) => {
  if (response.status !== 429) return response;

  const retryAfter = response.headers.get('Retry-After');
  const waitMs = computeRetryAfterMs(retryAfter);

  await new Promise((resolve) => setTimeout(resolve, waitMs));

  return fetch(request.clone());
});

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
  // Clone the request because the original body stream may be consumed
  const retryRequest = request.clone();
  const newToken = getAccessToken();
  if (newToken) {
    retryRequest.headers.set('Authorization', `Bearer ${newToken}`);
  }

  return fetch(retryRequest);
});

export { client };
