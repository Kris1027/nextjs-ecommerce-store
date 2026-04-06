import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className='bg-muted/40 py-20 sm:py-32'>
      <div className='mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
        <h1 className='font-bold tracking-tight text-[clamp(2.25rem,1.5rem+3.75vw,3.75rem)]'>
          Discover Quality Products
        </h1>
        <p className='mx-auto mt-4 max-w-2xl text-[clamp(1rem,0.875rem+0.625vw,1.125rem)] text-muted-foreground'>
          Shop our curated collection of premium products at great prices. Free
          shipping on orders over 200 PLN.
        </p>
        <div className='mt-8 flex justify-center gap-4'>
          <Button
            size='lg'
            nativeButton={false}
            render={<Link href='/products' />}
          >
            Shop Now
            <ArrowRightIcon size={16} data-icon='inline-end' />
          </Button>
          <Button
            size='lg'
            variant='outline'
            nativeButton={false}
            render={<Link href='/categories' />}
          >
            Browse Categories
          </Button>
        </div>
      </div>
    </section>
  );
};

export { HeroSection };
