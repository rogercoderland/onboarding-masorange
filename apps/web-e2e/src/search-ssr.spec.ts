import { test, expect } from '@playwright/test';

test.describe('Búsqueda (SSR)', () => {
  test('filters server-side and the render timestamp changes on every reload', async ({
    page,
  }) => {
    await page.goto('/buscar?q=iphone');

    // Server-side filtered results for the query.
    const cards = page.locator('a[href^="/dispositivos/"]');
    await expect(cards.first()).toBeVisible();

    // SSR render badge with a server timestamp.
    const badge = page.locator('[data-render="ssr"]');
    await expect(badge).toBeVisible();
    const first = await badge.locator('time').getAttribute('datetime');
    expect(first).toBeTruthy();

    // Reloading MUST produce a new server timestamp — the opposite of Static.
    await page.reload();
    const second = await page
      .locator('[data-render="ssr"] time')
      .getAttribute('datetime');
    expect(second).not.toBe(first);
  });
});
