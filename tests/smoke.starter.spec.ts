/**
 * E11 — CI/CD smoke tests
 *
 * Copy this file to tests/smoke.spec.ts to run it.
 *
 * These are the tests that run in the GitHub Actions pipeline.
 * They must always pass — they are the minimum bar for a green build.
 *
 * After completing the TODOs, push to GitHub and check the Actions tab.
 * The workflow file is at: .github/workflows/e2e.yml
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('GET /health returns { status: "ok" } @smoke', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/health`);

  // TODO: assert status is 200
  await expect(res.status()).toBe(200);
  // TODO: assert the body equals { status: 'ok' }
  const body = await res.json();
  await expect(body).toEqual({ status: 'ok' });
});

test('users page loads and shows a heading @smoke', async ({ page }) => {
  await page.goto(`${BASE_URL}/users`);

  // TODO: assert the main heading is visible
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  // TODO: assert the user table is visible (use getByTestId)
  const userTable = page.getByTestId('user-table');
  await expect(userTable).toBeVisible();
});

test('create user form is reachable @smoke', async ({ page }) => {
  await page.goto(`${BASE_URL}/users/new`);

  // TODO: assert the "Create User" button is visible
  const createUserButton = page.getByRole('button', { name: 'Create User' });
  await expect(createUserButton).toBeVisible();
  // TODO: assert it is disabled on an empty form
  await expect(createUserButton).toBeDisabled();  
});

test('LLM demo page loads @smoke', async ({ page }) => {
  await page.goto(`${BASE_URL}/llm`);

  // TODO: assert the "Generate Response" button is visible and enabled
  const generateResponseButton = page.getByRole('button', { name: 'Generate Response' });
  await expect(generateResponseButton).toBeVisible();
  await expect(generateResponseButton).toBeEnabled(); 
});

test('API: GET /api/users returns an array of users @smoke', async ({ request }) => {
  const res  = await request.get(`${BASE_URL}/api/users`);

  // TODO: assert status is 200
  await expect(res.status()).toBe(201);
  // TODO: assert the body is an array with at least 1 user
  const body = await res.json();
  await expect(Array.isArray(body)).toBe(true);
  await expect(body.length).toBeGreaterThan(0);
  // TODO: assert the first user has firstName, lastName, and email properties
  const firstUser = body[0];
  await expect(firstUser).toHaveProperty('firstName');
  await expect(firstUser).toHaveProperty('lastName');
  await expect(firstUser).toHaveProperty('email');
});
