'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FunnelIcon, XIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { CategoryResponseDto } from '@/api/generated/types.gen';

type ProductFiltersProps = {
  categories: CategoryResponseDto[];
};

const ProductFilters = ({ categories }: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') ?? '';
  const currentMinPrice = searchParams.get('minPrice') ?? '';
  const currentMaxPrice = searchParams.get('maxPrice') ?? '';
  const currentFeatured = searchParams.get('isFeatured') ?? '';

  const hasActiveFilters =
    currentCategory || currentMinPrice || currentMaxPrice || currentFeatured;

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    if (search) params.set('search', search);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);

    router.push(`/products?${params.toString()}`);
  };

  const handlePriceSubmit = (
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());

    const minPrice = formData.get('minPrice') as string;
    const maxPrice = formData.get('maxPrice') as string;

    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');

    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className='space-y-6 rounded-lg border p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <FunnelIcon size={18} />
          <h2 className='font-semibold'>Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button variant='ghost' size='sm' onClick={handleClearAll}>
            <XIcon size={14} data-icon='inline-start' />
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      <div className='space-y-2'>
        <Label>Category</Label>
        <Select
          value={currentCategory}
          onValueChange={(value) =>
            updateParam('category', value === 'all' ? '' : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='All categories' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <form onSubmit={handlePriceSubmit} className='space-y-2'>
        <Label>Price range (PLN)</Label>
        <div className='flex items-center gap-2'>
          <Input
            name='minPrice'
            type='number'
            placeholder='Min'
            defaultValue={currentMinPrice}
            min={0}
            step='0.01'
          />
          <span className='text-muted-foreground'>–</span>
          <Input
            name='maxPrice'
            type='number'
            placeholder='Max'
            defaultValue={currentMaxPrice}
            min={0}
            step='0.01'
          />
        </div>
        <Button type='submit' variant='secondary' size='sm' className='w-full'>
          Apply price
        </Button>
      </form>

      <Separator />

      <div className='space-y-2'>
        <Label>Featured</Label>
        <Select
          value={currentFeatured}
          onValueChange={(value) =>
            updateParam('isFeatured', value === 'all' ? '' : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='All products' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All products</SelectItem>
            <SelectItem value='true'>Featured only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export { ProductFilters };
