import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,  // Tests must run serially because they share seed data
  workers: 1,            // Run with single worker to avoid seed data conflicts
  reporter: [['html']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',  // E10: view with `npx playwright show-trace`
    // headless: false,       // uncomment to watch tests run in the browser
  },
});
