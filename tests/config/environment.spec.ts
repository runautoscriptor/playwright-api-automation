import { expect, test } from '@playwright/test';
import { parseApiTimeout } from '../../config/environment';

test.describe('API timeout configuration', () => {
  test('uses the default timeout when API_TIMEOUT is not set', () => {
    expect(parseApiTimeout(undefined)).toBe(30000);
  });

  test('accepts a positive timeout in milliseconds', () => {
    expect(parseApiTimeout('45000')).toBe(45000);
  });

  for (const value of ['0', '-1', 'abc', 'Infinity', 'NaN', '']) {
    test(`rejects invalid API_TIMEOUT value "${value || '<empty>'}"`, () => {
      expect(() => parseApiTimeout(value)).toThrow(
        'API_TIMEOUT must be a positive number of milliseconds.',
      );
    });
  }
});
