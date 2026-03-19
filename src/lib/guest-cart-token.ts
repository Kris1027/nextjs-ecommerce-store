const COOKIE_NAME = 'guest-cart-token';
const MAX_AGE_DAYS = 30;

const isBrowser = typeof document !== 'undefined';

const getGuestCartToken = (): string | null => {
  if (!isBrowser) return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const setGuestCartToken = (token: string): void => {
  if (!isBrowser) return;
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const clearGuestCartToken = (): void => {
  if (!isBrowser) return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
};

export { getGuestCartToken, setGuestCartToken, clearGuestCartToken };
