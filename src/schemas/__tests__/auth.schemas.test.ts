import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/schemas/auth.schemas';

describe('loginSchema', () => {
  const validData = { email: 'test@example.com', password: 'password123' };

  it('should pass with valid email and password', () => {
    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when email is empty', () => {
    const result = loginSchema.safeParse({ ...validData, email: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when email is invalid', () => {
    const result = loginSchema.safeParse({ ...validData, email: 'not-email' });
    expect(result.success).toBe(false);
  });

  it('should fail when password is empty', () => {
    const result = loginSchema.safeParse({ ...validData, password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  };

  it('should pass with valid registration data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when firstName exceeds 50 characters', () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: 'a'.repeat(51),
    });
    expect(result.success).toBe(false);
  });

  it('should fail when firstName is empty', () => {
    const result = registerSchema.safeParse({ ...validData, firstName: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when password lacks uppercase letter', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'password1',
      confirmPassword: 'password1',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when password lacks lowercase letter', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'PASSWORD1',
      confirmPassword: 'PASSWORD1',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when password lacks number', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'Password',
      confirmPassword: 'Password',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when password is shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'Pass1',
      confirmPassword: 'Pass1',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when passwords do not match', () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: 'DifferentPass1',
    });
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('should pass with valid email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'test@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('should fail when email is invalid', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'not-email' });
    expect(result.success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('should pass when passwords match and meet requirements', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'NewPassword1',
      confirmPassword: 'NewPassword1',
    });
    expect(result.success).toBe(true);
  });

  it('should fail when passwords do not match', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'NewPassword1',
      confirmPassword: 'DifferentPass1',
    });
    expect(result.success).toBe(false);
  });
});
