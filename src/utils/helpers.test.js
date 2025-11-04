import { describe, it, expect } from 'vitest';
import { formatErrorMessage } from './helpers';

describe('formatErrorMessage', () => {
  it('returns message from error.response.data.message', () => {
    const msg = formatErrorMessage({ response: { data: { message: 'Bad request' } } });
    expect(msg).toBe('Bad request');
  });

  it('returns error from error.response.data.error', () => {
    const msg = formatErrorMessage({ response: { data: { error: 'Invalid token' } } });
    expect(msg).toBe('Invalid token');
  });

  it('returns error.message when present', () => {
    const msg = formatErrorMessage({ message: 'Network error' });
    expect(msg).toBe('Network error');
  });

  it('returns fallback message otherwise', () => {
    const msg = formatErrorMessage({});
    expect(msg).toBe('An error occurred. Please try again.');
  });
});


