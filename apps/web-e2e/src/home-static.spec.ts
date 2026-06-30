import { test, expect } from '@playwright/test';

test.describe('Home (Static)', () => {
  test('renders hero + device grid and freezes the render timestamp', async ({
    page,
  }) => {
    await page.goto('/');

    // Hero copy is present.
    await expect(page.getByText(/al precio Yoigo/i)).toBeVisible();

    // Device grid: at least one card links.
    const cardLinks = page.locator('a[href^="/dispositivos/"]');
    expect(await cardLinks.count()).toBeGreaterThan(0);

    // Static render badge with timestamp.
    const badge = page.locator('[data-render="static"]');
    await expect(badge).toBeVisible();
    const first = await badge.locator('time').getAttribute('datetime');
    expect(first).toBeTruthy();

    // Reloading must NOT change it.
    await page.reload();
    const second = await page
      .locator('[data-render="static"] time')
      .getAttribute('datetime');
    expect(second).toBe(first);
  });
});
