import { test, expect, type APIResponse } from '@playwright/test';
import loginData from '../../data/login.json';
import { AuthApi } from '../../api/auth.api';
import { ResponseValidator } from '../../utils/responseValidator';

async function assertErrorResponse(response: APIResponse): Promise<void> {
  await ResponseValidator.assertStatusAndContentType(response, 400);
  const body = await response.json();
  expect(body).toHaveProperty('message');
  expect(typeof body.message).toBe('string');
  expect((body.message as string).length).toBeGreaterThan(0);
}

test.describe('Auth API - Login', () => {
  // This is a smoke-level test because it validates the happy path end to end.
  test('successfully logs in with valid credentials', {
    tag: ['@smoke', '@critical', '@auth', '@regression'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(loginData.valid);

    await ResponseValidator.assertStatusAndContentType(response, 200);
    await ResponseValidator.assertResponseTime(response, 5000);
    await ResponseValidator.assertJsonStructure(response, ['id', 'username', 'firstName', 'lastName', 'email', 'accessToken']);

    const body = await response.json();
    expect(body.username).toBe(loginData.valid.username);
    expect(typeof body.accessToken).toBe('string');
    expect((body.accessToken as string).length).toBeGreaterThan(0);
  });

  // This is a regression/auth test because it validates invalid credentials handling.
  test('returns a 400 error for invalid username', {
    tag: ['@regression', '@auth'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'invalid-user', password: loginData.valid.password });
    await assertErrorResponse(response);
  });

  // This is a regression/auth test because it validates invalid credentials handling.
  test('returns a 400 error for invalid password', {
    tag: ['@regression', '@auth'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: loginData.valid.username, password: 'wrong-password' });
    await assertErrorResponse(response);
  });

  // This is a regression test because it validates request field validation.
  test('returns a 400 error for empty username', {
    tag: ['@regression'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: '', password: loginData.valid.password });
    await assertErrorResponse(response);
  });

  // This is a regression test because it validates request field validation.
  test('returns a 400 error for empty password', {
    tag: ['@regression'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: loginData.valid.username, password: '' });
    await assertErrorResponse(response);
  });

  // This is a regression test because it validates request field validation.
  test('returns a 400 error when both fields are empty', {
    tag: ['@regression'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: '', password: '' });
    await assertErrorResponse(response);
  });

  // This is a regression/auth test because it validates whitespace input handling.
  test('returns a 400 error for username with spaces', {
    tag: ['@regression', '@auth'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'kminchelle ', password: loginData.valid.password });
    await assertErrorResponse(response);
  });

  // This is a regression/auth test because it validates whitespace input handling.
  test('returns a 400 error for password with spaces', {
    tag: ['@regression', '@auth'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: loginData.valid.username, password: ' 0lelplR ' });
    await assertErrorResponse(response);
  });

  // This is a regression/security test because it validates injection-safe handling.
  test('returns a 400 error for SQL injection input', {
    tag: ['@regression', '@security'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'kminchelle OR 1=1', password: loginData.valid.password });
    await assertErrorResponse(response);
  });

  // This is a regression/security test because it validates XSS-safe handling.
  test('returns a 400 error for XSS input', {
    tag: ['@regression', '@security'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: '<script>alert(1)</script>', password: loginData.valid.password });
    await assertErrorResponse(response);
  });

  // This is a regression test because it validates input length handling.
  test('returns a 400 error for very long username', {
    tag: ['@regression'],
  }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'a'.repeat(300), password: loginData.valid.password });
    await assertErrorResponse(response);
  });

  // This is a regression test because it validates missing request body handling.
  test('returns a 400 error when request body is missing', {
    tag: ['@regression'],
  }, async ({ request }) => {
    const response = await request.post('/auth/login', {
      headers: { 'Content-Type': 'application/json' },
    });
    await assertErrorResponse(response);
  });

  // This is a regression test because it validates malformed request body handling.
  test('returns a 400 error for invalid JSON body', {
    tag: ['@regression'],
  }, async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: '{"username":"kminchelle"',
      headers: { 'Content-Type': 'application/json' },
    });
    await assertErrorResponse(response);
  });
});
