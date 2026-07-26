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

## Reports

The framework generates dedicated HTML reports for each suite:
- playwright-report/
- smoke-report/
- regression-report/
- auth-report/
- critical-report/

Open the default report:
- npm run report

## GitHub Actions

The workflow in .github/workflows/api.yml executes the following jobs:

1. Smoke API
2. Authentication API
3. Regression API

Smoke must pass before auth and regression start, which mirrors enterprise CI practices.
