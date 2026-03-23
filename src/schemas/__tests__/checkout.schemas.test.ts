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

  it('should fail when phone is too short', () => {
    const result = addressSchema.safeParse({ ...validData, phone: '12345' });
    expect(result.success).toBe(false);
  });

  it('should fail when country is not exactly 2 characters', () => {
    const result = addressSchema.safeParse({
      ...validData,
      country: 'POL',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when postalCode is too short', () => {
    const result = addressSchema.safeParse({ ...validData, postalCode: '00' });
    expect(result.success).toBe(false);
  });
});
