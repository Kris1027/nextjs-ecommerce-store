'use client';

import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { ORDER_STATUS_LABELS } from '@/components/orders/order-status-badge';

const TIMELINE_STEPS = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
] as const;

type OrderStatusTimelineProps = {
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';
};

const OrderStatusTimeline = ({ status }: OrderStatusTimelineProps) => {
  if (status === 'CANCELLED') {
    return (
      <div className='flex items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4'>
        <XIcon weight='bold' className='h-5 w-5 text-destructive' />
        <p className='font-medium text-destructive'>Order cancelled</p>
      </div>
    );
  }

  const currentIndex = TIMELINE_STEPS.indexOf(status);

  return (
    <div className='flex items-center justify-between'>
      {TIMELINE_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={step} className='flex flex-1 items-center'>
            <div className='flex flex-col items-center gap-1'>
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive &&
                    'bg-primary text-primary-foreground ring-2 ring-primary/30',
                  isFuture && 'bg-muted text-muted-foreground',
                )}
              >
                {isCompleted ? (
                  <CheckIcon weight='bold' className='h-4 w-4' />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'text-xs',
                  isActive && 'font-medium',
                  isFuture && 'text-muted-foreground',
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {index < TIMELINE_STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-0.5 flex-1',
                  index < currentIndex ? 'bg-primary' : 'bg-muted',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export { OrderStatusTimeline };
