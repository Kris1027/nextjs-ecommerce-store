/**
 * Validates a redirect path to prevent open redirect attacks.
 * Only allows relative paths starting with a single slash.
 */
export const getSafeRedirect = (redirect: string | null): string => {
  if (!redirect) return '/';
  // Must start with / and not // (protocol-relative URL)
  if (redirect.startsWith('/') && !redirect.startsWith('//')) return redirect;
  return '/';
};
