import { Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load fixture data
const fixturesPath = join(__dirname, '../fixtures/courses.json');
const coursesFixture = JSON.parse(readFileSync(fixturesPath, 'utf-8'));

export interface MockOptions {
	hasEnrollments?: boolean;
	courseProgress?: number;
	activityProgress?: Record<string, 'not-started' | 'in-progress' | 'completed'>;
}

/**
 * Mock all dashboard API calls
 */
export async function mockDashboardAPI(page: Page, options: MockOptions = {}) {
	const { hasEnrollments = true, courseProgress = 0 } = options;

	// Mock dashboard data API
	await page.route('**/api/dashboard*', async (route) => {
		if (!hasEnrollments) {
			return route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					courses: [],
					stats: {
						totalEnrolled: 0,
						inProgress: 0,
						completed: 0,
						notStarted: 0,
						overallCompletionPercentage: 0
					}
				})
			});
		}

		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				courses: [
					{
						course: coursesFixture.testCourse,
						enrollment: {
							id: 'enrollment-1',
							user: 'user-1',
							course: coursesFixture.testCourse,
							isActive: true,
							enrolledAt: '2024-01-01T00:00:00.000Z',
							enrollmentSource: 'direct',
							createdAt: '2024-01-01T00:00:00.000Z',
							updatedAt: '2024-01-01T00:00:00.000Z'
						},
						progress: {
							id: 'progress-1',
							user: 'user-1',
							course: coursesFixture.testCourse.id,
							status: courseProgress > 0 ? 'in-progress' : 'not-started',
							startedAt: courseProgress > 0 ? '2024-01-02T00:00:00.000Z' : undefined,
							createdAt: '2024-01-01T00:00:00.000Z',
							updatedAt: '2024-01-02T00:00:00.000Z'
						},
						completionPercentage: courseProgress,
						status: courseProgress === 100 ? 'completed' : courseProgress > 0 ? 'in-progress' : 'not-started'
					}
				],
				stats: {
					totalEnrolled: 1,
					inProgress: courseProgress > 0 && courseProgress < 100 ? 1 : 0,
					completed: courseProgress === 100 ? 1 : 0,
					notStarted: courseProgress === 0 ? 1 : 0,
					overallCompletionPercentage: courseProgress
				}
			})
		});
	});
}

/**
 * Mock course content API
 */
export async function mockCourseContentAPI(page: Page) {
	await page.route('**/api/courses/*/content', async (route) => {
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				course: coursesFixture.testCourse,
				completionPercentage: 33,
				totalActivities: 3
			})
		});
	});
}

/**
 * Mock course navigation API
 */
export async function mockCourseNavigationAPI(page: Page, currentActivityId: string = 'activity-1') {
	await page.route('**/api/courses/*/navigation*', async (route) => {
		const url = route.request().url();
		const activityId = new URL(url).searchParams.get('activityId') || currentActivityId;

		// Determine position and navigation state
		const activities = ['activity-1', 'activity-2', 'activity-3'];
		const position = activities.indexOf(activityId) + 1;
		const total = activities.length;

		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				navigationTree: [
					{
						id: 'section-1',
						title: 'Getting Started',
						type: 'section',
						isCompleted: false,
						isActive: false,
						isCurrent: false,
						isLocked: false,
						order: 0
					},
					{
						id: 'activity-1',
						title: 'Welcome to the Course',
						type: 'activity',
						isCompleted: false,
						isActive: activityId === 'activity-1',
						isCurrent: activityId === 'activity-1',
						isLocked: false,
						sectionId: 'section-1',
						activityType: 'document',
						order: 1
					},
					{
						id: 'activity-2',
						title: 'Course Overview',
						type: 'activity',
						isCompleted: false,
						isActive: activityId === 'activity-2',
						isCurrent: activityId === 'activity-2',
						isLocked: false,
						sectionId: 'section-1',
						activityType: 'video',
						order: 2
					},
					{
						id: 'section-2',
						title: 'Core Concepts',
						type: 'section',
						isCompleted: false,
						isActive: false,
						isCurrent: false,
						isLocked: false,
						order: 3
					},
					{
						id: 'activity-3',
						title: 'Testing Fundamentals',
						type: 'activity',
						isCompleted: false,
						isActive: activityId === 'activity-3',
						isCurrent: activityId === 'activity-3',
						isLocked: false,
						sectionId: 'section-2',
						activityType: 'document',
						order: 4
					}
				],
				totalActivities: total,
				completedCount: 0,
				currentActivity: {
					activityId,
					position,
					totalActivities: total,
					nextActivityId: position < total ? activities[position] : null,
					previousActivityId: position > 1 ? activities[position - 2] : null,
					canNavigateNext: position < total,
					canNavigatePrevious: position > 1
				}
			})
		});
	});
}

/**
 * Mock activity API
 */
export async function mockActivityAPI(page: Page, activityId: string = 'activity-1') {
	await page.route('**/api/activities/*', async (route) => {
		const activity = {
			'activity-1': coursesFixture.testCourse.sections[0].section.activities[0].activity,
			'activity-2': coursesFixture.testCourse.sections[0].section.activities[1].activity,
			'activity-3': coursesFixture.testCourse.sections[1].section.activities[0].activity
		}[activityId];

		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				activity,
				progress: null
			})
		});
	});
}

/**
 * Mock activity progress update
 */
export async function mockActivityProgressAPI(page: Page) {
	await page.route('**/api/activities/*/progress', async (route) => {
		if (route.request().method() === 'POST') {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					progress: {
						id: 'progress-activity-1',
						user: 'user-1',
						activity: 'activity-1',
						status: 'completed',
						completedAt: new Date().toISOString(),
						createdAt: '2024-01-01T00:00:00.000Z',
						updatedAt: new Date().toISOString()
					}
				})
			});
		} else {
			route.continue();
		}
	});
}

/**
 * Mock enrollment check API
 */
export async function mockEnrollmentCheckAPI(page: Page, hasAccess: boolean = true) {
	await page.route('**/api/courses/*/enrollment', async (route) => {
		route.fulfill({
			status: hasAccess ? 200 : 403,
			contentType: 'application/json',
			body: JSON.stringify({
				hasAccess,
				enrollment: hasAccess ? {
					id: 'enrollment-1',
					user: 'user-1',
					course: 'test-course-123',
					isActive: true,
					enrolledAt: '2024-01-01T00:00:00.000Z',
					enrollmentSource: 'direct',
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				} : null
			})
		});
	});
}

/**
 * Setup all course player API mocks
 */
export async function mockCoursePlayerAPIs(page: Page, activityId: string = 'activity-1') {
	await mockCourseContentAPI(page);
	await mockCourseNavigationAPI(page, activityId);
	await mockActivityAPI(page, activityId);
	await mockActivityProgressAPI(page);
	await mockEnrollmentCheckAPI(page);
}
