'use client';

import Link from 'next/link';
import type { OrderListDto } from '@/api/generated/types.gen';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';

type OrderListCardProps = {
  order: OrderListDto;
};

const OrderListCard = ({ order }: OrderListCardProps) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/account/orders/${order.id}`}>
      <Card className='flex items-center justify-between p-4 transition-colors hover:bg-muted/50'>
        <div className='space-y-1'>
          <p className='font-medium'>Order #{order.orderNumber}</p>
          <p className='text-muted-foreground text-sm'>{formattedDate}</p>
        </div>
        <div className='flex items-center gap-4'>
          <p className='font-medium'>{formatPrice(order.total)}</p>
          <OrderStatusBadge status={order.status} />
          {order.status === 'PENDING' && (
            <Badge
              variant='outline'
              className='border-amber-500 text-amber-600'
            >
              Awaiting Payment
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
};

export { OrderListCard };
