'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from '@phosphor-icons/react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { useGuestCart } from '@/hooks/use-guest-cart';
import type { ProductListItemDto } from '@/api/generated/types.gen';

type ProductCardProps = {
  product: ProductListItemDto;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useGuestCart();

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    addItem.mutate({ productId: product.id });
  };

  const imageUrl = product.images[0]?.url;
  const imageAlt =
    (product.images[0]?.alt as unknown as string | null) ?? product.name;
  const comparePrice = product.comparePrice as unknown as string | null;

  return (
    <Card className='group overflow-hidden'>
      <Link href={`/products/${product.slug}`} className='block'>
        <div className='relative aspect-square overflow-hidden bg-muted'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
          ) : (
            <div className='flex h-full items-center justify-center text-muted-foreground'>
              No image
            </div>
          )}
          {comparePrice && (
            <Badge className='absolute left-2 top-2' variant='destructive'>
              Sale
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className='p-3'>
        <Badge variant='secondary' className='mb-1.5 text-xs'>
          {product.category.name}
        </Badge>
        <Link href={`/products/${product.slug}`}>
          <h3 className='line-clamp-1 text-sm font-medium transition-colors hover:text-primary'>
            {product.name}
          </h3>
        </Link>
        <div className='mt-1 flex items-center gap-2'>
          <span className='text-sm font-semibold'>
            {formatPrice(product.price)}
          </span>
          {comparePrice && (
            <span className='text-xs text-muted-foreground line-through'>
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className='p-3 pt-0'>
        <Button
          size='sm'
          className='w-full'
          disabled={product.stock === 0 || addItem.isPending}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={14} data-icon='inline-start' />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ProductCard };
