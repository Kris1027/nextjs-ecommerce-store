import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Categories', path: '/categories' },
  { name: 'Cart', path: '/cart' },
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' },
];

for (const { name, path } of PAGES) {
  test(`${name} page has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test('skip-to-content link works', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');

  const skipLink = page.getByText('Skip to content');
  await expect(skipLink).toBeFocused();

  await page.keyboard.press('Enter');

  const main = page.locator('#main-content');
  await expect(main).toBeAttached();
  await expect(page).toHaveURL(/#main-content$/);
  await expect(main).toBeFocused();
});

test('keyboard navigation works in header', async ({ page }) => {
  await page.goto('/');

  // Tab through skip link
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to content')).toBeFocused();

  // Tab to first interactive element in header (mobile nav or store link)
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toBeAttached();
});
