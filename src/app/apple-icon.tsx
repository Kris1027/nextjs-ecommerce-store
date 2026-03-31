import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

const AppleIcon = () => {
  return new ImageResponse(
    <div
      style={{
        background: '#171717',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '32px',
      }}
    >
      <div
        style={{
          fontSize: 110,
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

export default AppleIcon;
