import { describe, it, expect, beforeEach } from 'vitest';
import {
	combineCourseData,
	calculateDashboardStats,
	sortCourses,
	filterCourses,
	getContinueLearning,
	getRecentCourses
} from './dashboard-data';
import type { Course, CourseEnrollment, CourseProgress } from '../../shared/types';
import type { DashboardCourse } from '../types';

describe('Dashboard Data Utils', () => {
	const mockCourse1: Course = {
		id: 'course-1',
		name: 'Introduction to TypeScript',
		internal_name: 'typescript-101',
		slug: 'intro-typescript',
		description: {},
		published: true,
		categories: [],
		tags: [],
		sections: [],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockCourse2: Course = {
		id: 'course-2',
		name: 'Advanced React',
		internal_name: 'react-advanced',
		slug: 'advanced-react',
		description: {},
		published: true,
		categories: [],
		tags: [],
		sections: [],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockCourse3: Course = {
		id: 'course-3',
		name: 'Node.js Fundamentals',
		internal_name: 'nodejs-fundamentals',
		slug: 'nodejs-fundamentals',
		description: {},
		published: true,
		categories: [],
		tags: [],
		sections: [],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockEnrollments: CourseEnrollment[] = [
		{
			id: 'enroll-1',
			user: 'user-1',
			course: 'course-1',
			isActive: true,
			enrollmentSource: 'direct',
			enrolledAt: '2024-01-15',
			createdAt: '2024-01-15',
			updatedAt: '2024-01-15'
		},
		{
			id: 'enroll-2',
			user: 'user-1',
			course: 'course-2',
			isActive: true,
			enrollmentSource: 'direct',
			enrolledAt: '2024-01-10',
			createdAt: '2024-01-10',
			updatedAt: '2024-01-10'
		},
		{
			id: 'enroll-3',
			user: 'user-1',
			course: 'course-3',
			isActive: true,
			enrollmentSource: 'direct',
			enrolledAt: '2024-01-05',
			createdAt: '2024-01-05',
			updatedAt: '2024-01-05'
		}
	];

	const mockProgress: CourseProgress[] = [
		{
			id: 'progress-1',
			user: 'user-1',
			course: 'course-1',
			status: 'in-progress',
			startedAt: '2024-01-15',
			createdAt: '2024-01-15',
			updatedAt: '2024-01-20'
		},
		{
			id: 'progress-2',
			user: 'user-1',
			course: 'course-2',
			status: 'completed',
			startedAt: '2024-01-10',
			completedAt: '2024-01-18',
			createdAt: '2024-01-10',
			updatedAt: '2024-01-18'
		}
	];

	describe('combineCourseData', () => {
		it('should combine enrollment, progress, and course data', () => {
			const result = combineCourseData(mockEnrollments, mockProgress, [
				mockCourse1,
				mockCourse2,
				mockCourse3
			]);

			expect(result).toHaveLength(3);
			expect(result[0].course).toEqual(mockCourse1);
			expect(result[0].enrollment).toEqual(mockEnrollments[0]);
			expect(result[0].progress).toEqual(mockProgress[0]);
		});

		it('should set progress to null for courses without progress', () => {
			const result = combineCourseData(mockEnrollments, mockProgress, [
				mockCourse1,
				mockCourse2,
				mockCourse3
			]);

			const course3Data = result.find((r) => r.course.id === 'course-3');
			expect(course3Data?.progress).toBeNull();
			expect(course3Data?.status).toBe('not-started');
			expect(course3Data?.completionPercentage).toBe(0);
		});

		it('should use progress status and completion percentage when available', () => {
			const result = combineCourseData(mockEnrollments, mockProgress, [
				mockCourse1,
				mockCourse2,
				mockCourse3
			]);

			const course1Data = result.find((r) => r.course.id === 'course-1');
			expect(course1Data?.status).toBe('in-progress');
			expect(course1Data?.completionPercentage).toBe(50);
		});

		it('should throw error when course not found', () => {
			expect(() => {
				combineCourseData(mockEnrollments, mockProgress, [mockCourse1]);
			}).toThrow('Course course-2 not found');
		});
	});

	describe('calculateDashboardStats', () => {
		it('should calculate correct statistics', () => {
			const dashboardCourses = combineCourseData(mockEnrollments, mockProgress, [
				mockCourse1,
				mockCourse2,
				mockCourse3
			]);

			const stats = calculateDashboardStats(dashboardCourses);

			expect(stats.totalEnrolled).toBe(3);
			expect(stats.inProgress).toBe(1);
			expect(stats.completed).toBe(1);
			expect(stats.notStarted).toBe(1);
		});

		it('should calculate overall completion percentage', () => {
			const dashboardCourses = combineCourseData(mockEnrollments, mockProgress, [
				mockCourse1,
				mockCourse2,
				mockCourse3
			]);

			const stats = calculateDashboardStats(dashboardCourses);

			// (50 + 100 + 0) / 3 = 50
			expect(stats.overallCompletionPercentage).toBe(50);
		});

		it('should return 0 for empty course list', () => {
			const stats = calculateDashboardStats([]);

			expect(stats.totalEnrolled).toBe(0);
			expect(stats.overallCompletionPercentage).toBe(0);
		});
	});

	describe('sortCourses', () => {
		let dashboardCourses: DashboardCourse[];

		beforeEach(() => {
			dashboardCourses = combineCourseData(mockEnrollments, mockProgress, [
				mockCourse1,
				mockCourse2,
				mockCourse3
			]);
		});

		it('should sort by recent (most recent first)', () => {
			const sorted = sortCourses(dashboardCourses, 'recent');

			// course-1 updated 01-20, course-2 updated 01-18, course-3 has no progress (created 01-05)
			expect(sorted[0].course.id).toBe('course-1');
			expect(sorted[1].course.id).toBe('course-2');
			expect(sorted[2].course.id).toBe('course-3');
		});

		it('should sort by title alphabetically', () => {
			const sorted = sortCourses(dashboardCourses, 'title');

			expect(sorted[0].course.name).toBe('Advanced React');
			expect(sorted[1].course.name).toBe('Introduction to TypeScript');
			expect(sorted[2].course.name).toBe('Node.js Fundamentals');
		});

		it('should sort by progress (highest first)', () => {
			const sorted = sortCourses(dashboardCourses, 'progress');

			expect(sorted[0].completionPercentage).toBe(100);
			expect(sorted[1].completionPercentage).toBe(50);
			expect(sorted[2].completionPercentage).toBe(0);
		});

		it('should not mutate original array', () => {
			const original = [...dashboardCourses];
			sortCourses(dashboardCourses, 'title');
			expect(dashboardCourses).toEqual(original);
		});
	});

	describe('filterCourses', () => {
		let dashboardCourses: DashboardCourse[];

		beforeEach(() => {
			dashboardCourses = combineCourseData(mockEnrollments, mockProgress, [
				mockCourse1,
				mockCourse2,
				mockCourse3
			]);
		});

		it('should return all courses when filter is "all"', () => {
			const filtered = filterCourses(dashboardCourses, 'all');
			expect(filtered).toHaveLength(3);
		});

		it('should filter in-progress courses', () => {
			const filtered = filterCourses(dashboardCourses, 'in-progress');
			expect(filtered).toHaveLength(1);
			expect(filtered[0].course.id).toBe('course-1');
		});

		it('should filter completed courses', () => {
			const filtered = filterCourses(dashboardCourses, 'completed');
			expect(filtered).toHaveLength(1);
			expect(filtered[0].course.id).toBe('course-2');
		});

		it('should filter not-started courses', () => {
			const filtered = filterCourses(dashboardCourses, 'not-started');
			expect(filtered).toHaveLength(1);
			expect(filtered[0].course.id).toBe('course-3');
		});
	});

	describe('getContinueLearning', () => {
		it('should return most recently updated in-progress course', () => {
			const dashboardCourses = combineCourseData(mockEnrollments, mockProgress, [
				mockCourse1,
				mockCourse2,
				mockCourse3
			]);

			const continueLearning = getContinueLearning(dashboardCourses);

			expect(continueLearning?.course.id).toBe('course-1');
			expect(continueLearning?.status).toBe('in-progress');
		});

		it('should return null when no in-progress courses', () => {
			const dashboardCourses = combineCourseData(
				mockEnrollments,
				[mockProgress[1]], // Only completed course
				[mockCourse1, mockCourse2, mockCourse3]
			);

			const continueLearning = getContinueLearning(dashboardCourses);

			expect(continueLearning).toBeNull();
		});
	});

	describe('getRecentCourses', () => {
		it('should return up to limit recent courses', () => {
			const dashboardCourses = combineCourseData(mockEnrollments, mockProgress, [
				mockCourse1,
				mockCourse2,
				mockCourse3
			]);

			const recent = getRecentCourses(dashboardCourses, 2);

			expect(recent).toHaveLength(2);
			expect(recent[0].course.id).toBe('course-1'); // Most recent
		});

		it('should default to 5 courses', () => {
			const dashboardCourses = combineCourseData(mockEnrollments, mockProgress, [
				mockCourse1,
				mockCourse2,
				mockCourse3
			]);

			const recent = getRecentCourses(dashboardCourses);

			expect(recent).toHaveLength(3); // All 3 courses (less than default 5)
		});

		it('should return empty array for empty input', () => {
			const recent = getRecentCourses([]);
			expect(recent).toEqual([]);
		});
	});
});
