/**
 * E2 — Locator practice
 *
 * Copy this file to tests/ui/locators.spec.ts to run it.
 *
 * For each TODO, write the recommended Playwright locator.
 * Refer to docs/locators-cheatsheet.md if you get stuck.
 * Do NOT use XPath or CSS class selectors.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Locator practice — /users (list page)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/users`);
  });

  test('service-name nav link is visible', async ({ page }) => {
    // Made service-name link visible 
    const link = page.getByRole('link', { name: 'service-name' });
    await expect(link).toBeVisible();
  });

  test('Total Users stat displays a number', async ({ page }) => {
    // Total amount of users is visible
    const count = page.getByTestId('total-users-count');
      await expect(count).toBeVisible();
      // Bonus: assert the text content is a number greater than 0
      const countText = await count.textContent();
      const countNumber = parseInt(countText || '0', 10);
      expect(countNumber).toBeGreaterThan(0);
  });

  test('role filter radio buttons are present', async ({ page }) => {
    // ADMIN radio button is visible
    const adminRadio = page.getByRole('radio', { name: 'Admin' });
    await expect(adminRadio).toBeVisible();

    // USER radio button is visible
    const userRadio = page.getByRole('radio', { name: 'User' });
    await expect(userRadio).toBeVisible();
  });

  test('Alice Johnson appears in the table', async ({ page }) => {
    // locates a table row that contains "alice@example.com"
    // Hint: page.locator('#users-tbody tr').filter({ hasText: '...' })
    const aliceRow = page.locator('#users-tbody tr').filter({ hasText: 'alice@example.com' });
    await expect(aliceRow).toBeVisible();
  });

  test('Delete button exists for Alice Johnson', async ({ page }) => {
    // locates Alice's Delete button — scope to her row first
    const deleteBtn = page.locator('#users-tbody tr').filter({ hasText: 'alice@example.com' }).getByRole('button', { name: 'Delete' });
    await expect(deleteBtn).toBeVisible();
  });

});

test.describe('Locator practice — /users/new (create form)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/users/new`);
  });

  test('all four form inputs are present via getByLabel', async ({ page }) => {
    // locates each input using getByLabel — fill in the label text
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('Create User button is present and disabled initially', async ({ page }) => {
    // replaces page.locator('TODO') with page.getByRole('button', { name: '...' })
    const btn = page.getByRole('button', { name: 'Create User' });
    await expect(btn).toBeDisabled();
  });

});
