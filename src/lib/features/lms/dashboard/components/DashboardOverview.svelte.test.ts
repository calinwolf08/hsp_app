import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import DashboardOverview from './DashboardOverview.svelte';
import type { DashboardData } from '../types';
import type { Course, CourseEnrollment, CourseProgress } from '../../shared/types';

describe('DashboardOverview', () => {
	afterEach(() => {
		cleanup();
	});

	const createMockCourse = (id: string, name: string): Course => ({
		id,
		name,
		internal_name: name.toLowerCase().replace(/\s+/g, '-'),
		slug: name.toLowerCase().replace(/\s+/g, '-'),
		description: {},
		published: true,
		categories: [],
		tags: [],
		sections: [],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	});

	const mockData: DashboardData = {
		stats: {
			totalEnrolled: 3,
			inProgress: 1,
			completed: 1,
			notStarted: 1,
			overallCompletionPercentage: 50
		},
		continueLearning: {
			course: createMockCourse('course-1', 'TypeScript Basics'),
			enrollment: {
				id: 'enroll-1',
				user: 'user-1',
				course: 'course-1',
				isActive: true,
				enrollmentSource: 'direct',
				enrolledAt: '2024-01-15',
				createdAt: '2024-01-15',
				updatedAt: '2024-01-15'
			},
			progress: {
				id: 'progress-1',
				user: 'user-1',
				course: 'course-1',
				status: 'in-progress',
				startedAt: '2024-01-15',
				createdAt: '2024-01-15',
				updatedAt: '2024-01-20'
			},
			completionPercentage: 50,
			status: 'in-progress'
		},
		courses: [
			{
				course: createMockCourse('course-1', 'TypeScript Basics'),
				enrollment: {
					id: 'enroll-1',
					user: 'user-1',
					course: 'course-1',
					isActive: true,
					enrollmentSource: 'direct',
					enrolledAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				progress: {
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'in-progress',
					startedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-20'
				},
				completionPercentage: 50,
				status: 'in-progress'
			},
			{
				course: createMockCourse('course-2', 'React Advanced'),
				enrollment: {
					id: 'enroll-2',
					user: 'user-1',
					course: 'course-2',
					isActive: true,
					enrollmentSource: 'direct',
					enrolledAt: '2024-01-10',
					createdAt: '2024-01-10',
					updatedAt: '2024-01-10'
				},
				progress: {
					id: 'progress-2',
					user: 'user-1',
					course: 'course-2',
					status: 'completed',
					startedAt: '2024-01-10',
					completedAt: '2024-01-18',
					createdAt: '2024-01-10',
					updatedAt: '2024-01-18'
				},
				completionPercentage: 100,
				status: 'completed'
			},
			{
				course: createMockCourse('course-3', 'Node.js Fundamentals'),
				enrollment: {
					id: 'enroll-3',
					user: 'user-1',
					course: 'course-3',
					isActive: true,
					enrollmentSource: 'direct',
					enrolledAt: '2024-01-05',
					createdAt: '2024-01-05',
					updatedAt: '2024-01-05'
				},
				progress: null,
				completionPercentage: 0,
				status: 'not-started'
			}
		]
	};

	it('should render all sections', () => {
		render(DashboardOverview, { data: mockData });

		expect(screen.getByTestId('progress-summary')).toBeTruthy();
		expect(screen.getByTestId('continue-learning-card')).toBeTruthy();
		expect(screen.getByTestId('enrolled-courses-list')).toBeTruthy();
	});

	it('should pass stats to ProgressSummary', () => {
		render(DashboardOverview, { data: mockData });

		const summary = screen.getByTestId('progress-summary');
		expect(summary).toBeTruthy();
		expect(screen.getByTestId('stat-value-totalEnrolled').textContent).toBe('3');
	});

	it('should show continue learning card when continueLearning exists', () => {
		render(DashboardOverview, { data: mockData });

		expect(screen.getByTestId('continue-learning-card')).toBeTruthy();
		expect(screen.getByTestId('continue-learning-content')).toBeTruthy();
	});

	it('should not show continue learning card when continueLearning is null', () => {
		const dataWithoutContinue = { ...mockData, continueLearning: null };
		render(DashboardOverview, { data: dataWithoutContinue });

		expect(screen.queryByTestId('continue-learning-content')).toBeNull();
	});

	it('should not show continue learning card when loading', () => {
		render(DashboardOverview, { data: mockData, loading: true });

		expect(screen.queryByTestId('continue-learning-content')).toBeNull();
	});

	it('should pass loading state to child components', () => {
		render(DashboardOverview, { data: mockData, loading: true });

		expect(screen.getByTestId('progress-summary-loading')).toBeTruthy();
		expect(screen.getByTestId('courses-loading')).toBeTruthy();
	});

	it('should pass courses to EnrolledCoursesList', () => {
		render(DashboardOverview, { data: mockData });

		const coursesList = screen.getByTestId('enrolled-courses-list');
		expect(coursesList).toBeTruthy();
	});

	it('should accept custom className', () => {
		render(DashboardOverview, { data: mockData, class: 'custom-class' });

		const overview = screen.getByTestId('dashboard-overview');
		expect(overview.className).toContain('custom-class');
	});
});
