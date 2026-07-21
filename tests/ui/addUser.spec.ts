import { test, expect } from '@playwright/test';
import { CreateUserPage } from '../pages/CreateUserPage';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const testUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: `jane.doe+${Date.now()}@example.com`,
  password: 'SecurePass123!',
};

test.afterEach(async ({ request }) => {
  // Cleanup: delete user by email via API if endpoint exists
  await request.delete(`${BASE_URL}/api/users`, {
    data: { email: testUser.email },
  }).catch(() => { /* ignore if cleanup endpoint not available */ });
});

// POM Implementation tests
test('Add user via UI saves first name, last name and email correctly @smoke', async ({ page }) => {
  const createPage = new CreateUserPage(page);
  await createPage.goto();
  await createPage.fillForm(testUser);
  await createPage.submit();

  // Should navigate to user list or user detail page
  await expect(page).toHaveURL(/\/users/);

  // Confirm all three fields are visible in the saved record
  await expect(page.getByText(testUser.firstName, { exact: true })).toBeVisible();
  await expect(page.getByText(testUser.lastName, { exact: true })).toBeVisible();
  await expect(page.getByText(testUser.email)).toBeVisible();
});


test('Add user via UI shows error for duplicate email', async ({ page, request }) => {
  // Pre-create user via API so we have a known duplicate
  await request.post(`${BASE_URL}/api/users`, {
    data: {
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
      password: testUser.password,
    },
  });

  await page.goto(`${BASE_URL}/users/new`);

  await page.getByLabel('First Name').fill(testUser.firstName);
  await page.getByLabel('Last Name').fill(testUser.lastName);
  await page.getByLabel('Email').fill(testUser.email);
  await page.getByLabel('Password').fill(testUser.password);

  await page.getByRole('button', { name: 'Create User' }).click();

  await expect(page.getByRole('alert')).toContainText(/email.*already (exists|taken|in use)/i);
});

test('Add user via UI Create User button is disabled until all fields are filled', async ({ page }) => {
  await page.goto(`${BASE_URL}/users/new`);

  const submitBtn = page.getByRole('button', { name: 'Create User' });

  // E1-E: button starts disabled — all fields are empty
  await expect(submitBtn).toBeDisabled();

  // Filling fields one-by-one — still disabled until ALL four have values
  await page.getByLabel('First Name').fill(testUser.firstName);
  await expect(submitBtn).toBeDisabled();

  await page.getByLabel('Last Name').fill(testUser.lastName);
  await expect(submitBtn).toBeDisabled();

  await page.getByLabel('Email').fill(testUser.email);
  await expect(submitBtn).toBeDisabled();

  // Password is the last required field — only now the button enables
  await page.getByLabel('Password').fill(testUser.password);
  await expect(submitBtn).toBeEnabled();
});
