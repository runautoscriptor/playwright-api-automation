import { expect, test } from '@playwright/test';
import type { APIResponse } from '@playwright/test';
import { ResponseValidator } from '../../utils/responseValidator';

function responseWithEndTime(responseEnd: number): APIResponse {
  return {
    timing: () => ({
      startTime: 1_700_000_000_000,
      responseEnd,
    }),
  } as unknown as APIResponse;
}

test.describe('ResponseValidator response timing', () => {
  test('accepts responseEnd as elapsed milliseconds from startTime', async () => {
    await expect(
      ResponseValidator.assertResponseTime(responseWithEndTime(125), 5000),
    ).resolves.toBeUndefined();
  });

  test('rejects unavailable response timing', async () => {
    await expect(
      ResponseValidator.assertResponseTime(responseWithEndTime(-1), 5000),
    ).rejects.toThrow('Response timing must be available');
  });

  test('rejects response times above the configured limit', async () => {
    await expect(
      ResponseValidator.assertResponseTime(responseWithEndTime(5001), 5000),
    ).rejects.toThrow();
  });
});
