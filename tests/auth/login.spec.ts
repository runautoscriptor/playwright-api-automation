import { test, expect } from '@playwright/test';
import loginData from '../../data/login.json';
import { AuthApi } from '../../api/auth.api';

test.describe('Auth API - Login', () => {
  test('successfully logs in with valid credentials', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(loginData.valid);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const timing = response.timing();
    expect(timing.responseEnd - timing.startTime).toBeLessThanOrEqual(5000);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('username');
    expect(body).toHaveProperty('firstName');
    expect(body).toHaveProperty('lastName');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('accessToken');

    expect(body.username).toBe(loginData.valid.username);
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
  });

  test('returns a 400 error for invalid username', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'invalid-user', password: loginData.valid.password });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error for invalid password', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: loginData.valid.username, password: 'wrong-password' });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error for empty username', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: '', password: loginData.valid.password });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error for empty password', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: loginData.valid.username, password: '' });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error when both fields are empty', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: '', password: '' });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error for username with spaces', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'kminchelle ', password: loginData.valid.password });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error for password with spaces', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: loginData.valid.username, password: ' 0lelplR ' });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error for SQL injection input', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'kminchelle OR 1=1', password: loginData.valid.password });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error for XSS input', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: '<script>alert(1)</script>', password: loginData.valid.password });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error for very long username', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login({ username: 'a'.repeat(300), password: loginData.valid.password });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error when request body is missing', async ({ request }) => {
    const response = await request.post('/auth/login', {
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('returns a 400 error for invalid JSON body', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: '{"username":"kminchelle"',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });
});
