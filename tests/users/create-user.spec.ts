import { test, expect } from '@playwright/test';
import userData from '../../data/user.json';
import { UsersApi } from '../../api/users.api';
import { ResponseValidator } from '../../utils/responseValidator';

test.describe('Users API - Create user', () => {
  test('creates a user with basic profile details', async ({ request }) => {
    const usersApi = new UsersApi(request);
    const response = await usersApi.createUser(userData.basic);

    await ResponseValidator.assertStatusAndContentType(response, 201);
    await ResponseValidator.assertResponseTime(response, 5000);
    await ResponseValidator.assertJsonStructure(response, [
      'id',
      'firstName',
      'lastName',
      'age',
    ]);

    const body = await response.json();
    expect(body.id).toEqual(expect.any(Number));
    expect(body.id).toBeGreaterThan(0);
    expect(body.firstName).toBe(userData.basic.firstName);
    expect(body.lastName).toBe(userData.basic.lastName);
    expect(body.age).toBe(userData.basic.age);
  });

  test('returns optional contact details when they are provided', async ({ request }) => {
    const usersApi = new UsersApi(request);
    const response = await usersApi.createUser(userData.withContactDetails);

    await ResponseValidator.assertStatusAndContentType(response, 201);
    await ResponseValidator.assertJsonStructure(response, [
      'id',
      'firstName',
      'lastName',
      'age',
      'email',
      'phone',
    ]);

    const body = await response.json();
    expect(body.id).toEqual(expect.any(Number));
    expect(body.id).toBeGreaterThan(0);
    expect(body.firstName).toBe(userData.withContactDetails.firstName);
    expect(body.lastName).toBe(userData.withContactDetails.lastName);
    expect(body.age).toBe(userData.withContactDetails.age);
    expect(body.email).toBe(userData.withContactDetails.email);
    expect(body.phone).toBe(userData.withContactDetails.phone);
  });
});
