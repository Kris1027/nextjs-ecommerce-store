'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_TYPE_LABELS,
} from '@/components/notifications/notification-utils';

const NotificationTypeFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get('type') ?? '';

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === 'all') {
      params.delete('type');
    } else {
      params.set('type', value);
    }

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentType || 'all'} onValueChange={handleChange}>
      <SelectTrigger className='w-48' aria-label='Notification type'>
        <SelectValue placeholder='All types' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All types</SelectItem>
        {NOTIFICATION_CATEGORIES.map((category) =>
          category.types.map((type) => (
            <SelectItem key={type} value={type}>
              {NOTIFICATION_TYPE_LABELS[type]}
            </SelectItem>
          )),
        )}
      </SelectContent>
    </Select>
  );
};

export { NotificationTypeFilter };
