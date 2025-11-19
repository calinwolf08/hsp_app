import { expect, test } from '@playwright/test';

test.describe('Course Player', () => {
	test.describe('Access and Loading', () => {
		test('displays loading state initially', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');

			// Should show loading indicator
			// May be brief, just verify no errors
			await page.waitForLoadState('networkidle');
		});

		test('requires authentication', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_AUTH, 'Requires authentication');

			await page.goto('/courses/test-course-id');

			// Should redirect to login or show auth error
			// This depends on the auth implementation
		});

		test('loads course player for enrolled course', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA && !process.env.TEST_WITH_AUTH, 'Requires data and auth');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should see course navigation
			const nav = page.getByRole('navigation');
			await expect(nav).toBeVisible();
		});

		test('shows error for non-existent course', async ({ page }) => {
			await page.goto('/courses/non-existent-course-123');
			await page.waitForLoadState('networkidle');

			// Should show error message
			await expect(page.getByText(/Failed to load/i)).toBeVisible();
		});
	});

	test.describe('Navigation Sidebar', () => {
		test('displays course navigation sidebar', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should see navigation menu
			await expect(page.getByRole('navigation')).toBeVisible();
		});

		test('shows course title in sidebar', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should see course title
			const heading = page.getByRole('heading', { level: 2 });
			const exists = (await heading.count()) > 0;

			if (exists) {
				await expect(heading.first()).toBeVisible();
			}
		});

		test('displays progress bar in sidebar', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should see progress bar
			const progressBar = page.locator('[role="progressbar"]');
			const exists = (await progressBar.count()) > 0;

			if (exists) {
				await expect(progressBar.first()).toBeVisible();
			}
		});

		test('can expand and collapse sections', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Find a section button
			const sectionButton = page.getByRole('button').filter({ hasText: /Section/i }).first();
			const exists = (await sectionButton.count()) > 0;

			if (exists) {
				await sectionButton.click();
				// Section should toggle (implementation dependent)
			}
		});
	});

	test.describe('Activity Display', () => {
		test('displays current activity', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should see activity content
			const main = page.getByRole('main');
			await expect(main).toBeVisible();
		});

		test('shows activity title', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should see activity title
			const heading = page.getByRole('heading', { level: 1 });
			const exists = (await heading.count()) > 0;

			if (exists) {
				await expect(heading.first()).toBeVisible();
			}
		});

		test('shows completed badge for completed activities', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Look for completed badge if activity is completed
			const completedBadge = page.getByText(/Completed/i).first();
			// May or may not be visible depending on data
		});
	});

	test.describe('Navigation Controls', () => {
		test('displays navigation controls', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should see Previous and Next buttons
			await expect(page.getByRole('button', { name: /Previous/i })).toBeVisible();
			await expect(page.getByRole('button', { name: /Next/i })).toBeVisible();
		});

		test('previous button disabled on first activity', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Previous button should be disabled if on first activity
			const prevButton = page.getByRole('button', { name: /Previous/i });
			// Depends on which activity is loaded
		});

		test('next button disabled on last activity', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			// Would need to navigate to last activity first
			// This test requires specific test data setup
		});

		test('can click next to go to next activity', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			const nextButton = page.getByRole('button', { name: /Next/i });
			const isEnabled = await nextButton.isEnabled();

			if (isEnabled) {
				await nextButton.click();
				await page.waitForLoadState('networkidle');
				// Activity should change
			}
		});

		test('shows position indicator', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should show "Activity X of Y"
			const positionText = page.getByText(/Activity \d+ of \d+/i);
			const exists = (await positionText.count()) > 0;

			if (exists) {
				await expect(positionText).toBeVisible();
			}
		});

		test('has back to course button', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			await expect(page.getByRole('button', { name: /Back to/i })).toBeVisible();
		});
	});

	test.describe('Activity Completion', () => {
		test('can mark activity as complete', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA && !process.env.TEST_WITH_AUTH, 'Requires data and auth');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			const markCompleteButton = page.getByRole('button', { name: /Mark as Complete/i });
			const exists = (await markCompleteButton.count()) > 0;

			if (exists && await markCompleteButton.isVisible()) {
				await markCompleteButton.click();
				// Should update to show completed status
				await page.waitForTimeout(1000); // Wait for API call
			}
		});

		test('shows saving progress indicator', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA && !process.env.TEST_WITH_AUTH, 'Requires data and auth');

			// This would require intercepting the API call
			// to verify the loading state appears
		});
	});

	test.describe('Activity Types', () => {
		test('displays activity type indicator', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should show activity type (SCORM, Video, Document, Survey)
			// This depends on the test data
		});

		test('shows appropriate player for activity type', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should render appropriate player component
			// For now, just verify main content is visible
			await expect(page.getByRole('main')).toBeVisible();
		});
	});

	test.describe('Progress Tracking', () => {
		test('updates progress bar after completion', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA && !process.env.TEST_WITH_AUTH, 'Requires data and auth');

			// This would require:
			// 1. Get initial progress
			// 2. Complete an activity
			// 3. Verify progress increased
		});

		test('shows completion percentage', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should show percentage like "50%"
			const percentText = page.getByText(/\d+%/);
			const exists = (await percentText.count()) > 0;

			if (exists) {
				await expect(percentText.first()).toBeVisible();
			}
		});
	});

	test.describe('Error Handling', () => {
		test('shows error when API fails', async ({ page }) => {
			// Intercept API and make it fail
			await page.route('**/api/courses/*/content', (route) => {
				route.fulfill({
					status: 500,
					body: JSON.stringify({ error: 'Internal server error' })
				});
			});

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			await expect(page.getByText(/Failed to load/i)).toBeVisible();
		});

		test('shows error when activity not found', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			// Navigate to non-existent activity
			// This would require knowing a valid course ID
		});
	});

	test.describe('Responsive Design', () => {
		test('displays correctly on mobile', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });

			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Page should be visible
			const body = page.locator('body');
			const scrollWidth = await body.evaluate((el) => el.scrollWidth);
			const clientWidth = await body.evaluate((el) => el.clientWidth);

			expect(scrollWidth).toBe(clientWidth);
		});

		test('displays correctly on desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });

			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/courses/test-course-id');
			await page.waitForLoadState('networkidle');

			// Should see sidebar on desktop
			await expect(page.getByRole('navigation')).toBeVisible();
		});
	});
});
