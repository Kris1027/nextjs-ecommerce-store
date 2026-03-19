const COOKIE_NAME = 'refresh-token';
const MAX_AGE_DAYS = 7;

const isBrowser = typeof document !== 'undefined';

const getRefreshTokenCookie = (): string | null => {
  if (!isBrowser) return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const setRefreshTokenCookie = (token: string): void => {
  if (!isBrowser) return;
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const clearRefreshTokenCookie = (): void => {
  if (!isBrowser) return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
};

export {
  getRefreshTokenCookie,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
