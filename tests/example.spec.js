// @ts-check
import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');
//
//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });
//
// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');
//
//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();
//
//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

// test('check heading', async ({page}) => {
//   await page.goto('http://localhost:3000/');
//   await expect(page.getByRole('heading', {name: "All reviews"})).toBeVisible();
// })

test('add review', async ({page}) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', {name: "Add review"}).click();

  await page.getByRole("textbox", {name: "Company"}).fill("kedi");
  await page.keyboard.press('Tab');

  // await page.getByRole("textbox", {name: "Rating"}).fill("5");
  await page.locator('input[placeholder="1-5"]').fill('5');
  await page.keyboard.press('Tab');

  await page.getByRole("textbox", {name: "Review"}).fill('kedikedikedi');
  await page.keyboard.press('Tab');

  await page.getByRole("button", {name: "Send"}).click();
})