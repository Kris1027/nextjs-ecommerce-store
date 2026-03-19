'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCartIcon } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/format';
import { useGuestCart } from '@/hooks/use-guest-cart';
import type { ProductDetailDto } from '@/api/generated/types.gen';

type ProductDetailProps = {
  product: ProductDetailDto;
};

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useGuestCart();

  const handleAddToCart = () => {
    addItem.mutate({ productId: product.id, quantity });
  };

  const images = product.images ?? [];
  const selectedImage = images[selectedImageIndex];
  const comparePrice = product.comparePrice as unknown as string | null;
  const description =
    typeof product.description === 'string' ? product.description : null;
  const sku = typeof product.sku === 'string' ? product.sku : null;

  const stockStatus =
    product.stock === 0
      ? 'Out of Stock'
      : product.stock <= 5
        ? 'Low Stock'
        : 'In Stock';

  const stockColor =
    product.stock === 0
      ? 'destructive'
      : product.stock <= 5
        ? 'outline'
        : 'secondary';

  return (
    <div className='grid gap-8 md:grid-cols-2'>
      <div className='space-y-4'>
        <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
          {selectedImage ? (
            <Image
              src={selectedImage.url}
              alt={
                (selectedImage.alt as unknown as string | null) ?? product.name
              }
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              className='object-cover'
              priority
            />
          ) : (
            <div className='flex h-full items-center justify-center text-muted-foreground'>
              No image
            </div>
          )}
          {comparePrice && (
            <Badge className='absolute left-3 top-3' variant='destructive'>
              Sale
            </Badge>
          )}
        </div>

        {images.length > 1 && (
          <div className='flex gap-2 overflow-x-auto'>
            {images.map((image, index) => (
              <button
                key={image.id}
                type='button'
                aria-label={`View image ${index + 1}`}
                aria-pressed={index === selectedImageIndex}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 ${
                  index === selectedImageIndex
                    ? 'border-primary'
                    : 'border-transparent'
                }`}
              >
                <Image
                  src={image.url}
                  alt={(image.alt as unknown as string | null) ?? product.name}
                  fill
                  sizes='80px'
                  className='object-cover'
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          {sku && <p className='text-sm text-muted-foreground'>SKU: {sku}</p>}
        </div>

        <div className='flex items-center gap-3'>
          <span className='text-3xl font-bold'>
            {formatPrice(product.price)}
          </span>
          {comparePrice && (
            <span className='text-lg text-muted-foreground line-through'>
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>

        <Badge variant={stockColor as 'destructive' | 'outline' | 'secondary'}>
          {stockStatus}
        </Badge>

        <Separator />

        {description && (
          <div className='space-y-2'>
            <h2 className='font-semibold'>Description</h2>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              {description}
            </p>
          </div>
        )}

        <Separator />

        <div className='flex items-center gap-4'>
          <div className='flex items-center rounded-md border'>
            <Button
              variant='ghost'
              size='icon'
              aria-label='Decrease quantity'
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => q - 1)}
            >
              -
            </Button>
            <span className='w-12 text-center text-sm font-medium'>
              {quantity}
            </span>
            <Button
              variant='ghost'
              size='icon'
              aria-label='Increase quantity'
              disabled={quantity >= product.stock}
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </Button>
          </div>

          <Button
            size='lg'
            className='flex-1'
            disabled={product.stock === 0 || addItem.isPending}
            onClick={handleAddToCart}
          >
            <ShoppingCartIcon size={18} data-icon='inline-start' />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ProductDetail };
