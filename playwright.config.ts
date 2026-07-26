import { defineConfig, devices } from '@playwright/test';

const htmlOutputDir = process.env.PLAYWRIGHT_HTML_OUTPUT_DIR ?? 'playwright-report';
const reporter = [
  ['list'],
  ['html', { open: 'never', outputFolder: htmlOutputDir }],
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  reporter,
  use: {
    baseURL: process.env.BASE_URL ?? 'https://dummyjson.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    trace: 'on-first-retry',
  },
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
