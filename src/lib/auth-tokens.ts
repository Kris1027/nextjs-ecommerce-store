const COOKIE_NAME = 'refresh-token';
const MAX_AGE_DAYS = 7;

const isBrowser = typeof document !== 'undefined';
const isSecure = isBrowser && window.location.protocol === 'https:';

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
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'path=/',
    `max-age=${maxAge}`,
    'SameSite=Lax',
  ];

  if (isSecure) {
    parts.push('Secure');
  }

  document.cookie = parts.join('; ');
};

const clearRefreshTokenCookie = (): void => {
  if (!isBrowser) return;

  const parts = [`${COOKIE_NAME}=`, 'path=/', 'max-age=0', 'SameSite=Lax'];

  if (isSecure) {
    parts.push('Secure');
  }

  document.cookie = parts.join('; ');
};

export {
  getRefreshTokenCookie,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
