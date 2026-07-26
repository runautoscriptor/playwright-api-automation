import { APIRequestContext, APIResponse } from '@playwright/test';

export interface LoginPayload {
  username: string;
  password: string;
}

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  async login(payload: LoginPayload): Promise<APIResponse> {
    return this.request.post('/auth/login', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
