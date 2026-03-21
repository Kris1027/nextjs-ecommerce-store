'use client';

import type { KeyboardEvent } from 'react';
import { useState } from 'react';
import { StarIcon } from '@phosphor-icons/react';

type StarRatingInputProps = {
  value: number;
  onChange: (rating: number) => void;
};

const StarRatingInput = ({ value, onChange }: StarRatingInputProps) => {
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleKeyDown = (e: KeyboardEvent, star: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = star < 5 ? star + 1 : 1;
      onChange(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = star > 1 ? star - 1 : 5;
      onChange(prev);
    }
  };

  const focusedStar = value || 1;

  return (
    <div
      role='radiogroup'
      aria-label='Rating'
      className='flex items-center gap-1'
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          role='radio'
          aria-checked={star === value}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          tabIndex={star === focusedStar ? 0 : -1}
          className='cursor-pointer p-0.5 transition-transform hover:scale-110'
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
          onClick={() => onChange(star)}
          onKeyDown={(e) => handleKeyDown(e, star)}
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
