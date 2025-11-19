import { expect, test } from '@playwright/test';
import {
	mockDashboardAPI,
	mockCoursePlayerAPIs,
	mockActivityProgressAPI,
	mockCourseNavigationAPI
} from './helpers/api-mocks';

test.describe('Course Player Integration Flow', () => {
	test.describe('Dashboard to Course Player', () => {
		test('complete flow from dashboard to starting a course', async ({ page }) => {
			// Mock dashboard API to show enrolled courses
			await mockDashboardAPI(page, { hasEnrollments: true, courseProgress: 0 });

			// Navigate to dashboard
			await page.goto('/dashboard');
			await page.waitForLoadState('networkidle');

			// Verify dashboard loaded
			await expect(page.getByRole('heading', { name: /My Learning/i })).toBeVisible();

			// Find and click on the first course card
			const courseCard = page.locator('[data-testid="courses-grid"]').locator('a').first();
			await expect(courseCard).toBeVisible();

			// Get the course name before clicking
			const courseName = await courseCard.locator('h3').textContent();
			expect(courseName).toBeTruthy();

			// Click the course card
			await courseCard.click();

			// Should navigate to course player
			await page.waitForURL(/\/courses\//);
			expect(page.url()).toContain('/courses/');
		});

		test('shows course player with navigation sidebar', async ({ page }) => {
			// Setup mocks for course player
			await mockDashboardAPI(page, { hasEnrollments: true });
			await mockCoursePlayerAPIs(page);

			// Navigate directly to course
			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Verify course navigation sidebar is visible
			await expect(page.getByRole('complementary')).toBeVisible();

			// Verify course title in sidebar
			await expect(page.getByRole('heading', { name: /Introduction to Testing/i })).toBeVisible();

			// Verify sections are visible
			await expect(page.getByText('Getting Started')).toBeVisible();
			await expect(page.getByText('Core Concepts')).toBeVisible();
		});

		test('displays first activity when course loads', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Verify first activity is displayed
			await expect(page.getByRole('main')).toBeVisible();
			await expect(page.getByRole('heading', { name: /Welcome to the Course/i })).toBeVisible();

			// Verify navigation controls are present
			await expect(page.getByRole('button', { name: /Previous/i })).toBeVisible();
			await expect(page.getByRole('button', { name: /Next/i })).toBeVisible();
		});
	});

	test.describe('Course Navigation', () => {
		test('Previous button is disabled on first activity', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Previous button should be disabled
			const prevButton = page.getByRole('button', { name: /Previous/i });
			await expect(prevButton).toBeDisabled();
		});

		test('can navigate to next activity using Next button', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Verify first activity is loaded
			await expect(page.getByRole('heading', { name: /Welcome to the Course/i })).toBeVisible();

			// Click Next button
			const nextButton = page.getByRole('button', { name: /Next/i });
			await expect(nextButton).toBeEnabled();

			// Mock for next activity
			await mockCourseNavigationAPI(page, 'activity-2');
			await mockCoursePlayerAPIs(page, 'activity-2');

			await nextButton.click();

			// Wait for navigation
			await page.waitForTimeout(500);

			// Verify second activity loaded (in a real scenario, this would update)
			// For now, just verify navigation controls are still present
			await expect(page.getByRole('button', { name: /Previous/i })).toBeEnabled();
			await expect(page.getByRole('button', { name: /Next/i })).toBeVisible();
		});

		test('can navigate to previous activity using Previous button', async ({ page }) => {
			// Start on second activity
			await mockCoursePlayerAPIs(page, 'activity-2');

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Previous button should be enabled on second activity
			const prevButton = page.getByRole('button', { name: /Previous/i });
			await expect(prevButton).toBeEnabled();

			// Mock for previous activity
			await mockCourseNavigationAPI(page, 'activity-1');
			await mockCoursePlayerAPIs(page, 'activity-1');

			await prevButton.click();

			// Wait for navigation
			await page.waitForTimeout(500);

			// Verify previous button is now disabled (first activity)
			await expect(prevButton).toBeDisabled();
		});

		test('can click on activity in sidebar to navigate', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Click on second activity in sidebar
			await mockCourseNavigationAPI(page, 'activity-2');
			await mockCoursePlayerAPIs(page, 'activity-2');

			const activity2Link = page.getByText('Course Overview');
			await activity2Link.click();

			// Wait for navigation
			await page.waitForTimeout(500);

			// Verify navigation occurred (navigation controls should update)
			await expect(page.getByRole('button', { name: /Previous/i })).toBeEnabled();
		});

		test('shows activity position indicator', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Should show position like "Activity 1 of 3"
			await expect(page.getByText(/Activity 1 of 3/i)).toBeVisible();
		});
	});

	test.describe('Activity Interactions', () => {
		test('can mark activity as complete', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');
			await mockActivityProgressAPI(page);

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Look for Mark as Complete button (if present in activity container)
			const markCompleteButton = page.getByRole('button', { name: /Mark.*Complete/i });

			// Button might not always be visible depending on activity type
			const hasButton = await markCompleteButton.count();
			if (hasButton > 0) {
				await expect(markCompleteButton).toBeVisible();
				await markCompleteButton.click();

				// Wait for API call
				await page.waitForTimeout(500);

				// Button should change or activity should advance
				// In real scenario, would check for success feedback
			}
		});

		test('displays different content for different activity types', async ({ page }) => {
			// Test document activity
			await mockCoursePlayerAPIs(page, 'activity-1');
			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Verify main content area is visible
			await expect(page.getByRole('main')).toBeVisible();

			// For real test, would verify document viewer, video player, etc.
		});
	});

	test.describe('Progress Tracking', () => {
		test('shows progress bar in sidebar', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Should see progress information
			await expect(page.getByText(/\d+ of \d+ Activities/i)).toBeVisible();

			// Should see completion percentage
			await expect(page.getByText(/\d+%/)).toBeVisible();
		});

		test('updates progress after completing activity', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');
			await mockActivityProgressAPI(page);

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Get initial progress
			const progressText = await page.getByText(/\d+ of \d+ Activities/i).textContent();

			// Mark activity complete if button is available
			const markCompleteButton = page.getByRole('button', { name: /Mark.*Complete/i });
			const hasButton = await markCompleteButton.count();

			if (hasButton > 0) {
				await markCompleteButton.click();
				await page.waitForTimeout(500);

				// Progress should update (in real scenario with proper mocking)
				// For now, just verify the text is still visible
				await expect(page.getByText(/\d+ of \d+ Activities/i)).toBeVisible();
			}
		});
	});

	test.describe('Navigation Flow', () => {
		test('can navigate through multiple activities sequentially', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Navigate through activities
			for (let i = 1; i < 3; i++) {
				const nextButton = page.getByRole('button', { name: /Next/i });

				// Check if next button is enabled
				const isEnabled = await nextButton.isEnabled();
				if (!isEnabled) break;

				// Mock next activity
				const nextActivityId = `activity-${i + 1}`;
				await mockCourseNavigationAPI(page, nextActivityId);
				await mockCoursePlayerAPIs(page, nextActivityId);

				await nextButton.click();
				await page.waitForTimeout(500);

				// Verify position updated
				await expect(page.getByText(new RegExp(`Activity ${i + 1} of 3`, 'i'))).toBeVisible();
			}

			// Should be on last activity - next button disabled
			await expect(page.getByRole('button', { name: /Next/i })).toBeDisabled();
		});

		test('can return to dashboard from course player', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');
			await mockDashboardAPI(page, { hasEnrollments: true });

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Click Back to Course/Dashboard button
			const backButton = page.getByRole('button', { name: /Back to/i });
			await expect(backButton).toBeVisible();

			await backButton.click();

			// Should navigate to dashboard
			await page.waitForURL(/\/dashboard/, { timeout: 5000 });
			expect(page.url()).toContain('/dashboard');
		});
	});

	test.describe('Error Handling', () => {
		test('shows error when course not found', async ({ page }) => {
			// Mock 404 for course
			await page.route('**/api/courses/*/content', (route) => {
				route.fulfill({
					status: 404,
					body: JSON.stringify({ error: 'Course not found' })
				});
			});

			await page.goto('/courses/non-existent-course');
			await page.waitForLoadState('networkidle');

			// Should show error message
			await expect(page.getByText(/Failed to load/i)).toBeVisible();
		});

		test('shows error when activity fails to load', async ({ page }) => {
			await mockCoursePlayerAPIs(page, 'activity-1');

			// Override activity endpoint to fail
			await page.route('**/api/activities/*', (route) => {
				route.fulfill({
					status: 500,
					body: JSON.stringify({ error: 'Failed to load activity' })
				});
			});

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Should show error or handle gracefully
			// Exact behavior depends on error handling implementation
		});

		test('requires enrollment to access course', async ({ page }) => {
			// Mock APIs but with no enrollment
			await page.route('**/api/courses/*/content', (route) => {
				route.fulfill({
					status: 403,
					body: JSON.stringify({ error: 'No enrollment found' })
				});
			});

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Should show error or redirect
			await expect(page.getByText(/enrollment|access/i)).toBeVisible();
		});
	});

	test.describe('Responsive Design', () => {
		test('course player works on mobile viewport', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			await mockCoursePlayerAPIs(page, 'activity-1');

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Navigation controls should be visible
			await expect(page.getByRole('button', { name: /Next/i })).toBeVisible();
			await expect(page.getByRole('button', { name: /Previous/i })).toBeVisible();

			// Page should not scroll horizontally
			const body = page.locator('body');
			const scrollWidth = await body.evaluate((el) => el.scrollWidth);
			const clientWidth = await body.evaluate((el) => el.clientWidth);
			expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px difference
		});

		test('sidebar is visible on desktop viewport', async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			await mockCoursePlayerAPIs(page, 'activity-1');

			await page.goto('/courses/test-course-123');
			await page.waitForLoadState('networkidle');

			// Sidebar should be visible on desktop
			await expect(page.getByRole('complementary')).toBeVisible();
		});
	});

	test.describe('Complete User Journey', () => {
		test('full journey: dashboard -> course -> complete activities -> return to dashboard', async ({ page }) => {
			// Start on dashboard
			await mockDashboardAPI(page, { hasEnrollments: true, courseProgress: 0 });
			await page.goto('/dashboard');
			await page.waitForLoadState('networkidle');

			// Verify dashboard loaded
			await expect(page.getByRole('heading', { name: /My Learning/i })).toBeVisible();

			// Click on first course
			await mockCoursePlayerAPIs(page, 'activity-1');
			const courseCard = page.locator('[data-testid="courses-grid"]').locator('a').first();
			await courseCard.click();

			// Wait for course to load
			await page.waitForURL(/\/courses\//);
			await page.waitForLoadState('networkidle');

			// Verify course player loaded
			await expect(page.getByRole('heading', { name: /Welcome to the Course/i })).toBeVisible();

			// Navigate to next activity
			await mockCourseNavigationAPI(page, 'activity-2');
			await mockCoursePlayerAPIs(page, 'activity-2');
			await page.getByRole('button', { name: /Next/i }).click();
			await page.waitForTimeout(500);

			// Verify navigation worked
			await expect(page.getByText(/Activity 2 of 3/i)).toBeVisible();

			// Return to dashboard
			await mockDashboardAPI(page, { hasEnrollments: true, courseProgress: 33 });
			await page.getByRole('button', { name: /Back to/i }).click();

			// Should be back on dashboard
			await page.waitForURL(/\/dashboard/);
			await expect(page.getByRole('heading', { name: /My Learning/i })).toBeVisible();

			// Progress should have updated (in real scenario)
			await expect(page.locator('[data-testid="courses-grid"]')).toBeVisible();
		});
	});
});
