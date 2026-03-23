import { render, screen } from '@/test/test-utils';
import { ProductCard } from '@/components/products/product-card';
import type { ProductListItemDto } from '@/api/generated/types.gen';

const mockMutate = vi.fn();
const mockUseCart = vi.fn();

vi.mock('@/hooks/use-cart', () => ({
  useCart: () => mockUseCart(),
}));

vi.mock('next/image', async () => {
  const { createElement } = await import('react');
  return {
    default: (props: { src: string; alt: string }) =>
      createElement('img', { src: props.src, alt: props.alt }),
  };
});

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

const createProduct = (
  overrides?: Partial<ProductListItemDto>,
): ProductListItemDto =>
  ({
    id: 'prod-1',
    name: 'Test Sneakers',
    slug: 'test-sneakers',
    price: '199.99',
    comparePrice: null,
    stock: 10,
    images: [{ url: 'https://example.com/shoe.jpg', alt: 'Sneaker image' }],
    category: { id: 'cat-1', name: 'Footwear' },
    ...overrides,
  }) as ProductListItemDto;

describe('ProductCard', () => {
  beforeEach(() => {
    mockMutate.mockClear();
    mockUseCart.mockReturnValue({
      addItem: { mutate: mockMutate, isPending: false },
    });
  });

  it('should display product name', () => {
    render(<ProductCard product={createProduct()} />);
    expect(screen.getByText('Test Sneakers')).toBeInTheDocument();
  });

  it('should display formatted price', () => {
    render(<ProductCard product={createProduct()} />);
    expect(screen.getByText(/199,99/)).toBeInTheDocument();
  });

  it('should display category name', () => {
    render(<ProductCard product={createProduct()} />);
    expect(screen.getByText('Footwear')).toBeInTheDocument();
  });

  it('should link to product detail page', () => {
    render(<ProductCard product={createProduct()} />);
    const links = screen.getAllByRole('link');
    const productLinks = links.filter(
      (link) => link.getAttribute('href') === '/products/test-sneakers',
    );
    expect(productLinks.length).toBeGreaterThan(0);
  });

  it('should show "Out of Stock" when stock is 0', () => {
    render(<ProductCard product={createProduct({ stock: 0 })} />);
    expect(
      screen.getByRole('button', { name: /out of stock/i }),
    ).toBeInTheDocument();
  });

  it('should show "Add to Cart" when in stock', () => {
    render(<ProductCard product={createProduct()} />);
    expect(
      screen.getByRole('button', { name: /add to cart/i }),
    ).toBeInTheDocument();
  });

  it('should disable button when out of stock', () => {
    render(<ProductCard product={createProduct({ stock: 0 })} />);
    expect(
      screen.getByRole('button', { name: /out of stock/i }),
    ).toBeDisabled();
  });

  it('should show sale badge when comparePrice exists', () => {
    render(
      <ProductCard
        product={createProduct({ comparePrice: '299.99' as never })}
      />,
    );
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('should not show sale badge when no comparePrice', () => {
    render(<ProductCard product={createProduct()} />);
    expect(screen.queryByText('Sale')).not.toBeInTheDocument();
  });

  it('should show "No image" placeholder when no images', () => {
    render(<ProductCard product={createProduct({ images: [] })} />);
    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('should call addItem.mutate on click', async () => {
    const { userEvent } = await import('@/test/test-utils');
    const user = userEvent.setup();

    render(<ProductCard product={createProduct()} />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mockMutate).toHaveBeenCalledWith({ productId: 'prod-1' });
  });
});
