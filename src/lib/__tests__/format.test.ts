import { formatPrice } from '@/lib/format';

describe('formatPrice', () => {
  it('should format a valid price string as PLN currency', () => {
    const result = formatPrice('29.99');
    expect(result).toContain('29,99');
    expect(result).toContain('zł');
  });

  it('should format zero as PLN currency', () => {
    const result = formatPrice('0');
    expect(result).toContain('0,00');
    expect(result).toContain('zł');
  });

  it('should format large numbers with proper grouping', () => {
    const result = formatPrice('1234.56');
    expect(result).toContain('1');
    expect(result).toContain('234,56');
    expect(result).toContain('zł');
  });

  it('should return em dash for non-numeric strings', () => {
    expect(formatPrice('abc')).toBe('—');
  });

  it('should format empty string as zero PLN', () => {
    const result = formatPrice('');
    expect(result).toContain('0,00');
    expect(result).toContain('zł');
  });

  it('should return em dash for Infinity', () => {
    expect(formatPrice('Infinity')).toBe('—');
  });
});
