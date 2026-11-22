# Playwright API Automation Framework

A production-style Playwright API automation framework for testing the DummyJSON authentication endpoints.

## Project Structure

- tests/auth/login.spec.ts - login API test scenarios
- api/auth.api.ts - reusable authentication API page-object style wrapper
- data/login.json - test data for login scenarios
- utils/apiClient.ts - reusable HTTP client abstraction
- utils/responseValidator.ts - reusable response validation helpers
- config/environment.ts - environment configuration
- playwright.config.ts - Playwright configuration with HTML reporting

## Installation

1. Install Node.js 20+
2. Install dependencies:
   `npm install`
3. Install Playwright browsers:
   `npx playwright install`

## Configuration

The framework supports these environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `BASE_URL` | `https://dummyjson.com` | Base URL for API requests |
| `API_TIMEOUT` | `30000` | Playwright test timeout in milliseconds; must be a positive number |

Example (PowerShell):

```powershell
$env:BASE_URL = "https://dummyjson.com"
$env:API_TIMEOUT = "45000"
npm test
```

Example (macOS/Linux):

```bash
BASE_URL=https://dummyjson.com API_TIMEOUT=45000 npm test
```

An invalid `API_TIMEOUT` value (zero, negative, or non-numeric) causes configuration to fail with a clear error instead of passing an invalid timeout to Playwright.

## Run Tests

Run all tests:

```bash
npm test
```

Run login tests only:

```bash
npm run test:auth
```

Run TypeScript type checking:

```bash
npm run typecheck
```

## Generate Reports

Open the HTML report:

```bash
npm run report
```
