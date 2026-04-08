'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ORDER_STATUS_LABELS } from '@/components/orders/order-status-badge';

const OrderStatusFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get('status') ?? '';

  const handleStatusChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === 'all') {
      params.delete('status');
    } else {
      params.set('status', value);
    }

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentStatus || 'all'} onValueChange={handleStatusChange}>
      <SelectTrigger className='w-48' aria-label='Order status'>
        <SelectValue placeholder='All orders' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All orders</SelectItem>
        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { OrderStatusFilter };
