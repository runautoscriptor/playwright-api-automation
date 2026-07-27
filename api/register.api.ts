import { APIRequestContext, APIResponse } from '@playwright/test';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  gender?: string;
  phone?: string;
}

export class RegisterApi {
  constructor(private readonly request: APIRequestContext) {}

  async registerUser(payload: RegisterPayload): Promise<APIResponse> {
    return this.request.post('/users/add', {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
