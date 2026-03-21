'use client';

import { StarIcon, StarHalfIcon } from '@phosphor-icons/react';

type StarRatingProps = {
  rating: number;
  size?: number;
};

const StarRating = ({ rating, size = 16 }: StarRatingProps) => {
  const clamped = Math.min(5, Math.max(0, rating));
  const rounded = Math.round(clamped * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalfStar = rounded - fullStars === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      role='img'
      className='flex items-center gap-0.5'
      aria-label={`${rounded} out of 5 stars`}
    >
      {Array.from({ length: fullStars }, (_, i) => (
        <StarIcon
          key={`full-${i}`}
          size={size}
          weight='fill'
          className='text-yellow-500'
        />
      ))}
      {hasHalfStar && (
        <StarHalfIcon
          key='half'
          size={size}
          weight='fill'
          className='text-yellow-500'
        />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <StarIcon
          key={`empty-${i}`}
          size={size}
          className='text-muted-foreground'
        />
      ))}
    </div>
  );
};

export { StarRating };
