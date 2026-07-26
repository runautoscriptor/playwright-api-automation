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
   npm install
3. Install Playwright browsers:
   npx playwright install

## Run Tests

Run all tests:
npm test

Run login tests only:
npm run test:auth

## Generate Reports

Open the HTML report:
npm run report
