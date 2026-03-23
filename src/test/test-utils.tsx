import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

type AllProvidersProps = {
  children: ReactNode;
};

const AllProviders = ({ children }: AllProvidersProps) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render, userEvent };
