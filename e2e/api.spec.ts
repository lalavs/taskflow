import { expect, test } from '@playwright/test';

test('GET /api/notes answers 401 without a session', async ({ request }) => {
  const response = await request.get('/api/notes', { maxRedirects: 0 });

  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ error: 'Unauthorized' });
});
