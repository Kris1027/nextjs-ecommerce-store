import { reviewSchema } from '@/schemas/review.schemas';

describe('reviewSchema', () => {
  const validData = {
    rating: 4,
    comment: 'This is a great product that I love!',
  };

  it('should pass with valid rating and comment', () => {
    const result = reviewSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should pass with optional title provided', () => {
    const result = reviewSchema.safeParse({
      ...validData,
      title: 'Great product',
    });
    expect(result.success).toBe(true);
  });

  it('should pass when title is empty string (treated as undefined)', () => {
    const result = reviewSchema.safeParse({ ...validData, title: '' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBeUndefined();
    }
  });

  it('should pass when title is whitespace only (treated as undefined)', () => {
    const result = reviewSchema.safeParse({ ...validData, title: '   ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBeUndefined();
    }
  });

  it('should fail when rating is 0', () => {
    const result = reviewSchema.safeParse({ ...validData, rating: 0 });
    expect(result.success).toBe(false);
  });

  it('should fail when rating exceeds 5', () => {
    const result = reviewSchema.safeParse({ ...validData, rating: 6 });
    expect(result.success).toBe(false);
  });

  it('should fail when rating is not integer', () => {
    const result = reviewSchema.safeParse({ ...validData, rating: 3.5 });
    expect(result.success).toBe(false);
  });

  it('should fail when comment is shorter than 10 characters', () => {
    const result = reviewSchema.safeParse({ ...validData, comment: 'Short' });
    expect(result.success).toBe(false);
  });

  it('should fail when comment exceeds 2000 characters', () => {
    const result = reviewSchema.safeParse({
      ...validData,
      comment: 'a'.repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it('should fail when title is 1-2 characters (too short but not empty)', () => {
    const result = reviewSchema.safeParse({ ...validData, title: 'Hi' });
    expect(result.success).toBe(false);
  });
});
