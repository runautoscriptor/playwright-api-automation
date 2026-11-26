import { test, expect, type APIResponse } from '@playwright/test';
import loginData from '../../data/login.json';
import { AuthApi } from '../../api/auth.api';
import { ResponseValidator } from '../../utils/responseValidator';

async function assertBadRequest(response: APIResponse): Promise<void> {
  await ResponseValidator.assertStatusAndContentType(response, 400);
  const body = await response.json();
  expect(body.message).toBeTruthy();
}

test.describe('Auth API - Login', () => {
  test('successfully logs in with valid credentials', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(loginData.valid);

    await ResponseValidator.assertStatusAndContentType(response, 200);
    await ResponseValidator.assertResponseTime(response, 5000);
    await ResponseValidator.assertJsonStructure(response, [
      'id',
      'username',
      'firstName',
      'lastName',
      'email',
      'accessToken',
    ]);

    const body = await response.json();
    expect(body.username).toBe(loginData.valid.username);
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
  });

  test('returns a 400 error for invalid username', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'invalid-user', password: loginData.valid.password });

    await assertBadRequest(response);
  });

  test('returns a 400 error for invalid password', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: loginData.valid.username, password: 'wrong-password' });

    await assertBadRequest(response);
  });

  test('returns a 400 error for empty username', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: '', password: loginData.valid.password });

    await assertBadRequest(response);
  });

  test('returns a 400 error for empty password', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: loginData.valid.username, password: '' });

    await assertBadRequest(response);
  });

  test('returns a 400 error when both fields are empty', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: '', password: '' });

    await assertBadRequest(response);
  });

  test('returns a 400 error for username with spaces', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'kminchelle ', password: loginData.valid.password });

    await assertBadRequest(response);
  });

  test('returns a 400 error for password with spaces', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: loginData.valid.username, password: ' 0lelplR ' });

    await assertBadRequest(response);
  });

  test('returns a 400 error for SQL injection input', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'kminchelle OR 1=1', password: loginData.valid.password });

    await assertBadRequest(response);
  });

  test('returns a 400 error for XSS input', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: '<script>alert(1)</script>', password: loginData.valid.password });

    await assertBadRequest(response);
  });

  test('returns a 400 error for very long username', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'a'.repeat(300), password: loginData.valid.password });

    await assertBadRequest(response);
  });

  test('returns a 400 error when request body is missing', async ({ request }) => {
    const response = await request.post('/auth/login', {
      headers: { 'Content-Type': 'application/json' },
    });

    await assertBadRequest(response);
  });

  test('returns a 400 error for invalid JSON body', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: '{"username":"kminchelle"',
      headers: { 'Content-Type': 'application/json' },
    });

    await assertBadRequest(response);
  });
});
