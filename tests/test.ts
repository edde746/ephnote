import { expect, test } from '@playwright/test';

test('index page has expected elements', async ({ page }) => {
  await page.goto('/');

  // basic elements
  await expect(page.getByRole('heading', { name: 'ephnote' })).toBeVisible();
  await expect(page.getByTestId('content')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Share Note' })).toBeVisible();

  // destruction options
  await expect(page.getByLabel(/Destroy after/i)).toBeVisible();
  await expect(page.getByLabel(/or after reading/i)).toBeVisible();
});
