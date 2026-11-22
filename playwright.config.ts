import { defineConfig } from '@playwright/test';
import { environment } from './config/environment';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  timeout: environment.timeout,
  expect: {
    timeout: 10000,
  },
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL: environment.baseUrl,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    trace: 'on-first-retry',
  },
  retries: 0,
  workers: 1,
});
