'use client';

import { TooltipProvider } from '@/components/ui/tooltip';

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

export { Providers };
