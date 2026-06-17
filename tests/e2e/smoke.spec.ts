import { test, expect } from '@playwright/test';

test('Smoke test: application loads', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');

  // It should show either the auth gate or the main app.
  // Because we do not have credentials in E2E, we'll check if the page has rendered *something*
  // Socialobot's title or Firebase Auth UI should be visible.
  
  // Wait for the body to be attached
  await page.waitForSelector('body');
  
  const title = await page.title();
  expect(title).toBeDefined();

  // Basic sanity check to see if root div exists
  const rootElement = page.locator('#root');
  await expect(rootElement).toBeVisible();
});