import { cn } from '@/lib/utils';

describe('cn', () => {
  it('should merge multiple class strings', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes via objects', () => {
    expect(cn('base', { 'text-red-500': true, 'text-blue-500': false })).toBe(
      'base text-red-500',
    );
  });

  it('should resolve tailwind conflicts by keeping the last class', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle undefined, null, and false inputs gracefully', () => {
    expect(cn('base', undefined, null, false)).toBe('base');
  });

  it('should return empty string when no arguments given', () => {
    expect(cn()).toBe('');
  });
});
