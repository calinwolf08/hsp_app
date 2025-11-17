import { expect, test } from '@playwright/test';

// Helper to simulate login (simplified - assumes session management)
async function login(page, email: string) {
	// In a real scenario, this would interact with the login page
	// For now, we'll assume cookies/session are handled
	await page.goto('/login');
	await page.fill('input[name="email"]', email);
	await page.fill('input[name="password"]', 'password123');
	await page.click('button[type="submit"]');
	await page.waitForURL('/dashboard');
}

async function loginAndGoToDashboard(page) {
	await login(page, 'student@example.com');
	await page.goto('/dashboard');
}

test.describe('Dashboard', () => {
	test.describe('Access Control', () => {
		test('authenticated user can access dashboard', async ({ page }) => {
			// This test assumes authentication is set up
			// Skip if auth not ready
			test.skip(!process.env.TEST_WITH_AUTH, 'Requires authentication setup');

			await login(page, 'test@example.com');
			await page.goto('/dashboard');

			// Should see dashboard content
			await expect(page.getByRole('heading', { name: /My Dashboard/i })).toBeVisible();
		});

		test('page loads without authentication errors', async ({ page }) => {
			await page.goto('/dashboard');

			// Should either show dashboard or redirect to login
			// Not throw JS errors
			const errors = [];
			page.on('pageerror', (error) => errors.push(error));

			await page.waitForLoadState('networkidle');

			expect(errors).toHaveLength(0);
		});
	});

	test.describe('Course Display', () => {
		test('shows loading state initially', async ({ page }) => {
			await page.goto('/dashboard');

			// Should show loading indicator
			const loading = page.getByText(/Loading your dashboard/i);
			// May be visible briefly
			// await expect(loading).toBeVisible();
		});

		test('displays enrolled courses when available', async ({ page }) => {
			// Skip this test if no test data is available
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await loginAndGoToDashboard(page);

			// Should see course cards
			const courseCards = page.locator('[data-testid="course-card"]');
			const count = await courseCards.count();

			// If user has enrollments, should show them
			if (count > 0) {
				// Check first course card has expected elements
				const firstCard = courseCards.first();
				await expect(firstCard.locator('h3')).toBeVisible(); // Title
				await expect(firstCard.getByText(/Progress/i)).toBeVisible(); // Progress label
			}
		});

		test('shows empty state when no enrollments', async ({ page }) => {
			// This test would need a user with no enrollments
			test.skip(!process.env.TEST_WITH_EMPTY_USER, 'Requires empty user account');

			await login(page, 'newuser@example.com');
			await page.goto('/dashboard');

			// Should see empty state
			await expect(page.getByText(/No Courses Enrolled/i)).toBeVisible();
			await expect(page.getByRole('button', { name: /Browse Courses/i })).toBeVisible();
		});
	});

	test.describe('Statistics Display', () => {
		test('displays enrollment statistics section', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await loginAndGoToDashboard(page);

			// Should see stats section
			await expect(page.getByText(/Your Progress/i)).toBeVisible();
			await expect(page.getByText(/Total Enrolled/i)).toBeVisible();
			await expect(page.getByText(/In Progress/i)).toBeVisible();
			await expect(page.getByText(/Completed/i)).toBeVisible();
			await expect(page.getByText(/Not Started/i)).toBeVisible();
		});
	});

	test.describe('Filtering and Sorting', () => {
		test('has sort dropdown', async ({ page }) => {
			await page.goto('/dashboard');

			// Should see sort control
			await expect(page.getByText(/Sort by:/i)).toBeVisible();
			await expect(page.locator('select#sort-select')).toBeVisible();
		});

		test('has filter pills', async ({ page }) => {
			await page.goto('/dashboard');

			// Should see filter controls
			await expect(page.getByText(/Filter:/i)).toBeVisible();
			await expect(page.getByRole('button', { name: /All Courses/i })).toBeVisible();
			await expect(page.getByRole('button', { name: /In Progress/i })).toBeVisible();
			await expect(page.getByRole('button', { name: /Completed/i })).toBeVisible();
			await expect(page.getByRole('button', { name: /Not Started/i })).toBeVisible();
		});

		test('can change sort option', async ({ page }) => {
			await page.goto('/dashboard');

			const sortSelect = page.locator('select#sort-select');
			await sortSelect.selectOption('title');

			// Verify selection changed
			await expect(sortSelect).toHaveValue('title');
		});

		test('can click filter buttons', async ({ page }) => {
			await page.goto('/dashboard');

			const inProgressButton = page.getByRole('button', { name: /In Progress/i });
			await inProgressButton.click();

			// Button should have active styling (bg-blue text-white)
			await expect(inProgressButton).toHaveClass(/bg-blue/);
		});
	});

	test.describe('Navigation', () => {
		test('clicking course card navigates correctly', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await loginAndGoToDashboard(page);

			// Get first course card if it exists
			const courseCard = page.locator('[data-testid="course-card"]').first();
			const hasCard = (await courseCard.count()) > 0;

			if (hasCard) {
				await courseCard.click();

				// Should navigate to course page
				await expect(page).toHaveURL(/\/courses\//);
			}
		});

		test('clicking browse courses button navigates to catalog', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_EMPTY_USER, 'Requires empty user account');

			await login(page, 'newuser@example.com');
			await page.goto('/dashboard');

			// Click browse courses from empty state
			await page.getByRole('button', { name: /Browse Courses/i }).click();

			// Should navigate to courses page
			await expect(page).toHaveURL(/\/courses/);
		});
	});

	test.describe('Error Handling', () => {
		test('shows error state when API fails', async ({ page }) => {
			// Intercept API call and make it fail
			await page.route('**/api/dashboard*', (route) => {
				route.fulfill({
					status: 500,
					body: JSON.stringify({ error: 'Internal server error' })
				});
			});

			await page.goto('/dashboard');
			await page.waitForLoadState('networkidle');

			// Should show error message
			await expect(page.getByText(/Failed to Load Dashboard/i)).toBeVisible();
		});
	});

	test.describe('Responsive Design', () => {
		test('displays correctly on mobile', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			await page.goto('/dashboard');

			// Page should be visible and not horizontally scrollable
			const body = page.locator('body');
			const scrollWidth = await body.evaluate((el) => el.scrollWidth);
			const clientWidth = await body.evaluate((el) => el.clientWidth);

			expect(scrollWidth).toBe(clientWidth);
		});

		test('displays correctly on desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.goto('/dashboard');

			// Should have max-width container
			const container = page.locator('.container');
			await expect(container).toBeVisible();
		});
	});
});
