import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

const Icon = () => {
  return new ImageResponse(
    <div
      style={{
        background: '#171717',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '80px',
      }}
    >
      <div
        style={{
          fontSize: 320,
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1,
        }}
      >
        E
      </div>
    </div>,
    { ...size },
  );
};

export default Icon;
