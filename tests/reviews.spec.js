import { expect, test } from '@playwright/test';

const reviews = [
  {
    id: 'review-kedi',
    userId: 'user-1',
    userName: 'Olena',
    company: 'Kedi',
    rating: '5',
    review: 'Great remote team',
    date: '2026-08-21T10:00:00.000Z',
  },
  {
    id: 'review-kopek',
    userId: 'user-2',
    userName: 'Ihor',
    company: 'Kopek',
    rating: '2',
    review: 'Needs better communication',
    date: '2026-07-15T10:00:00.000Z',
  },
];

async function mockReviewsApi(page) {
  await page.route('**/get-companies', async (route) => {
    await route.fulfill({ json: ['Kedi', 'Kopek'] });
  });

  await page.route('**/get-reviews**', async (route) => {
    const requestUrl = new URL(route.request().url());
    const company = requestUrl.searchParams.get('company');
    const search = requestUrl.searchParams.get('search')?.toLowerCase();
    const sort = requestUrl.searchParams.get('sort');
    const pageNumber = Number(requestUrl.searchParams.get('page')) || 1;
    const limit = Number(requestUrl.searchParams.get('limit')) || 10;

    let items = reviews.filter((review) => !company || review.company === company);

    if (search) {
      items = items.filter((review) =>
        [review.company, review.userName, review.review]
          .some((value) => value.toLowerCase().includes(search)),
      );
    }

    if (sort === 'rating_low_to_high') {
      items = [...items].sort((first, second) => Number(first.rating) - Number(second.rating));
    }

    await route.fulfill({
      json: {
        page: pageNumber,
        limit,
        items,
        totalItems: items.length,
        totalPages: items.length ? 1 : 0,
      },
    });
  });
}

async function openReviewsPage(page) {
  await mockReviewsApi(page);
  await page.goto('/html/reviews');
  await expect(page.locator('.review-item')).toHaveCount(2);
}

test.describe('Reviews page', () => {
  test('loads reviews, companies, and pagination', async ({ page }) => {
    await openReviewsPage(page);

    await expect(page.getByRole('heading', { name: 'All reviews' })).toBeVisible();
    await expect(page.locator('.review-item').first()).toContainText('Kedi');
    await expect(page.locator('.review-item').first()).toContainText('Olena');
    await expect(page.locator('#filterBar option')).toHaveText(['All companies', 'Kedi', 'Kopek']);
    await expect(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  test('filters, searches, and sorts reviews', async ({ page }) => {
    await openReviewsPage(page);

    const filterRequest = page.waitForRequest((request) =>
      request.url().includes('/get-reviews?page=1&limit=10&company=Kedi'),
    );
    await page.locator('#filterBar').selectOption('Kedi');
    await filterRequest;
    await expect(page.locator('.review-item')).toHaveCount(1);
    await expect(page.locator('.review-item')).toContainText('Great remote team');

    const searchRequest = page.waitForRequest((request) =>
      request.url().includes('search=remote'),
    );
    await page.locator('#searchBar').fill('remote');
    await searchRequest;
    await expect(page.locator('.review-item')).toHaveCount(1);
    await expect(page.locator('.review-item')).toContainText('Great remote team');

    const clearSearchRequest = page.waitForRequest((request) =>
      request.url().includes('/get-reviews?page=1&limit=10'),
    );
    await page.locator('#searchBar').fill('');
    await clearSearchRequest;
    const sortRequest = page.waitForRequest((request) =>
      request.url().includes('sort=rating_low_to_high'),
    );
    await page.locator('#filterBar').selectOption('');
    await page.locator('#sortBar').selectOption('rating_low_to_high');
    await sortRequest;
    await expect(page.locator('.review-item').first()).toContainText('Kopek');
  });

  test('submits a review without changing fixture data', async ({ page }) => {
    await mockReviewsApi(page);
    let submittedReview;
    await page.route('**/submit-review', async (route) => {
      submittedReview = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        json: { id: 'new-review', userId: null, success: true },
      });
    });

    await page.goto('/html/reviews');
    await expect(page.locator('.review-item')).toHaveCount(2);

    await page.getByRole('button', { name: 'Add review' }).click();
    await expect(page.locator('#reviewForm')).toBeVisible();
    await expect(page.locator('#personalData')).toBeVisible();

    await page.locator('#company').click();
    await expect(page.getByRole('listitem')).toHaveText(['Kedi', 'Kopek']);
    await page.locator('#results li').filter({ hasText: /^Kedi$/ }).click();
    await page.getByLabel('Rating').fill('5');
    await page.getByLabel('Review').fill('Excellent product culture');
    await expect(page.locator('.js-current-count')).toHaveText('25');

    await page.getByRole('button', { name: 'Send' }).click();

    await expect.poll(() => submittedReview).toEqual({
      company: 'Kedi',
      rating: '5',
      review: 'Excellent product culture',
      date: expect.any(String),
    });
    await expect(page.locator('.review-item')).toHaveCount(3);
    await expect(page.locator('.review-item').last()).toContainText('Excellent product culture');
    await expect(page.locator('#reviewForm')).toBeHidden();
  });
});
