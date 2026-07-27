# Playwright API Automation Framework

A production-style Playwright API automation framework for testing the DummyJSON authentication endpoints in a structured, enterprise-friendly way.

## Project Structure

- tests/auth/login.spec.ts - tagged login API test scenarios
- api/auth.api.ts - reusable authentication API wrapper
- data/login.json - centralized login test data
- utils/apiClient.ts - reusable API client abstraction
- utils/responseValidator.ts - reusable response validation helpers
- config/environment.ts - environment configuration
- playwright.config.ts - Playwright configuration with HTML reporting
- .github/workflows/api.yml - GitHub Actions pipeline for smoke/auth/regression jobs

## Test Tag Strategy

The suite uses Playwright tags to group tests by intent:

- @smoke - core happy-path validation
- @regression - broader regression coverage
- @critical - high-priority business-critical scenarios
- @auth - authentication-focused tests
- @users - user registration and management tests
- @security - security-related validation cases

## Running Tests

Run the full API suite:
- npm test

Run smoke suite:
- npm run smoke

Run regression suite:
- npm run regression

Run authentication suite:
- npm run auth

Run critical-focused suite:
- npm run critical

Run user registration suite:
- npm run users

## Reports

The framework generates dedicated HTML reports for each suite:
- playwright-report/
- smoke-report/
- regression-report/
- auth-report/
- critical-report/
- users-report/

Open the default report:
- npm run report

## GitHub Actions

The workflow in .github/workflows/api.yml executes the following jobs:

1. Smoke API
2. Authentication API
3. Regression API

Smoke must pass before auth and regression start, which mirrors enterprise CI practices.

---

## User Registration API

### Purpose

The User Registration API feature automates the testing of DummyJSON user creation endpoint. It validates registration functionality with comprehensive positive and negative test scenarios, including security validations for SQL injection and XSS attacks.

### Architecture

**API Layer:**
- `api/register.api.ts` - RegisterApi class providing reusable `registerUser()` method
- Encapsulates POST request to `/users/add` endpoint
- Strict typing with RegisterPayload interface
- No direct request.post() calls in tests

**Test Data:**
- `data/register.json` - Centralized test data for all scenarios
- Covers valid, invalid, edge case, and security attack payloads
- Organized by test scenario type

**Test Suites:**
- `tests/register/register.spec.ts` - 44+ test cases
- Positive scenarios: 8 tests validating successful registration
- Negative scenarios: 36+ tests covering validation, security, and edge cases

### Test Scenarios

#### Positive Scenarios (✔ 8 tests)
- Register with valid male user data
- Register with valid female user data  
- Verify generated user ID is positive number
- Verify JSON response structure contains all required keys
- Verify first name, last name, email, username, gender, phone are correct
- Verify response status 200
- Verify Content-Type is application/json
- Verify response time under 5 seconds

#### Negative Scenarios (✔ 36+ tests)
- **Missing Fields:** firstName, lastName, email, username
- **Empty Fields:** firstName, lastName, email, username
- **Empty Request Body:** Complete payload missing
- **Spaces Only:** All fields filled with spaces
- **Invalid Email:** Multiple formats (no domain, no @, incomplete)
- **Long Inputs:** Very long firstName and username
- **Special Characters:** All fields with special characters
- **SQL Injection:** Multiple payloads testing injection protection
- **XSS Attacks:** Multiple payloads testing XSS protection

### Playwright Tags

Tests are tagged for flexible execution:
- `@smoke` - Critical happy path (Register new user)
- `@critical` - High priority scenarios
- `@users` - All user registration tests
- `@regression` - Comprehensive regression coverage
- `@security` - SQL injection and XSS scenarios

### How to Execute

Run all tests:
```bash
npm test
```

Run user registration tests only:
```bash
npm run users
```

Run smoke tests (includes registration happy path):
```bash
npm run smoke
```

Run regression tests (includes all registration scenarios):
```bash
npm run regression
```

Run security tests (includes injection/XSS):
```bash
npm run regression -- --grep @security
```

View the user registration report:
```bash
npm run users
npm run report
```

### Response Validation

Each test validates:
- ✔ HTTP Status Code (200 for success)
- ✔ Content-Type header (application/json)
- ✔ Response time (< 5000ms)
- ✔ JSON structure (presence of required keys)
- ✔ Data values (firstName, lastName, email, username, gender, phone)
- ✔ Generated user ID (positive number)
