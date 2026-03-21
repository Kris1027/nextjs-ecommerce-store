'use client';

import { useState } from 'react';
import { StarIcon } from '@phosphor-icons/react';

type StarRatingInputProps = {
  value: number;
  onChange: (rating: number) => void;
};

const StarRatingInput = ({ value, onChange }: StarRatingInputProps) => {
  const [hoveredStar, setHoveredStar] = useState(0);

  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          className='cursor-pointer p-0.5 transition-transform hover:scale-110'
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
          onClick={() => onChange(star)}
        >
          <StarIcon
            size={28}
            weight={star <= (hoveredStar || value) ? 'fill' : 'regular'}
            className={
              star <= (hoveredStar || value)
                ? 'text-yellow-500'
                : 'text-muted-foreground'
            }
          />
        </button>
      ))}
    </div>
  );
};

export { StarRatingInput };
