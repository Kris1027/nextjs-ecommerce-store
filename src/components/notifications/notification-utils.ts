import type { ComponentType } from 'react';
import {
  PackageIcon,
  CreditCardIcon,
  ArrowCounterClockwiseIcon,
  UserIcon,
} from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import type { NotificationDto } from '@/api/generated/types.gen';

type NotificationType = NotificationDto['type'];

const NOTIFICATION_TYPE_LABELS = {
  ORDER_CREATED: 'Order Created',
  ORDER_CONFIRMED: 'Order Confirmed',
  ORDER_SHIPPED: 'Order Shipped',
  ORDER_DELIVERED: 'Order Delivered',
  ORDER_CANCELLED: 'Order Cancelled',
  PAYMENT_SUCCEEDED: 'Payment Succeeded',
  PAYMENT_FAILED: 'Payment Failed',
  REFUND_INITIATED: 'Refund Initiated',
  REFUND_COMPLETED: 'Refund Completed',
  REFUND_FAILED: 'Refund Failed',
  LOW_STOCK: 'Low Stock',
  WELCOME: 'Welcome',
  PASSWORD_CHANGED: 'Password Changed',
} as const satisfies Record<NotificationType, string>;

const NOTIFICATION_CATEGORIES = [
  {
    label: 'Orders',
    types: [
      'ORDER_CREATED',
      'ORDER_CONFIRMED',
      'ORDER_SHIPPED',
      'ORDER_DELIVERED',
      'ORDER_CANCELLED',
    ],
  },
  {
    label: 'Payments',
    types: ['PAYMENT_SUCCEEDED', 'PAYMENT_FAILED'],
  },
  {
    label: 'Refunds',
    types: ['REFUND_INITIATED', 'REFUND_COMPLETED', 'REFUND_FAILED'],
  },
  {
    label: 'Stock',
    types: ['LOW_STOCK'],
  },
  {
    label: 'Account',
    types: ['WELCOME', 'PASSWORD_CHANGED'],
  },
] as const satisfies ReadonlyArray<{
  label: string;
  types: readonly NotificationType[];
}>;

const NOTIFICATION_ICON_MAP: Record<
  NotificationType,
  ComponentType<IconProps>
> = {
  ORDER_CREATED: PackageIcon,
  ORDER_CONFIRMED: PackageIcon,
  ORDER_SHIPPED: PackageIcon,
  ORDER_DELIVERED: PackageIcon,
  ORDER_CANCELLED: PackageIcon,
  PAYMENT_SUCCEEDED: CreditCardIcon,
  PAYMENT_FAILED: CreditCardIcon,
  REFUND_INITIATED: ArrowCounterClockwiseIcon,
  REFUND_COMPLETED: ArrowCounterClockwiseIcon,
  REFUND_FAILED: ArrowCounterClockwiseIcon,
  LOW_STOCK: PackageIcon,
  WELCOME: UserIcon,
  PASSWORD_CHANGED: UserIcon,
};

const getNotificationHref = (notification: NotificationDto): string | null => {
  const { type, referenceId } = notification;
  const orderId =
    referenceId && typeof referenceId === 'object'
      ? (referenceId as Record<string, unknown>).orderId
      : undefined;

  if (
    orderId &&
    typeof orderId === 'string' &&
    (type.startsWith('ORDER_') ||
      type.startsWith('PAYMENT_') ||
      type.startsWith('REFUND_'))
  ) {
    return `/account/orders/${orderId}`;
  }

  if (type === 'PASSWORD_CHANGED') return '/account/change-password';
  if (type === 'WELCOME') return '/account';

  return null;
};

const formatRelativeTime = (dateString: string): string => {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

export {
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_ICON_MAP,
  getNotificationHref,
  formatRelativeTime,
};

export type { NotificationType };
