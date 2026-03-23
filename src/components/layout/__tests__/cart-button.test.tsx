import { render, screen } from '@/test/test-utils';
import { CartButton } from '@/components/layout/cart-button';

const mockUseCart = vi.fn();

vi.mock('@/hooks/use-cart', () => ({
  useCart: () => mockUseCart(),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children?: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('CartButton', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({ totalItems: 0 });
  });

  it('should render a link to /cart', () => {
    render(<CartButton />);
    const button = screen.getByRole('button', { name: /shopping cart/i });
    expect(button).toHaveAttribute('href', '/cart');
  });

  it('should show no badge when cart is empty', () => {
    render(<CartButton />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should show item count badge when items exist', () => {
    mockUseCart.mockReturnValue({ totalItems: 5 });
    render(<CartButton />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should show "99+" when count exceeds 99', () => {
    mockUseCart.mockReturnValue({ totalItems: 150 });
    render(<CartButton />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should include item count in aria-label when items exist', () => {
    mockUseCart.mockReturnValue({ totalItems: 3 });
    render(<CartButton />);
    expect(screen.getByLabelText('Shopping cart, 3 items')).toBeInTheDocument();
  });

  it('should have generic aria-label when cart is empty', () => {
    render(<CartButton />);
    expect(screen.getByLabelText('Shopping cart')).toBeInTheDocument();
  });
});
