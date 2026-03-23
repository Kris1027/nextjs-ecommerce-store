import { render, screen } from '@/test/test-utils';
import { StarRating } from '@/components/reviews/star-rating';

describe('StarRating', () => {
  it('should render with correct aria-label for rating of 5', () => {
    render(<StarRating rating={5} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      '5 out of 5 stars',
    );
  });

  it('should render with correct aria-label for rating of 3.5', () => {
    render(<StarRating rating={3.5} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      '3.5 out of 5 stars',
    );
  });

  it('should clamp rating above 5 to 5', () => {
    render(<StarRating rating={7} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      '5 out of 5 stars',
    );
  });

  it('should clamp rating below 0 to 0', () => {
    render(<StarRating rating={-2} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      '0 out of 5 stars',
    );
  });

  it('should round rating to nearest half', () => {
    render(<StarRating rating={3.3} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      '3.5 out of 5 stars',
    );
  });
});
