'use client';

import { Badge } from '@/components/ui/badge';

const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
} as const satisfies Record<string, string>;

type OrderStatus = keyof typeof ORDER_STATUS_LABELS;

const STATUS_VARIANTS = {
  PENDING: 'outline',
  CONFIRMED: 'secondary',
  PROCESSING: 'secondary',
  SHIPPED: 'default',
  DELIVERED: 'default',
  CANCELLED: 'destructive',
} as const satisfies Record<OrderStatus, string>;

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const variant = STATUS_VARIANTS[status];
  const label = ORDER_STATUS_LABELS[status];

  return (
    <Badge
      variant={variant}
      className={status === 'DELIVERED' ? 'bg-green-600 text-white' : undefined}
    >
      {label}
    </Badge>
  );
};

export { OrderStatusBadge, ORDER_STATUS_LABELS };
