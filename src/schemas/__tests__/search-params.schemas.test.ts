import {
  productsSearchParamsSchema,
  searchPageParamsSchema,
  categorySearchParamsSchema,
} from '@/schemas/search-params.schema';

describe('productsSearchParamsSchema', () => {
  it('should parse valid params', () => {
    const result = productsSearchParamsSchema.parse({
      page: '2',
      sortBy: 'price',
      sortOrder: 'asc',
      search: 'shoes',
    });

    expect(result.page).toBe(2);
    expect(result.sortBy).toBe('price');
    expect(result.sortOrder).toBe('asc');
    expect(result.search).toBe('shoes');
  });

  it('should default page to 1 when not provided', () => {
    const result = productsSearchParamsSchema.parse({});
    expect(result.page).toBe(1);
  });

  it('should reject invalid sortOrder', () => {
    expect(() =>
      productsSearchParamsSchema.parse({ sortOrder: 'invalid' }),
    ).toThrow();
  });

  it('should reject invalid price format', () => {
    expect(() =>
      productsSearchParamsSchema.parse({ minPrice: 'abc' }),
    ).toThrow();
  });

  it('should accept valid price format', () => {
    const result = productsSearchParamsSchema.parse({
      minPrice: '10.99',
      maxPrice: '100',
    });
    expect(result.minPrice).toBe('10.99');
    expect(result.maxPrice).toBe('100');
  });

  it('should reject invalid isFeatured values', () => {
    expect(() =>
      productsSearchParamsSchema.parse({ isFeatured: 'yes' }),
    ).toThrow();
  });

  it('should accept valid isFeatured values', () => {
    const result = productsSearchParamsSchema.parse({ isFeatured: 'true' });
    expect(result.isFeatured).toBe('true');
  });

  it('should reject search longer than 200 characters', () => {
    expect(() =>
      productsSearchParamsSchema.parse({ search: 'a'.repeat(201) }),
    ).toThrow();
  });

  it('should reject invalid UUID for category', () => {
    expect(() =>
      productsSearchParamsSchema.parse({ category: 'not-a-uuid' }),
    ).toThrow();
  });

  it('should accept valid UUID for category', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const result = productsSearchParamsSchema.parse({ category: uuid });
    expect(result.category).toBe(uuid);
  });

  it('should reject invalid sortBy values', () => {
    expect(() =>
      productsSearchParamsSchema.parse({ sortBy: 'malicious' }),
    ).toThrow();
  });

  it('should accept valid sortBy values', () => {
    for (const sortBy of ['createdAt', 'price', 'name']) {
      const result = productsSearchParamsSchema.parse({ sortBy });
      expect(result.sortBy).toBe(sortBy);
    }
  });
});

describe('searchPageParamsSchema', () => {
  it('should parse valid search params', () => {
    const result = searchPageParamsSchema.parse({
      q: 'test query',
      page: '3',
      sortOrder: 'desc',
    });

    expect(result.q).toBe('test query');
    expect(result.page).toBe(3);
    expect(result.sortOrder).toBe('desc');
  });

  it('should allow empty params', () => {
    const result = searchPageParamsSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.q).toBeUndefined();
  });

  it('should reject query longer than 200 characters', () => {
    expect(() =>
      searchPageParamsSchema.parse({ q: 'x'.repeat(201) }),
    ).toThrow();
  });
});

describe('categorySearchParamsSchema', () => {
  it('should parse valid category search params', () => {
    const result = categorySearchParamsSchema.parse({
      page: '1',
      sortBy: 'name',
      sortOrder: 'asc',
      minPrice: '5.00',
      isFeatured: 'false',
    });

    expect(result.page).toBe(1);
    expect(result.sortBy).toBe('name');
    expect(result.isFeatured).toBe('false');
  });

  it('should reject extra unknown params gracefully', () => {
    const result = categorySearchParamsSchema.parse({
      page: '1',
      unknown: 'value',
    });
    expect(result.page).toBe(1);
  });
});
