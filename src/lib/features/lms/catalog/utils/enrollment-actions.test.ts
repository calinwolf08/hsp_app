import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	enrollInCourse,
	unenrollFromCourse,
	checkEnrollmentStatus,
	attachEnrollmentStatus,
	getEnrolledCourses,
	getUnenrolledCourses,
	filterByEnrollmentStatus,
	countEnrollmentsByStatus
} from './enrollment-actions';
import type { Course, CourseEnrollment } from '../../shared/types';
import type { CatalogCourse } from '../types';

// Mock the API functions
vi.mock('../../shared/api/enrollment-api', () => ({
	createCourseEnrollment: vi.fn(),
	deleteCourseEnrollment: vi.fn()
}));

import { createCourseEnrollment, deleteCourseEnrollment } from '../../shared/api/enrollment-api';

describe('enrollment-actions utils', () => {
	const mockUserId = 'user-1';

	const mockCourses: Course[] = [
		{
			id: 'course-1',
			name: 'Course 1',
			internal_name: 'course-1',
			slug: 'course-1',
			description: {},
			published: true,
			categories: [],
			tags: [],
			sections: [],
			createdAt: '2024-01-01',
			updatedAt: '2024-01-01'
		},
		{
			id: 'course-2',
			name: 'Course 2',
			internal_name: 'course-2',
			slug: 'course-2',
			description: {},
			published: true,
			categories: [],
			tags: [],
			sections: [],
			createdAt: '2024-01-01',
			updatedAt: '2024-01-01'
		},
		{
			id: 'course-3',
			name: 'Course 3',
			internal_name: 'course-3',
			slug: 'course-3',
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
			enrollmentSource: 'direct',
			isActive: true,
			enrolledAt: '2024-01-15',
			createdAt: '2024-01-15',
			updatedAt: '2024-01-15'
		},
		{
			id: 'enroll-2',
			user: 'user-1',
			course: 'course-2',
			enrollmentSource: 'bundle',
			isActive: true,
			enrolledAt: '2024-01-16',
			createdAt: '2024-01-16',
			updatedAt: '2024-01-16'
		},
		{
			id: 'enroll-3',
			user: 'user-2',
			course: 'course-3',
			enrollmentSource: 'direct',
			isActive: true,
			enrolledAt: '2024-01-17',
			createdAt: '2024-01-17',
			updatedAt: '2024-01-17'
		}
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('enrollInCourse', () => {
		it('should create a course enrollment with default source', async () => {
			const mockEnrollment: CourseEnrollment = {
				id: 'new-enroll',
				user: 'user-1',
				course: 'course-3',
				enrollmentSource: 'direct',
				isActive: true,
				enrolledAt: '2024-01-20',
				createdAt: '2024-01-20',
				updatedAt: '2024-01-20'
			};

			vi.mocked(createCourseEnrollment).mockResolvedValue(mockEnrollment);

			const result = await enrollInCourse('user-1', 'course-3');

			expect(createCourseEnrollment).toHaveBeenCalledWith(
				expect.objectContaining({
					user: 'user-1',
					course: 'course-3',
					enrollmentSource: 'direct',
					isActive: true
				})
			);
			expect(result).toEqual(mockEnrollment);
		});

		it('should create a course enrollment with specified source', async () => {
			const mockEnrollment: CourseEnrollment = {
				id: 'new-enroll',
				user: 'user-1',
				course: 'course-3',
				enrollmentSource: 'bundle',
				isActive: true,
				enrolledAt: '2024-01-20',
				createdAt: '2024-01-20',
				updatedAt: '2024-01-20'
			};

			vi.mocked(createCourseEnrollment).mockResolvedValue(mockEnrollment);

			const result = await enrollInCourse('user-1', 'course-3', 'bundle');

			expect(createCourseEnrollment).toHaveBeenCalledWith(
				expect.objectContaining({
					enrollmentSource: 'bundle'
				})
			);
			expect(result).toEqual(mockEnrollment);
		});
	});

	describe('unenrollFromCourse', () => {
		it('should delete the enrollment', async () => {
			vi.mocked(deleteCourseEnrollment).mockResolvedValue(undefined);

			await unenrollFromCourse('enroll-1');

			expect(deleteCourseEnrollment).toHaveBeenCalledWith('enroll-1');
		});
	});

	describe('checkEnrollmentStatus', () => {
		it('should return enrolled status when user is enrolled', () => {
			const result = checkEnrollmentStatus(mockUserId, 'course-1', mockEnrollments);

			expect(result.isEnrolled).toBe(true);
			expect(result.enrollment).toBeDefined();
			expect(result.enrollment?.id).toBe('enroll-1');
		});

		it('should return not enrolled when user is not enrolled', () => {
			const result = checkEnrollmentStatus(mockUserId, 'course-3', mockEnrollments);

			expect(result.isEnrolled).toBe(false);
			expect(result.enrollment).toBeUndefined();
		});

		it('should return not enrolled when enrollment list is empty', () => {
			const result = checkEnrollmentStatus(mockUserId, 'course-1', []);

			expect(result.isEnrolled).toBe(false);
			expect(result.enrollment).toBeUndefined();
		});

		it('should only match active enrollments', () => {
			const inactiveEnrollments: CourseEnrollment[] = [
				{
					id: 'enroll-inactive',
					user: 'user-1',
					course: 'course-3',
					enrollmentSource: 'direct',
					isActive: false,
					enrolledAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				}
			];

			const result = checkEnrollmentStatus(mockUserId, 'course-3', inactiveEnrollments);

			expect(result.isEnrolled).toBe(false);
		});
	});

	describe('attachEnrollmentStatus', () => {
		it('should attach enrollment status to all courses', () => {
			const result = attachEnrollmentStatus(mockCourses, mockEnrollments, mockUserId);

			expect(result).toHaveLength(3);
			expect(result[0].isEnrolled).toBe(true);
			expect(result[0].enrollmentId).toBe('enroll-1');
			expect(result[1].isEnrolled).toBe(true);
			expect(result[1].enrollmentId).toBe('enroll-2');
			expect(result[2].isEnrolled).toBe(false);
			expect(result[2].enrollmentId).toBeUndefined();
		});

		it('should include enrolledAt date when enrolled', () => {
			const result = attachEnrollmentStatus(mockCourses, mockEnrollments, mockUserId);

			expect(result[0].enrolledAt).toBe('2024-01-15');
			expect(result[1].enrolledAt).toBe('2024-01-16');
			expect(result[2].enrolledAt).toBeUndefined();
		});

		it('should handle empty enrollments list', () => {
			const result = attachEnrollmentStatus(mockCourses, [], mockUserId);

			expect(result).toHaveLength(3);
			result.forEach((catalogCourse) => {
				expect(catalogCourse.isEnrolled).toBe(false);
				expect(catalogCourse.enrollmentId).toBeUndefined();
			});
		});

		it('should handle different user ID', () => {
			const result = attachEnrollmentStatus(mockCourses, mockEnrollments, 'user-2');

			expect(result[0].isEnrolled).toBe(false);
			expect(result[1].isEnrolled).toBe(false);
			expect(result[2].isEnrolled).toBe(true);
		});

		it('should only consider active enrollments', () => {
			const enrollmentsWithInactive: CourseEnrollment[] = [
				...mockEnrollments,
				{
					id: 'enroll-inactive',
					user: 'user-1',
					course: 'course-3',
					enrollmentSource: 'direct',
					isActive: false,
					enrolledAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				}
			];

			const result = attachEnrollmentStatus(mockCourses, enrollmentsWithInactive, mockUserId);

			expect(result[2].isEnrolled).toBe(false);
		});
	});

	describe('getEnrolledCourses', () => {
		it('should return only courses user is enrolled in', () => {
			const enrolled = getEnrolledCourses(mockCourses, mockEnrollments, mockUserId);

			expect(enrolled).toHaveLength(2);
			expect(enrolled.map((c) => c.id)).toEqual(['course-1', 'course-2']);
		});

		it('should return empty array when user has no enrollments', () => {
			const enrolled = getEnrolledCourses(mockCourses, mockEnrollments, 'user-3');

			expect(enrolled).toEqual([]);
		});

		it('should return empty array when enrollments list is empty', () => {
			const enrolled = getEnrolledCourses(mockCourses, [], mockUserId);

			expect(enrolled).toEqual([]);
		});

		it('should only include active enrollments', () => {
			const enrollmentsWithInactive: CourseEnrollment[] = [
				{
					id: 'enroll-inactive',
					user: 'user-1',
					course: 'course-3',
					enrollmentSource: 'direct',
					isActive: false,
					enrolledAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				}
			];

			const enrolled = getEnrolledCourses(mockCourses, enrollmentsWithInactive, mockUserId);

			expect(enrolled).toEqual([]);
		});
	});

	describe('getUnenrolledCourses', () => {
		it('should return only courses user is not enrolled in', () => {
			const unenrolled = getUnenrolledCourses(mockCourses, mockEnrollments, mockUserId);

			expect(unenrolled).toHaveLength(1);
			expect(unenrolled[0].id).toBe('course-3');
		});

		it('should return all courses when user has no enrollments', () => {
			const unenrolled = getUnenrolledCourses(mockCourses, mockEnrollments, 'user-3');

			expect(unenrolled).toHaveLength(3);
		});

		it('should return all courses when enrollments list is empty', () => {
			const unenrolled = getUnenrolledCourses(mockCourses, [], mockUserId);

			expect(unenrolled).toHaveLength(3);
		});
	});

	describe('filterByEnrollmentStatus', () => {
		const catalogCourses: CatalogCourse[] = [
			{ course: mockCourses[0], isEnrolled: true, enrollmentId: 'enroll-1' },
			{ course: mockCourses[1], isEnrolled: true, enrollmentId: 'enroll-2' },
			{ course: mockCourses[2], isEnrolled: false }
		];

		it('should return all courses when status is "all"', () => {
			const filtered = filterByEnrollmentStatus(catalogCourses, 'all');

			expect(filtered).toHaveLength(3);
		});

		it('should return only enrolled courses when status is "enrolled"', () => {
			const filtered = filterByEnrollmentStatus(catalogCourses, 'enrolled');

			expect(filtered).toHaveLength(2);
			expect(filtered.every((c) => c.isEnrolled)).toBe(true);
		});

		it('should return only not enrolled courses when status is "not-enrolled"', () => {
			const filtered = filterByEnrollmentStatus(catalogCourses, 'not-enrolled');

			expect(filtered).toHaveLength(1);
			expect(filtered[0].isEnrolled).toBe(false);
		});

		it('should handle empty catalog', () => {
			const filtered = filterByEnrollmentStatus([], 'enrolled');

			expect(filtered).toEqual([]);
		});
	});

	describe('countEnrollmentsByStatus', () => {
		const catalogCourses: CatalogCourse[] = [
			{ course: mockCourses[0], isEnrolled: true, enrollmentId: 'enroll-1' },
			{ course: mockCourses[1], isEnrolled: true, enrollmentId: 'enroll-2' },
			{ course: mockCourses[2], isEnrolled: false }
		];

		it('should count enrollments correctly', () => {
			const counts = countEnrollmentsByStatus(catalogCourses);

			expect(counts).toEqual({
				total: 3,
				enrolled: 2,
				notEnrolled: 1
			});
		});

		it('should handle all enrolled', () => {
			const allEnrolled: CatalogCourse[] = [
				{ course: mockCourses[0], isEnrolled: true, enrollmentId: 'enroll-1' },
				{ course: mockCourses[1], isEnrolled: true, enrollmentId: 'enroll-2' }
			];

			const counts = countEnrollmentsByStatus(allEnrolled);

			expect(counts).toEqual({
				total: 2,
				enrolled: 2,
				notEnrolled: 0
			});
		});

		it('should handle none enrolled', () => {
			const noneEnrolled: CatalogCourse[] = [
				{ course: mockCourses[0], isEnrolled: false },
				{ course: mockCourses[1], isEnrolled: false }
			];

			const counts = countEnrollmentsByStatus(noneEnrolled);

			expect(counts).toEqual({
				total: 2,
				enrolled: 0,
				notEnrolled: 2
			});
		});

		it('should handle empty catalog', () => {
			const counts = countEnrollmentsByStatus([]);

			expect(counts).toEqual({
				total: 0,
				enrolled: 0,
				notEnrolled: 0
			});
		});
	});
});
