'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartIcon } from '@phosphor-icons/react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { blurDataUrl } from '@/lib/image';
import { useCart } from '@/hooks/use-cart';
import type { ProductListItemDto } from '@/api/generated/types.gen';

type ProductCardProps = {
  product: ProductListItemDto;
  priority?: boolean;
};

const ProductCard = ({ product, priority = false }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    addItem.mutate({ productId: product.id });
  };

  const imageUrl = product.images[0]?.url;
  const imageAlt = product.images[0]?.alt ?? product.name;
  const comparePrice = product.comparePrice;

  return (
    <Card className='group overflow-hidden'>
      <Link href={`/products/${product.slug}`} className='block'>
        <div className='relative aspect-square overflow-hidden bg-muted'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes='(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw'
              priority={priority}
              placeholder='blur'
              blurDataURL={blurDataUrl()}
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
          <ShoppingCartIcon size={14} data-icon='inline-start' />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ProductCard };
