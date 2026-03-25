import { blurDataUrl } from '@/lib/image';

describe('blurDataUrl', () => {
  it('should return a base64 data URI with svg+xml mime type', () => {
    const result = blurDataUrl();
    expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it('should contain the requested dimensions in the SVG', () => {
    const result = blurDataUrl(200, 150);
    const base64 = result.replace('data:image/svg+xml;base64,', '');
    const svg = Buffer.from(base64, 'base64').toString('utf-8');

    expect(svg).toContain('width="200"');
    expect(svg).toContain('height="150"');
  });

  it('should use default dimensions of 400x400', () => {
    const result = blurDataUrl();
    const base64 = result.replace('data:image/svg+xml;base64,', '');
    const svg = Buffer.from(base64, 'base64').toString('utf-8');

    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="400"');
  });

  it('should return cached result for the same dimensions', () => {
    const first = blurDataUrl(300, 300);
    const second = blurDataUrl(300, 300);

    expect(first).toBe(second);
  });

  it('should return different results for different dimensions', () => {
    const square = blurDataUrl(400, 400);
    const landscape = blurDataUrl(400, 300);

    expect(square).not.toBe(landscape);
  });
});
