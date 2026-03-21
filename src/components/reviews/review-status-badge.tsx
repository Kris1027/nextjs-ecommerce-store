'use client';

import type { ComponentProps } from 'react';
import { Badge } from '@/components/ui/badge';

const REVIEW_STATUS_LABELS = {
  PENDING: 'Pending Moderation',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
} as const satisfies Record<string, string>;

type ReviewStatus = keyof typeof REVIEW_STATUS_LABELS;

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

const STATUS_VARIANTS = {
  PENDING: 'outline',
  APPROVED: 'default',
  REJECTED: 'destructive',
} as const satisfies Record<ReviewStatus, BadgeVariant>;

type ReviewStatusBadgeProps = {
  status: ReviewStatus;
};

const ReviewStatusBadge = ({ status }: ReviewStatusBadgeProps) => {
  if (status === 'APPROVED') return null;

  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {REVIEW_STATUS_LABELS[status]}
    </Badge>
  );
};

export { ReviewStatusBadge };
