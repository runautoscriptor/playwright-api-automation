import { expect, test } from '@playwright/test';
import { parseApiTimeout, parseBaseUrl } from '../../config/environment';

test.describe('API base URL configuration', () => {
  test('uses the default URL when BASE_URL is not set', () => {
    expect(parseBaseUrl(undefined)).toBe('https://dummyjson.com');
  });

  test('accepts an absolute HTTPS API URL', () => {
    expect(parseBaseUrl('https://api.example.com/v1')).toBe('https://api.example.com/v1');
  });

  test('accepts an absolute HTTP URL for local development', () => {
    expect(parseBaseUrl('http://localhost:3000')).toBe('http://localhost:3000');
  });

  for (const value of ['', '/api', 'api.example.com', 'ftp://api.example.com', 'https://']) {
    test(`rejects invalid BASE_URL value "${value || '<empty>'}"`, () => {
      expect(() => parseBaseUrl(value)).toThrow(
        'BASE_URL must be a valid absolute HTTP or HTTPS URL.',
      );
    });
  }
});

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
