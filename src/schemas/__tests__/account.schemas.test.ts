import { profileSchema, changePasswordSchema } from '@/schemas/account.schemas';

describe('profileSchema', () => {
  it('should pass with valid first and last name', () => {
    const result = profileSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(result.success).toBe(true);
  });

  it('should fail when firstName is empty', () => {
    const result = profileSchema.safeParse({
      firstName: '',
      lastName: 'Doe',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when lastName exceeds 50 characters', () => {
    const result = profileSchema.safeParse({
      firstName: 'John',
      lastName: 'a'.repeat(51),
    });
    expect(result.success).toBe(false);
  });
});

describe('changePasswordSchema', () => {
  const validData = {
    currentPassword: 'OldPassword1',
    newPassword: 'NewPassword1',
    confirmPassword: 'NewPassword1',
  };

  it('should pass with valid password change data', () => {
    const result = changePasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when new password equals current password', () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: 'OldPassword1',
      confirmPassword: 'OldPassword1',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when confirm does not match new password', () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      confirmPassword: 'DifferentPass1',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when new password does not meet strength requirements', () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: 'weak',
      confirmPassword: 'weak',
    });
    expect(result.success).toBe(false);
  });

  it('should fail when current password is empty', () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      currentPassword: '',
    });
    expect(result.success).toBe(false);
  });
});
