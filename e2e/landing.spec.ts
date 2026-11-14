import { expect, test } from '@playwright/test';

test('renders hero, features and the unauthenticated header', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Manage projects visually with TaskFlow');
  await expect(page.getByRole('heading', { name: 'Features' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kanban Boards' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByText('© 2026 TaskFlow. All rights reserved.')).toBeVisible();
});

test('sends an unauthenticated visitor from /board back to the landing page', async ({ page }) => {
  await page.goto('/board');

  await expect.poll(() => new URL(page.url()).pathname).toBe('/');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
