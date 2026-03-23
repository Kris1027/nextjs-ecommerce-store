import { render, screen } from '@/test/test-utils';
import { ReviewCard } from '@/components/reviews/review-card';
import type { ReviewDto } from '@/api/generated/types.gen';

vi.mock('@/components/reviews/review-actions', () => ({
  ReviewActions: () => <div data-testid='review-actions'>Actions</div>,
}));

const createReview = (overrides?: Partial<ReviewDto>): ReviewDto =>
  ({
    id: 'review-1',
    rating: 4,
    title: 'Great product',
    comment: 'Really enjoyed using this product.',
    status: 'APPROVED',
    createdAt: '2026-01-15T12:00:00Z',
    user: {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
    },
    ...overrides,
  }) as ReviewDto;

describe('ReviewCard', () => {
  it('should display the review comment', () => {
    render(
      <ReviewCard review={createReview()} isOwn={false} productId='prod-1' />,
    );
    expect(
      screen.getByText('Really enjoyed using this product.'),
    ).toBeInTheDocument();
  });

  it('should display the author name from firstName and lastName', () => {
    render(
      <ReviewCard review={createReview()} isOwn={false} productId='prod-1' />,
    );
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it('should display "Anonymous" when user has no name', () => {
    render(
      <ReviewCard
        review={createReview({
          user: { id: 'user-2' } as ReviewDto['user'],
        })}
        isOwn={false}
        productId='prod-1'
      />,
    );
    expect(screen.getByText(/Anonymous/)).toBeInTheDocument();
  });

  it('should display the formatted date', () => {
    render(
      <ReviewCard review={createReview()} isOwn={false} productId='prod-1' />,
    );
    expect(screen.getByText(/January 15, 2026/)).toBeInTheDocument();
  });

  it('should display the title when provided', () => {
    render(
      <ReviewCard review={createReview()} isOwn={false} productId='prod-1' />,
    );
    expect(screen.getByText('Great product')).toBeInTheDocument();
  });

  it('should not render title element when title is undefined', () => {
    render(
      <ReviewCard
        review={createReview({ title: undefined as never })}
        isOwn={false}
        productId='prod-1'
      />,
    );
    expect(screen.queryByText('Great product')).not.toBeInTheDocument();
  });

  it('should show review actions when isOwn is true', () => {
    render(
      <ReviewCard review={createReview()} isOwn={true} productId='prod-1' />,
    );
    expect(screen.getByTestId('review-actions')).toBeInTheDocument();
  });

  it('should not show review actions when isOwn is false', () => {
    render(
      <ReviewCard review={createReview()} isOwn={false} productId='prod-1' />,
    );
    expect(screen.queryByTestId('review-actions')).not.toBeInTheDocument();
  });

  it('should show star rating', () => {
    render(
      <ReviewCard review={createReview()} isOwn={false} productId='prod-1' />,
    );
    expect(
      screen.getByRole('img', { name: /4 out of 5 stars/ }),
    ).toBeInTheDocument();
  });
});
