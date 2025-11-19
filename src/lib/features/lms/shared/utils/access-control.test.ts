import { describe, it, expect } from 'vitest';
import {
	hasActiveEnrollment,
	canAccessCourse,
	canAccessBundle,
	filterAccessibleCourses,
	getEnrollmentSource
} from './access-control';
import type { CourseEnrollment, BundleEnrollment, Course } from '../types';

describe('Access Control Utils', () => {
	describe('hasActiveEnrollment', () => {
		it('should return true if any enrollment is active', () => {
			const enrollments: CourseEnrollment[] = [
				{
					id: '1',
					user: 'user-1',
					course: 'course-1',
					isActive: false,
					enrolledAt: '2024-01-01',
					enrollmentSource: 'direct',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				},
				{
					id: '2',
					user: 'user-1',
					course: 'course-2',
					isActive: true,
					enrolledAt: '2024-01-01',
					enrollmentSource: 'direct',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			expect(hasActiveEnrollment(enrollments)).toBe(true);
		});

		it('should return false if no enrollments are active', () => {
			const enrollments: CourseEnrollment[] = [
				{
					id: '1',
					user: 'user-1',
					course: 'course-1',
					isActive: false,
					enrolledAt: '2024-01-01',
					enrollmentSource: 'direct',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			expect(hasActiveEnrollment(enrollments)).toBe(false);
		});

		it('should return false for empty array', () => {
			expect(hasActiveEnrollment([])).toBe(false);
		});
	});

	describe('canAccessCourse', () => {
		const enrollments: CourseEnrollment[] = [
			{
				id: '1',
				user: 'user-1',
				course: 'course-1',
				isActive: true,
				enrolledAt: '2024-01-01',
				enrollmentSource: 'direct',
				createdAt: '2024-01-01',
				updatedAt: '2024-01-01'
			},
			{
				id: '2',
				user: 'user-1',
				course: 'course-2',
				isActive: false,
				enrolledAt: '2024-01-01',
				enrollmentSource: 'direct',
				createdAt: '2024-01-01',
				updatedAt: '2024-01-01'
			}
		];

		it('should return true if user has active enrollment for course', () => {
			expect(canAccessCourse(enrollments, 'course-1')).toBe(true);
		});

		it('should return false if enrollment is not active', () => {
			expect(canAccessCourse(enrollments, 'course-2')).toBe(false);
		});

		it('should return false if user has no enrollment for course', () => {
			expect(canAccessCourse(enrollments, 'course-3')).toBe(false);
		});
	});

	describe('canAccessBundle', () => {
		const enrollments: BundleEnrollment[] = [
			{
				id: '1',
				user: 'user-1',
				bundle: 'bundle-1',
				isActive: true,
				enrolledAt: '2024-01-01',
				enrollmentSource: 'direct',
				createdAt: '2024-01-01',
				updatedAt: '2024-01-01'
			}
		];

		it('should return true if user has active enrollment for bundle', () => {
			expect(canAccessBundle(enrollments, 'bundle-1')).toBe(true);
		});

		it('should return false if user has no enrollment for bundle', () => {
			expect(canAccessBundle(enrollments, 'bundle-2')).toBe(false);
		});
	});

	describe('filterAccessibleCourses', () => {
		const courses: Course[] = [
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

		const enrollments: CourseEnrollment[] = [
			{
				id: '1',
				user: 'user-1',
				course: 'course-1',
				isActive: true,
				enrolledAt: '2024-01-01',
				enrollmentSource: 'direct',
				createdAt: '2024-01-01',
				updatedAt: '2024-01-01'
			},
			{
				id: '2',
				user: 'user-1',
				course: 'course-3',
				isActive: false,
				enrolledAt: '2024-01-01',
				enrollmentSource: 'direct',
				createdAt: '2024-01-01',
				updatedAt: '2024-01-01'
			}
		];

		it('should return only courses with active enrollments', () => {
			const result = filterAccessibleCourses(courses, enrollments);
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe('course-1');
		});

		it('should return empty array if no active enrollments', () => {
			const inactiveEnrollments = enrollments.map((e) => ({ ...e, isActive: false }));
			const result = filterAccessibleCourses(courses, inactiveEnrollments);
			expect(result).toHaveLength(0);
		});
	});

	describe('getEnrollmentSource', () => {
		const enrollments: CourseEnrollment[] = [
			{
				id: '1',
				user: 'user-1',
				course: 'course-1',
				isActive: true,
				enrolledAt: '2024-01-01',
				enrollmentSource: 'bundle',
				createdAt: '2024-01-01',
				updatedAt: '2024-01-01'
			}
		];

		it('should return enrollment source for active enrollment', () => {
			const source = getEnrollmentSource(enrollments, 'course-1');
			expect(source).toBe('bundle');
		});

		it('should return null if no active enrollment found', () => {
			const source = getEnrollmentSource(enrollments, 'course-2');
			expect(source).toBeNull();
		});

		it('should work with bundle enrollments', () => {
			const bundleEnrollments: BundleEnrollment[] = [
				{
					id: '1',
					user: 'user-1',
					bundle: 'bundle-1',
					isActive: true,
					enrolledAt: '2024-01-01',
					enrollmentSource: 'learning-path',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const source = getEnrollmentSource(bundleEnrollments, 'bundle-1');
			expect(source).toBe('learning-path');
		});
	});
});
