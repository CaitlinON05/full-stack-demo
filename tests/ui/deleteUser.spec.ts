
 /* Copy this file to tests/ui/deleteUser.spec.ts, then complete the TODOs.
 *
 * Useful locators:
 *   page.locator('#users-tbody tr').filter({ hasText: 'alice@example.com' })
 *   page.getByRole('status')   ← the green success message
 */

import { test, expect } from '@playwright/test';
import { UsersListPage } from '../pages/UsersListPage';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.beforeEach(async ({ request }) => {
  // Reset to seed data before each test so deletes don't cascade
  const reset = await request.post(`${BASE_URL}/api/seed`);
  expect(reset.ok()).toBeTruthy();
});

test('deleting a user shows a confirmation message @smoke', async ({ page }) => {
  const usersList = new UsersListPage(page);
  await usersList.goto();

  await usersList.deleteUserByEmail('alice@example.com');
  await expect(usersList.statusMessage).toContainText(/Alice Johnson.*deleted/i);
});


test('deleting a user removes the row from the table', async ({ page }) => {
  const usersList = new UsersListPage(page);
  await usersList.goto();
  
  // Wait for the page to fully load and display the user count
  await usersList.userCount.waitFor({ state: 'visible' });
  await page.waitForLoadState('networkidle');
  
  // Wait for the user count to stabilize (not the loading placeholder)
  await expect(usersList.userCount).not.toHaveText('–');

  const totalUsers = usersList.userCount;
  const beforeCount = Number(await totalUsers.textContent());

  const aliceRow = usersList.getUserRowByEmail('alice@example.com');
  await expect(aliceRow).toHaveCount(1);
  await usersList.deleteUserByEmail('alice@example.com');

  // Wait for the deletion to take effect
  await page.waitForLoadState('networkidle');
  await expect(aliceRow).toHaveCount(0);
  await expect(totalUsers).toHaveText(String(beforeCount - 1));
});

test('create user via API then delete via UI', async ({ page, request }) => {
  const usersList = new UsersListPage(page);
  const user = {
    firstName: 'Api',
    lastName: 'Created',
    email: `ui.delete+${Date.now()}@example.com`,
    password: 'SecurePass123!',
  };

  const createRes = await request.post(`${BASE_URL}/api/users`, { data: user });
  expect(createRes.status()).toBe(201);

  await usersList.goto();

  const totalUsers = usersList.userCount;
  await expect(totalUsers).not.toHaveText('–');
  const beforeCount = Number(await totalUsers.textContent());

  const createdRow = usersList.getUserRowByEmail(user.email);
  await expect(createdRow).toHaveCount(1);

  await usersList.deleteUserByEmail(user.email);

  await expect(createdRow).toHaveCount(0);
  await expect(totalUsers).toHaveText(String(beforeCount - 1));
  await expect(usersList.statusMessage).toContainText(/Api Created.*deleted/i);
});