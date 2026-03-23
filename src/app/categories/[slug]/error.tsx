'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { WarningCircleIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const CategoryErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center'>
      <WarningCircleIcon size={64} className='text-destructive' />
      <div className='space-y-2'>
        <h1 className='text-2xl font-bold'>Could not load this category</h1>
        <p className='text-sm text-muted-foreground'>
          Something went wrong while loading the category. Please try again.
        </p>
      </div>
      <div className='flex gap-3'>
        <Button onClick={reset}>Try Again</Button>
        <Button
          variant='outline'
          nativeButton={false}
          render={<Link href='/categories' />}
        >
          Browse All Categories
        </Button>
      </div>
    </div>
  );
};

export default CategoryErrorPage;
