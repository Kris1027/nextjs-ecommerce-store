'use client';

import { StarIcon, StarHalfIcon } from '@phosphor-icons/react';

type StarRatingProps = {
  rating: number;
  size?: number;
};

const StarRating = ({ rating, size = 16 }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      role='img'
      className='flex items-center gap-0.5'
      aria-label={`${rating} out of 5 stars`}
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
