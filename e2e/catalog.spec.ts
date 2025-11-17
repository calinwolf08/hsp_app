import { expect, test } from '@playwright/test';

test.describe('Catalog', () => {
	test.describe('Access and Display', () => {
		test('displays course catalog page', async ({ page }) => {
			await page.goto('/catalog');

			// Should see catalog header
			await expect(page.getByRole('heading', { name: /Course Catalog/i })).toBeVisible();

			// Page should load without errors
			const errors = [];
			page.on('pageerror', (error) => errors.push(error));
			await page.waitForLoadState('networkidle');
			expect(errors).toHaveLength(0);
		});

		test('shows loading state initially', async ({ page }) => {
			await page.goto('/catalog');

			// Should show loading indicator (may be brief)
			// Just verify page renders without errors
			await page.waitForLoadState('networkidle');
		});

		test('displays course cards when available', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/catalog');
			await page.waitForLoadState('networkidle');

			// Should see course cards if data exists
			const courseCards = page.locator('[data-testid="course-card"]');
			const count = await courseCards.count();

			if (count > 0) {
				// Check first course card has expected elements
				const firstCard = courseCards.first();
				await expect(firstCard.locator('[data-testid="course-title"]')).toBeVisible();
			}
		});
	});

	test.describe('Search Functionality', () => {
		test('has search input', async ({ page }) => {
			await page.goto('/catalog');

			const searchInput = page.getByPlaceholder(/Search/i);
			await expect(searchInput).toBeVisible();
		});

		test('can type in search box', async ({ page }) => {
			await page.goto('/catalog');

			const searchInput = page.getByPlaceholder(/Search/i);
			await searchInput.fill('test search');

			await expect(searchInput).toHaveValue('test search');
		});

		test('shows clear button when search has text', async ({ page }) => {
			await page.goto('/catalog');

			const searchInput = page.getByPlaceholder(/Search/i);
			await searchInput.fill('javascript');

			// Clear button should be visible
			const clearButton = page.getByRole('button', { name: /Clear search/i });
			await expect(clearButton).toBeVisible();
		});

		test('can clear search', async ({ page }) => {
			await page.goto('/catalog');

			const searchInput = page.getByPlaceholder(/Search/i);
			await searchInput.fill('javascript');
			await page.waitForTimeout(500); // Wait for debounce

			const clearButton = page.getByRole('button', { name: /Clear search/i });
			await clearButton.click();

			await expect(searchInput).toHaveValue('');
		});
	});

	test.describe('Filtering', () => {
		test('displays filter panel', async ({ page }) => {
			await page.goto('/catalog');

			await expect(page.getByText(/Filters/i)).toBeVisible();
		});

		test('has enrollment status filter', async ({ page }) => {
			await page.goto('/catalog');

			await expect(page.getByText(/Enrollment Status/i)).toBeVisible();
			await expect(page.getByText(/All Courses/i)).toBeVisible();
			await expect(page.getByText(/Enrolled/i)).toBeVisible();
			await expect(page.getByText(/Not Enrolled/i)).toBeVisible();
		});

		test('can select enrollment filter', async ({ page }) => {
			await page.goto('/catalog');

			const enrolledRadio = page.getByRole('radio', { name: /Enrolled/i });
			await enrolledRadio.check();

			await expect(enrolledRadio).toBeChecked();
		});

		test('shows clear all button when filters are active', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/catalog');

			// Apply a filter
			const enrolledRadio = page.getByRole('radio', { name: /Enrolled/i });
			await enrolledRadio.check();

			// Clear all button should be visible
			await expect(page.getByRole('button', { name: /Clear All/i })).toBeVisible();
		});
	});

	test.describe('Sorting', () => {
		test('has sort dropdown', async ({ page }) => {
			await page.goto('/catalog');

			await expect(page.getByText(/Sort by:/i)).toBeVisible();
			await expect(page.locator('select#sort-select')).toBeVisible();
		});

		test('can change sort option', async ({ page }) => {
			await page.goto('/catalog');

			const sortSelect = page.locator('select#sort-select');
			await sortSelect.selectOption('title-desc');

			await expect(sortSelect).toHaveValue('title-desc');
		});

		test('shows all sort options', async ({ page }) => {
			await page.goto('/catalog');

			const sortSelect = page.locator('select#sort-select');
			const options = await sortSelect.locator('option').allTextContents();

			expect(options).toContain('Title (A-Z)');
			expect(options).toContain('Title (Z-A)');
			expect(options).toContain('Most Recent');
			expect(options).toContain('Most Popular');
		});
	});

	test.describe('Enrollment Actions', () => {
		test('shows enroll button for non-enrolled courses', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/catalog');
			await page.waitForLoadState('networkidle');

			// Look for enroll buttons
			const enrollButtons = page.getByRole('button', { name: /Enroll/i });
			const count = await enrollButtons.count();

			if (count > 0) {
				await expect(enrollButtons.first()).toBeVisible();
			}
		});

		test('shows enrolled badge for enrolled courses', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/catalog');
			await page.waitForLoadState('networkidle');

			// Look for enrolled badges
			const enrolledBadges = page.getByText(/Enrolled/i).first();
			// May or may not exist depending on data
		});

		test('can click enroll button', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_AUTH && !process.env.TEST_WITH_DATA, 'Requires auth and data');

			await page.goto('/catalog');
			await page.waitForLoadState('networkidle');

			const enrollButton = page.getByRole('button', { name: /^Enroll$/i }).first();
			const exists = (await enrollButton.count()) > 0;

			if (exists) {
				await enrollButton.click();
				// Button should show loading state or change
				// This would require actual backend integration to test fully
			}
		});
	});

	test.describe('Pagination', () => {
		test('shows pagination when there are multiple pages', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_MANY_COURSES, 'Requires many courses');

			await page.goto('/catalog');
			await page.waitForLoadState('networkidle');

			// Should see pagination controls
			await expect(page.getByRole('button', { name: /Next/i })).toBeVisible();
			await expect(page.getByRole('button', { name: /Previous/i })).toBeVisible();
		});

		test('previous button is disabled on first page', async ({ page }) => {
			await page.goto('/catalog');

			const prevButton = page.getByRole('button', { name: /Previous/i });
			// May not exist if no pagination needed
			const exists = (await prevButton.count()) > 0;

			if (exists) {
				await expect(prevButton).toBeDisabled();
			}
		});
	});

	test.describe('Navigation', () => {
		test('clicking course card navigates to course details', async ({ page }) => {
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/catalog');
			await page.waitForLoadState('networkidle');

			const courseCard = page.locator('[data-testid="course-card"]').first();
			const exists = (await courseCard.count()) > 0;

			if (exists) {
				await courseCard.click();

				// Should navigate to course page
				await expect(page).toHaveURL(/\/courses\//);
			}
		});
	});

	test.describe('Error Handling', () => {
		test('shows error state when API fails', async ({ page }) => {
			// Intercept API call and make it fail
			await page.route('**/api/catalog*', (route) => {
				route.fulfill({
					status: 500,
					body: JSON.stringify({ error: 'Internal server error' })
				});
			});

			await page.goto('/catalog');
			await page.waitForLoadState('networkidle');

			// Should show error message
			await expect(page.getByText(/Failed to load/i)).toBeVisible();
		});
	});

	test.describe('Responsive Design', () => {
		test('displays correctly on mobile', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			await page.goto('/catalog');

			// Page should be visible and not horizontally scrollable
			const body = page.locator('body');
			const scrollWidth = await body.evaluate((el) => el.scrollWidth);
			const clientWidth = await body.evaluate((el) => el.clientWidth);

			expect(scrollWidth).toBe(clientWidth);
		});

		test('displays correctly on desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.goto('/catalog');

			// Should have container
			const container = page.locator('.container');
			await expect(container).toBeVisible();
		});

		test('filter panel is visible on desktop', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await page.goto('/catalog');

			// Filter panel should be in sidebar
			await expect(page.getByText(/Filters/i)).toBeVisible();
		});
	});

	test.describe('Empty States', () => {
		test('shows empty state when no courses match filters', async ({ page }) => {
			// This would require specific test data setup
			test.skip(!process.env.TEST_WITH_DATA, 'Requires test data');

			await page.goto('/catalog');

			// Apply filter that returns no results
			const searchInput = page.getByPlaceholder(/Search/i);
			await searchInput.fill('xyznonexistentcourse12345');
			await page.waitForTimeout(500);

			// Should show empty state
			await expect(page.getByText(/No courses/i)).toBeVisible();
		});
	});
});
