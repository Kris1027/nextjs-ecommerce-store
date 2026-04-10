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

  it('should return message from a plain object with message property', () => {
    expect(getErrorMessage({ message: 'hidden' })).toBe('hidden');
  });

  it('should return message from an API error response object', () => {
    expect(
      getErrorMessage({
        success: false,
        statusCode: 400,
        message: 'You must purchase this product before reviewing',
        error: 'Bad Request',
      }),
    ).toBe('You must purchase this product before reviewing');
  });

  it('should return default message when object has empty message', () => {
    expect(getErrorMessage({ message: '' })).toBe(DEFAULT_MESSAGE);
  });

  it('should return default message when object has non-string message', () => {
    expect(getErrorMessage({ message: 42 })).toBe(DEFAULT_MESSAGE);
  });

  it('should return default message when object has no message property', () => {
    expect(getErrorMessage({ code: 'ERR' })).toBe(DEFAULT_MESSAGE);
  });
});
