import { test, expect } from '@playwright/test';

const SECRET = process.env.REVALIDATE_SECRET ?? '';
const SLUG = 'galaxy-s24-ultra';

test.describe('API de revalidación', () => {
  test('rejects a request without the secret header (401)', async ({
    request,
  }) => {
    const res = await request.post('/api/revalidate?tag=devices');
    expect(res.status()).toBe(401);
  });

  test('revalidating a device tag changes its PDP timestamp', async ({
    page,
    request,
  }) => {
    test.skip(!SECRET, 'REVALIDATE_SECRET not available to the test runner');

    await page.goto(`/dispositivos/${SLUG}`);
    const before = await page
      .locator('[data-render="dynamic"] time')
      .getAttribute('datetime');
    expect(before).toBeTruthy();

    const res = await request.post(`/api/revalidate?tag=device:${SLUG}`, {
      headers: { 'x-revalidate-secret': SECRET },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).revalidated).toBe(true);

    await expect
      .poll(
        async () => {
          await page.reload();
          return page
            .locator('[data-render="dynamic"] time')
            .getAttribute('datetime');
        },
        { timeout: 15_000, intervals: [500, 1000, 1500] },
      )
      .not.toBe(before);
  });
});
