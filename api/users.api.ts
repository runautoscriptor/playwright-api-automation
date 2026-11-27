import { APIRequestContext, APIResponse } from '@playwright/test';

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  age: number;
  email?: string;
  phone?: string;
}

export class UsersApi {
  constructor(private readonly request: APIRequestContext) {}

  async createUser(payload: CreateUserPayload): Promise<APIResponse> {
    return this.request.post('/users/add', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
