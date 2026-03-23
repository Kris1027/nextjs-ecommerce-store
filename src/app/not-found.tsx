import Link from 'next/link';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center'>
      <div className='space-y-2'>
        <p className='text-7xl font-bold text-muted-foreground'>404</p>
        <h1 className='text-2xl font-bold'>Page Not Found</h1>
        <p className='text-sm text-muted-foreground'>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className='flex gap-3'>
        <Button nativeButton={false} render={<Link href='/search' />}>
          <MagnifyingGlassIcon size={16} data-icon='inline-start' />
          Search Products
        </Button>
        <Button
          variant='outline'
          nativeButton={false}
          render={<Link href='/' />}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
