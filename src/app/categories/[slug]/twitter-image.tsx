import { ImageResponse } from 'next/og';
import { categoriesControllerFindBySlug } from '@/api/generated/sdk.gen';
import { STORE_NAME } from '@/lib/constants';
import '@/api/client';

export const alt = 'Category image';

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = 'image/png';

type Props = {
  params: Promise<{ slug: string }>;
};

const CategoryTwitterImage = async ({ params }: Props) => {
  const { slug } = await params;
  const response = await categoriesControllerFindBySlug({
    path: { slug },
  }).catch(() => null);

  const category = response?.data?.data;

  if (!category) {
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
        Category Not Found
      </div>,
      { ...size },
    );
  }

  const imageUrl =
    typeof category.imageUrl === 'string' ? category.imageUrl : null;
  const description =
    typeof category.description === 'string' ? category.description : null;

  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: '48px',
        gap: '48px',
      }}
    >
      {imageUrl && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '380px',
            height: '100%',
            flexShrink: 0,
          }}
        >
          <img
            src={imageUrl}
            alt={category.name}
            width={380}
            height={380}
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
          gap: '16px',
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: '#a3a3a3',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Category
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
          }}
        >
          {category.name}
        </div>
        {description && (
          <div
            style={{
              fontSize: 22,
              color: '#a3a3a3',
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        )}
        <div
          style={{
            fontSize: 16,
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

export default CategoryTwitterImage;
