import { APIResponse, expect } from '@playwright/test';

export class ResponseValidator {
  static async assertJsonStructure(response: APIResponse, expectedKeys: string[]): Promise<void> {
    const body = await response.json();
    for (const key of expectedKeys) {
      expect(body, `Missing JSON key: ${key}`).toHaveProperty(key);
    }
  }

  static async assertStatusAndContentType(response: APIResponse, statusCode: number): Promise<void> {
    expect(response.status()).toBe(statusCode);
    expect(response.headers()['content-type']).toContain('application/json');
  }

  static async assertResponseTime(response: APIResponse, maxMilliseconds: number): Promise<void> {
    const { startTime, responseEnd } = response.timing();
    expect(responseEnd, 'Response timing must be available').toBeGreaterThanOrEqual(startTime);
    expect(responseEnd - startTime).toBeLessThanOrEqual(maxMilliseconds);
  }
}
