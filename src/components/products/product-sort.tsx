'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'createdAt-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
  { label: 'Name: Z-A', value: 'name-desc' },
] as const;

const ProductSort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');
  const currentValue = sortBy && sortOrder ? `${sortBy}-${sortOrder}` : '';

  const handleSortChange = (value: string | null) => {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    const [newSortBy, newSortOrder] = value.split('-');

    params.set('sortBy', newSortBy);
    params.set('sortOrder', newSortOrder);
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='flex items-center justify-end gap-2'>
      <span className='text-sm text-muted-foreground'>Sort by</span>
      <Select value={currentValue} onValueChange={handleSortChange}>
        <SelectTrigger className='w-48'>
          <SelectValue placeholder='Select order' />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { ProductSort };
