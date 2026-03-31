import { ImageResponse } from 'next/og';
import { productsControllerFindBySlug } from '@/api/generated/sdk.gen';
import { STORE_NAME } from '@/lib/constants';
import '@/api/client';

export const alt = 'Product image';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

type Props = {
  params: Promise<{ slug: string }>;
};

const ProductOpengraphImage = async ({ params }: Props) => {
  const { slug } = await params;
  const response = await productsControllerFindBySlug({
    path: { slug },
  }).catch(() => null);

  const product = response?.data?.data;

  if (!product) {
    return new ImageResponse(
      <div
        style={{
          background: '#171717',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: 48,
        }}
      >
        Product Not Found
      </div>,
      { ...size },
    );
  }

  const imageUrl = product.images[0]?.url;
  const price = Number(product.price);
  const formattedPrice = Number.isFinite(price)
    ? `${price.toFixed(2)} PLN`
    : '';
  const hasDiscount =
    product.comparePrice !== undefined && product.comparePrice !== null;
  const comparePrice = hasDiscount ? Number(product.comparePrice) : null;
  const formattedComparePrice =
    comparePrice !== null && Number.isFinite(comparePrice)
      ? `${comparePrice.toFixed(2)} PLN`
      : '';

  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: '60px',
        gap: '60px',
      }}
    >
      {imageUrl && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '400px',
            height: '100%',
            flexShrink: 0,
          }}
        >
          <img
            src={imageUrl}
            alt={product.name}
            width={400}
            height={400}
            style={{
              objectFit: 'contain',
              borderRadius: '16px',
            }}
          />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          gap: '20px',
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: '#a3a3a3',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {product.category.name}
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
          }}
        >
          {product.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: hasDiscount ? '#ef4444' : '#ffffff',
            }}
          >
            {formattedPrice}
          </div>
          {hasDiscount && formattedComparePrice && (
            <div
              style={{
                fontSize: 28,
                color: '#6b7280',
                textDecoration: 'line-through',
              }}
            >
              {formattedComparePrice}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#525252',
            marginTop: 'auto',
          }}
        >
          {STORE_NAME}
        </div>
      </div>
    </div>,
    { ...size },
  );
};

export default ProductOpengraphImage;
