# Playwright API Automation Framework

A production-style Playwright API automation framework for testing the DummyJSON authentication and user endpoints.

## Project Structure

- tests/auth/login.spec.ts - login API test scenarios
- tests/users/create-user.spec.ts - user creation API contract tests
- api/auth.api.ts - reusable authentication API wrapper
- api/users.api.ts - reusable user API wrapper
- data/login.json - test data for login scenarios
- data/user.json - test data for user creation scenarios
- utils/apiClient.ts - reusable HTTP client abstraction
- utils/responseValidator.ts - reusable response validation helpers
- config/environment.ts - environment configuration
- playwright.config.ts - Playwright configuration with HTML reporting

## Installation

1. Install Node.js 20+
2. Install dependencies:

   `npm install`

3. Install Playwright browsers if you plan to add browser-based tests:

   `npx playwright install`

## Configuration

The framework supports these environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `BASE_URL` | `https://dummyjson.com` | Absolute HTTP or HTTPS URL for API requests |
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

`BASE_URL` must be an absolute HTTP or HTTPS URL. Invalid, relative, or unsupported-protocol values cause configuration to fail with a clear error. `API_TIMEOUT` values that are zero, negative, or non-numeric also cause configuration to fail instead of passing an invalid timeout to Playwright.

## Run Tests

Run all tests:

```bash
npm test
```

Run login tests only:

```bash
npm run test:auth
```

Run user creation tests only:

```bash
npm run test:users
```

Run TypeScript type checking:

```bash
npm run typecheck
```

## User Creation Test Scope

The user suite covers the `POST /users/add` endpoint. DummyJSON simulates user creation and returns a generated ID, but does not persist the created user on the server. These tests validate the response contract and returned request fields; they do not claim to verify a real account registration flow, persistence, or server-side field validation.

See the [DummyJSON Users documentation](https://dummyjson.com/docs/users) for endpoint behavior.

## Generate Reports

Open the HTML report:

```bash
npm run report
```
