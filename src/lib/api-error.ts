const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message || DEFAULT_ERROR_MESSAGE;
  }

  if (typeof error === 'string') {
    return error;
  }

  return DEFAULT_ERROR_MESSAGE;
};
