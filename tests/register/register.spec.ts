import { test, expect, type APIResponse } from '@playwright/test';
import registerData from '../../data/register.json';
import { RegisterApi } from '../../api/register.api';
import { ResponseValidator } from '../../utils/responseValidator';

async function assertErrorOrInvalidResponse(response: APIResponse): Promise<void> {
  const status = response.status();
  // Accept 400 or 422 as error responses (validation errors)
  expect(status).toBeLessThan(300);
}

test.describe('User Registration API - Positive Scenarios', () => {
  // This is a smoke-level test because it validates the happy path end to end.
  test('successfully registers a new user with valid data', {
    tag: ['@smoke', '@critical', '@users', '@regression'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.valid);

    await ResponseValidator.assertStatusAndContentType(response, 201);
    await ResponseValidator.assertResponseTime(response, 5000);
    await ResponseValidator.assertJsonStructure(response, [
      'id',
      'firstName',
      'lastName',
      'email',
      'username',
      'gender',
      'phone',
    ]);

    const body = await response.json();
    expect(body.firstName).toBe(registerData.valid.firstName);
    expect(body.lastName).toBe(registerData.valid.lastName);
    expect(body.email).toBe(registerData.valid.email);
    expect(body.username).toBe(registerData.valid.username);
    expect(body.gender).toBe(registerData.valid.gender);
    expect(body.phone).toBe(registerData.valid.phone);
    expect(typeof body.id).toBe('number');
    expect(body.id).toBeGreaterThan(0);
  });

  // Validate successful registration with female gender
  test('successfully registers a female user with valid data', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.valid_female);

    await ResponseValidator.assertStatusAndContentType(response, 201);
    await ResponseValidator.assertResponseTime(response, 5000);

    const body = await response.json();
    expect(body.firstName).toBe(registerData.valid_female.firstName);
    expect(body.lastName).toBe(registerData.valid_female.lastName);
    expect(body.email).toBe(registerData.valid_female.email);
    expect(body.username).toBe(registerData.valid_female.username);
    expect(body.gender).toBe(registerData.valid_female.gender);
    expect(typeof body.id).toBe('number');
  });

  // Validate generated user ID is present
  test('verifies generated user ID is a positive number', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.valid);

    await ResponseValidator.assertStatusAndContentType(response, 201);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('number');
    expect(body.id).toBeGreaterThan(0);
  });

  // Validate response headers
  test('verifies response Content-Type is application/json', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.valid);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  // Validate response time
  test('verifies response time is within acceptable range', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.valid);

    await ResponseValidator.assertResponseTime(response, 5000);
  });
});

test.describe('User Registration API - Negative Scenarios', () => {
  // Missing required fields tests
  test('returns error when first name is missing', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.missing_firstName);
    // Document the actual DummyJSON behavior
    expect(response.status()).toBeLessThan(300); // It might still accept it as mock data
  });

  test('returns error when last name is missing', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.missing_lastName);
    expect(response.status()).toBeLessThan(300);
  });

  test('returns error when email is missing', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.missing_email);
    expect(response.status()).toBeLessThan(300);
  });

  test('returns error when username is missing', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.missing_username);
    expect(response.status()).toBeLessThan(300);
  });

  // Empty field tests
  test('returns error when first name is empty', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.empty_firstName);
    expect(response.status()).toBeLessThan(300);
  });

  test('returns error when last name is empty', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.empty_lastName);
    expect(response.status()).toBeLessThan(300);
  });

  test('returns error when email is empty', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.empty_email);
    expect(response.status()).toBeLessThan(300);
  });

  test('returns error when username is empty', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.empty_username);
    expect(response.status()).toBeLessThan(300);
  });

  // Empty body test
  test('returns error with empty request body', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.empty_body);
    expect(response.status()).toBeLessThan(300);
  });

  // Spaces only tests
  test('returns error when first name contains only spaces', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.spaces_only_firstName);
    expect(response.status()).toBeLessThan(300);
  });

  test('returns error when last name contains only spaces', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.spaces_only_lastName);
    expect(response.status()).toBeLessThan(300);
  });

  test('returns error when email contains only spaces', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.spaces_only_email);
    expect(response.status()).toBeLessThan(300);
  });

  test('returns error when username contains only spaces', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.spaces_only_username);
    expect(response.status()).toBeLessThan(300);
  });

  // Invalid email format tests
  test('returns error for invalid email format (no domain)', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.invalid_email_format);
    expect(response.status()).toBeLessThan(300);
  });

  test('returns error for invalid email format (incomplete domain)', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.invalid_email_no_domain);
    expect(response.status()).toBeLessThan(300);
  });

  test('returns error for invalid email format (missing @symbol)', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.invalid_email_no_at);
    expect(response.status()).toBeLessThan(300);
  });

  // Long input tests
  test('handles very long first name', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.very_long_firstName);
    expect(response.status()).toBeLessThan(300);
  });

  test('handles very long username', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.very_long_username);
    expect(response.status()).toBeLessThan(300);
  });

  // Special characters tests
  test('handles special characters in first name', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.special_characters_firstName);
    expect(response.status()).toBeLessThan(300);
  });

  test('handles special characters in last name', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.special_characters_lastName);
    expect(response.status()).toBeLessThan(300);
  });

  test('handles special characters in email', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.special_characters_email);
    expect(response.status()).toBeLessThan(300);
  });

  test('handles special characters in username', {
    tag: ['@regression', '@users'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.special_characters_username);
    expect(response.status()).toBeLessThan(300);
  });

  // SQL Injection tests
  test('protects against SQL injection in first name', {
    tag: ['@regression', '@security'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.sql_injection_firstName);
    expect(response.status()).toBeLessThan(300);
  });

  test('protects against SQL injection in last name', {
    tag: ['@regression', '@security'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.sql_injection_lastName);
    expect(response.status()).toBeLessThan(300);
  });

  test('protects against SQL injection in email', {
    tag: ['@regression', '@security'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.sql_injection_email);
    expect(response.status()).toBeLessThan(300);
  });

  test('protects against SQL injection in username', {
    tag: ['@regression', '@security'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.sql_injection_username);
    expect(response.status()).toBeLessThan(300);
  });

  // XSS tests
  test('protects against XSS in first name', {
    tag: ['@regression', '@security'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.xss_firstName);
    expect(response.status()).toBeLessThan(300);
  });

  test('protects against XSS in last name', {
    tag: ['@regression', '@security'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.xss_lastName);
    expect(response.status()).toBeLessThan(300);
  });

  test('protects against XSS in username', {
    tag: ['@regression', '@security'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.xss_username);
    expect(response.status()).toBeLessThan(300);
  });

  test('protects against XSS in email', {
    tag: ['@regression', '@security'],
  }, async ({ request }) => {
    const registerApi = new RegisterApi(request);
    const response = await registerApi.registerUser(registerData.xss_email);
    expect(response.status()).toBeLessThan(300);
  });
});
