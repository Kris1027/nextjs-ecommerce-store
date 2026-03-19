const COOKIE_NAME = 'guest-cart-token';
const MAX_AGE_DAYS = 30;

const getGuestCartToken = (): string | null => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const setGuestCartToken = (token: string): void => {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const clearGuestCartToken = (): void => {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
};

export { getGuestCartToken, setGuestCartToken, clearGuestCartToken };
