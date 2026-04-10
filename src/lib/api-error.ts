const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

const isObjectWithMessage = (error: unknown): error is { message: string } =>
  typeof error === 'object' &&
  error !== null &&
  'message' in error &&
  typeof (error as Record<string, unknown>).message === 'string';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message || DEFAULT_ERROR_MESSAGE;
  }

  if (isObjectWithMessage(error)) {
    return error.message || DEFAULT_ERROR_MESSAGE;
  }

  if (typeof error === 'string') {
    return error;
  }

  return DEFAULT_ERROR_MESSAGE;
};
