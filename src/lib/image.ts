const shimmer = (width: number, height: number): string => `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#e2e8f0" offset="20%" />
      <stop stop-color="#f1f5f9" offset="50%" />
      <stop stop-color="#e2e8f0" offset="80%" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#e2e8f0" />
  <rect width="${width}" height="${height}" fill="url(#g)">
    <animate attributeName="x" from="-${width}" to="${width}" dur="1.5s" repeatCount="indefinite" />
  </rect>
</svg>`;

const toBase64 = (str: string): string =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

const blurDataUrl = (width = 400, height = 400): string =>
  `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;

export { blurDataUrl };
