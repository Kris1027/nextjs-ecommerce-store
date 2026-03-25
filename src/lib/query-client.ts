import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error';

const isRateLimitError = (error: unknown): boolean => {
  if (error instanceof Response) return error.status === 429;
  if (error instanceof Error && 'status' in error) {
    return (error as Error & { status: number }).status === 429;
  }
  return false;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (isRateLimitError(error)) return failureCount < 3;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex, error) => {
        if (isRateLimitError(error)) {
          return Math.min(2000 * 2 ** attemptIndex, 10_000);
        }
        return Math.min(1000 * 2 ** attemptIndex, 5000);
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      onError: (error) => {
        if (isRateLimitError(error)) {
          toast.error('Too many requests. Please wait a moment and try again.');
          return;
        }
        toast.error(getErrorMessage(error));
      },
    },
  },
});
