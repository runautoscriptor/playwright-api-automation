import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected async post<TRequest, TResponse>(url: string, payload: TRequest): Promise<TResponse> {
    const response = await this.request.post(url, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json() as Promise<TResponse>;
  }
}
