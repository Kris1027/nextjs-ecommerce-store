import { ImageResponse } from 'next/og';
import { STORE_NAME, STORE_DESCRIPTION } from '@/lib/constants';

export const alt = STORE_NAME;

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = 'image/png';

const TwitterImage = () => {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        gap: '24px',
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {STORE_NAME}
      </div>
      <div
        style={{
          fontSize: 28,
          color: '#a3a3a3',
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: '800px',
        }}
      >
        {STORE_DESCRIPTION}
      </div>
    </div>,
    { ...size },
  );
};

export default TwitterImage;
