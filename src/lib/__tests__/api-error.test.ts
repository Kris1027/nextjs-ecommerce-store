import { getErrorMessage } from '@/lib/api-error';

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

describe('getErrorMessage', () => {
  it('should return error.message when given an Error instance', () => {
    expect(getErrorMessage(new Error('Something broke'))).toBe(
      'Something broke',
    );
  });

  it('should return default message when Error has empty message', () => {
    expect(getErrorMessage(new Error(''))).toBe(DEFAULT_MESSAGE);
  });

  it('should return the string directly when given a string', () => {
    expect(getErrorMessage('Custom error')).toBe('Custom error');
  });

  it('should return default message when given null', () => {
    expect(getErrorMessage(null)).toBe(DEFAULT_MESSAGE);
  });

  it('should return default message when given undefined', () => {
    expect(getErrorMessage(undefined)).toBe(DEFAULT_MESSAGE);
  });

  it('should return default message when given a number', () => {
    expect(getErrorMessage(42)).toBe(DEFAULT_MESSAGE);
  });

  it('should return default message when given a plain object', () => {
    expect(getErrorMessage({ message: 'hidden' })).toBe(DEFAULT_MESSAGE);
  });
});
