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

test('note creation and reading', async ({ page }) => {
  await page.goto('/');

  // create a note
  await page.fill(
    'textarea',
    '# hello world\n\nthis is a test note\n\n![kitten](https://placekitten.com/200/200)'
  );
  await page.getByRole('button', { name: 'Share Note' }).click();

  await expect(page.getByTestId('url')).toBeVisible();

  const url = await page.getByTestId('url').inputValue();
  await expect(url).toContain('#');

  if (!url) throw new Error('URL not found');

  // read the note
  await page.goto(url);

  await expect(page.getByRole('heading', { name: 'hello world' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'kitten' })).toBeVisible();
});
