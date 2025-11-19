import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from './+page.server';
import * as enrollmentApi from '$lib/features/lms/shared/api/enrollment-api';
import * as progressApi from '$lib/features/lms/shared/api/progress-api';
import * as contentApi from '$lib/features/lms/shared/api/content-api';
import type { CourseEnrollment, CourseProgress, Course, PaginatedResponse } from '$lib/features/lms/shared/types';
import type { DashboardData } from '$lib/features/lms/dashboard/types';

vi.mock('$lib/features/lms/shared/api/enrollment-api');
vi.mock('$lib/features/lms/shared/api/progress-api');
vi.mock('$lib/features/lms/shared/api/content-api');

describe('Dashboard Page Server Load', () => {
	const mockUser = {
		id: 'user-1',
		email: 'test@example.com',
		name: 'Test User',
		emailVerified: true,
		image: null,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const mockEvent = {
		locals: {
			session: {
				user: mockUser,
				session: {
					expiresAt: new Date(),
					token: 'test-token',
					ipAddress: '127.0.0.1',
					userAgent: 'test'
				}
			}
		}
	} as any;

	const mockCourses: Course[] = [
		{
			id: 'course-1',
			name: 'TypeScript Basics',
			internal_name: 'typescript-basics',
			slug: 'typescript-basics',
			description: {},
			published: true,
			categories: [],
			tags: [],
			sections: [],
			createdAt: '2024-01-01',
			updatedAt: '2024-01-01'
		}
	];

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
		}
	];

	const mockProgress: CourseProgress = {
		id: 'progress-1',
		user: 'user-1',
		course: 'course-1',
		status: 'in-progress',
		startedAt: '2024-01-15',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-20'
	};

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should load dashboard data successfully', async () => {
		const enrollmentsResponse: PaginatedResponse<CourseEnrollment> = {
			docs: mockEnrollments,
			totalDocs: 1,
			limit: 10,
			totalPages: 1,
			page: 1,
				hasPrevPage: false,
			hasNextPage: false,
			prevPage: null,
			nextPage: null
		};

		vi.spyOn(enrollmentApi, 'getCourseEnrollments').mockResolvedValue(enrollmentsResponse);
		vi.spyOn(progressApi, 'getCourseProgress').mockResolvedValue(mockProgress);
		vi.spyOn(contentApi, 'getCourses').mockResolvedValue({
		docs: mockCourses,
		totalDocs: mockCourses.length,
		limit: 10,
		page: 1,
		totalPages: 1,
		hasNextPage: false,
		hasPrevPage: false,
		nextPage: null,
		prevPage: null
	});

		const result = await load(mockEvent) as { dashboardData: DashboardData; error?: string };

		expect(result.dashboardData).toBeDefined();
		expect(result.dashboardData.courses).toHaveLength(1);
		expect(result.dashboardData.stats.totalEnrolled).toBe(1);
	});

	it('should call API functions with correct parameters', async () => {
		const enrollmentsResponse: PaginatedResponse<CourseEnrollment> = {
			docs: mockEnrollments,
			totalDocs: 1,
			limit: 10,
			totalPages: 1,
			page: 1,
				hasPrevPage: false,
			hasNextPage: false,
			prevPage: null,
			nextPage: null
		};

		const getEnrollmentsSpy = vi
			.spyOn(enrollmentApi, 'getCourseEnrollments')
			.mockResolvedValue(enrollmentsResponse);
		const getProgressSpy = vi
			.spyOn(progressApi, 'getCourseProgress')
			.mockResolvedValue(mockProgress);
		vi.spyOn(contentApi, 'getCourses').mockResolvedValue({
		docs: mockCourses,
		totalDocs: mockCourses.length,
		limit: 10,
		page: 1,
		totalPages: 1,
		hasNextPage: false,
		hasPrevPage: false,
		nextPage: null,
		prevPage: null
	});

		await load(mockEvent);

		expect(getEnrollmentsSpy).toHaveBeenCalledWith('user-1');
		expect(getProgressSpy).toHaveBeenCalledWith('user-1', 'course-1');
	});

	it('should handle empty enrollments', async () => {
		const emptyResponse: PaginatedResponse<CourseEnrollment> = {
			docs: [],
			totalDocs: 0,
			limit: 10,
			totalPages: 0,
			page: 1,
				hasPrevPage: false,
			hasNextPage: false,
			prevPage: null,
			nextPage: null
		};

		vi.spyOn(enrollmentApi, 'getCourseEnrollments').mockResolvedValue(emptyResponse);

		const result = await load(mockEvent) as { dashboardData: DashboardData; error?: string };

		expect(result.dashboardData.courses).toHaveLength(0);
		expect(result.dashboardData.stats.totalEnrolled).toBe(0);
		expect(result.dashboardData.continueLearning).toBeNull();
	});

	it('should handle API errors gracefully', async () => {
		vi.spyOn(enrollmentApi, 'getCourseEnrollments').mockRejectedValue(new Error('API Error'));

		const result = await load(mockEvent) as { dashboardData: DashboardData; error?: string };

		expect(result.dashboardData).toBeDefined();
		expect(result.dashboardData.courses).toHaveLength(0);
		expect(result.error).toBe('Failed to load dashboard data');
	});

	it('should redirect when user is not authenticated', async () => {
		const unauthenticatedEvent = {
			locals: {
				session: null
			}
		} as any;

		await expect(load(unauthenticatedEvent)).rejects.toThrow();
	});
});
