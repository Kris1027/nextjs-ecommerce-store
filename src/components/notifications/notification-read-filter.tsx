'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NotificationReadFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentValue = searchParams.get('isRead') ?? '';

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === 'all') {
      params.delete('isRead');
    } else {
      params.set('isRead', value);
    }

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentValue || 'all'} onValueChange={handleChange}>
      <SelectTrigger className='w-32'>
        <SelectValue placeholder='All' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All</SelectItem>
        <SelectItem value='false'>Unread</SelectItem>
        <SelectItem value='true'>Read</SelectItem>
      </SelectContent>
    </Select>
  );
};

export { NotificationReadFilter };
