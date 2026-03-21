'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ReviewFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRating = searchParams.get('rating');

  const handleFilter = (rating: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!rating) {
      params.delete('rating');
    } else {
      params.set('rating', rating);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='flex flex-wrap gap-2'>
      <Button
        variant={!currentRating ? 'default' : 'outline'}
        size='sm'
        onClick={() => handleFilter(null)}
      >
        All
      </Button>
      {[5, 4, 3, 2, 1].map((star) => (
        <Button
          key={star}
          variant={currentRating === String(star) ? 'default' : 'outline'}
          size='sm'
          onClick={() => handleFilter(String(star))}
        >
          {star} star{star !== 1 ? 's' : ''}
        </Button>
      ))}
    </div>
  );
};

export { ReviewFilters };
