import { addressSchema } from '@/schemas/checkout.schemas';

describe('addressSchema', () => {
  const validData = {
    fullName: 'John Doe',
    phone: '123456789',
    street: '123 Main St',
    city: 'Warsaw',
    postalCode: '00-001',
  };

  it('should pass with valid complete address data', () => {
    const result = addressSchema.safeParse({
      ...validData,
      region: 'Mazowieckie',
    });
    expect(result.success).toBe(true);
  });

  it('should pass with optional region omitted', () => {
    const result = addressSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should default type to SHIPPING', () => {
    const result = addressSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('SHIPPING');
    }
  });

  it('should default country to PL', () => {
    const result = addressSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.country).toBe('PL');
    }
  });

  it('should fail when fullName is too short', () => {
    const result = addressSchema.safeParse({ ...validData, fullName: 'A' });
    expect(result.success).toBe(false);
  });

  describe('phone validation', () => {
    it('should pass with 9-digit phone number', () => {
      const result = addressSchema.safeParse({
        ...validData,
        phone: '123456789',
      });
      expect(result.success).toBe(true);
    });

    it('should pass with +48 prefix phone number', () => {
      const result = addressSchema.safeParse({
        ...validData,
        phone: '+48123456789',
      });
      expect(result.success).toBe(true);
    });

    it('should fail with letters in phone number', () => {
      const result = addressSchema.safeParse({
        ...validData,
        phone: 'abcdefghi',
      });
      expect(result.success).toBe(false);
    });

    it('should fail with too few digits', () => {
      const result = addressSchema.safeParse({
        ...validData,
        phone: '12345',
      });
      expect(result.success).toBe(false);
    });

    it('should fail with too many digits', () => {
      const result = addressSchema.safeParse({
        ...validData,
        phone: '1234567890',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('postalCode validation', () => {
    it('should pass with valid XX-XXX format', () => {
      const result = addressSchema.safeParse({
        ...validData,
        postalCode: '31-500',
      });
      expect(result.success).toBe(true);
    });

    it('should fail with missing dash', () => {
      const result = addressSchema.safeParse({
        ...validData,
        postalCode: '31500',
      });
      expect(result.success).toBe(false);
    });

    it('should fail with letters', () => {
      const result = addressSchema.safeParse({
        ...validData,
        postalCode: 'hello',
      });
      expect(result.success).toBe(false);
    });

    it('should fail with wrong digit count', () => {
      const result = addressSchema.safeParse({
        ...validData,
        postalCode: '1-234',
      });
      expect(result.success).toBe(false);
    });
  });

  it('should fail when country is not exactly 2 characters', () => {
    const result = addressSchema.safeParse({
      ...validData,
      country: 'POL',
    });
    expect(result.success).toBe(false);
  });
});
