import { test, expect } from '@playwright/test';

test.describe('Catálogo → PDP → carrito', () => {
  test('filters by brand, opens a PDP and adds to cart', async ({ page }) => {
    await page.goto('/dispositivos');

    // CSR grid renders.
    const cards = page.locator('a[href^="/dispositivos/"]');
    await expect(cards.first()).toBeVisible();

    // Apply the brand filter via the Select; URL query updates client-side.
    await page.getByText('Todas las marcas').click();
    await page.getByRole('option', { name: 'Apple' }).click();
    await expect(page).toHaveURL(/brand=Apple/);

    // Open the first (Apple) device's PDP.
    await cards.first().click();
    await expect(page).toHaveURL(/\/dispositivos\/[a-z0-9-]+$/);

    // Add to cart → the mini-cart drawer opens with the item.
    await page.getByRole('button', { name: /Añadir al carrito/i }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer.getByText('Tu carrito')).toBeVisible();
    await expect(
      drawer.getByRole('button', { name: /Tramitar pedido/i }),
    ).toBeVisible();

    // Go to the full cart from the drawer (this also closes the drawer, so the
    // header is back in the accessibility tree and its count reads 1).
    await drawer.getByRole('link', { name: /Ver carrito completo/i }).click();
    await expect(page).toHaveURL(/\/carrito$/);
    await expect(
      page.getByRole('link', { name: /Ver carrito \(1 artículos\)/ }),
    ).toBeVisible();
  });
});
