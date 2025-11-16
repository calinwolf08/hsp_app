import { describe, it, expect } from 'vitest';
import {
	getNextAccessibleCourse,
	isSequentialMode,
	canAccessInSequence,
	getLockedCourses,
	getUnlockedCourses
} from './sequential-access';
import type { LearningPath, CourseProgress, Bundle, Module, Course } from '../types';

describe('Sequential Access Utils', () => {
	const createLearningPath = (accessType: 'sequential' | 'automatic'): LearningPath => {
		const course1: Course = {
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
		};

		const course2: Course = {
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
		};

		const course3: Course = {
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
		};

		const module1: Module = {
			id: 'module-1',
			name: 'Module 1',
			internal_name: 'module-1',
			description: {},
			published: true,
			courses: [
				{ id: 'c1', course: course1 },
				{ id: 'c2', course: course2 },
				{ id: 'c3', course: course3 }
			],
			createdAt: '2024-01-01',
			updatedAt: '2024-01-01'
		};

		const bundle1: Bundle = {
			id: 'bundle-1',
			name: 'Bundle 1',
			internal_name: 'bundle-1',
			description: {},
			published: true,
			categories: [],
			tags: [],
			modules: [{ id: 'm1', module: module1 }],
			createdAt: '2024-01-01',
			updatedAt: '2024-01-01'
		};

		return {
			id: 'lp-1',
			name: 'Learning Path',
			internal_name: 'lp-1',
			description: {},
			published: true,
			accessType,
			categories: [],
			tags: [],
			bundles: [{ id: 'b1', bundle: bundle1 }],
			createdAt: '2024-01-01',
			updatedAt: '2024-01-01'
		};
	};

	describe('isSequentialMode', () => {
		it('should return true for sequential access type', () => {
			const lp = createLearningPath('sequential');
			expect(isSequentialMode(lp)).toBe(true);
		});

		it('should return false for automatic access type', () => {
			const lp = createLearningPath('automatic');
			expect(isSequentialMode(lp)).toBe(false);
		});
	});

	describe('getNextAccessibleCourse', () => {
		it('should return first course when no progress', () => {
			const lp = createLearningPath('sequential');
			const progress: CourseProgress[] = [];

			const next = getNextAccessibleCourse(lp, progress);
			expect(next).toBe('course-1');
		});

		it('should return second course when first is completed', () => {
			const lp = createLearningPath('sequential');
			const progress: CourseProgress[] = [
				{
					id: '1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const next = getNextAccessibleCourse(lp, progress);
			expect(next).toBe('course-2');
		});

		it('should return null when all courses completed', () => {
			const lp = createLearningPath('sequential');
			const progress: CourseProgress[] = [
				{
					id: '1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				},
				{
					id: '2',
					user: 'user-1',
					course: 'course-2',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				},
				{
					id: '3',
					user: 'user-1',
					course: 'course-3',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const next = getNextAccessibleCourse(lp, progress);
			expect(next).toBeNull();
		});

		it('should return null for automatic mode', () => {
			const lp = createLearningPath('automatic');
			const progress: CourseProgress[] = [];

			const next = getNextAccessibleCourse(lp, progress);
			expect(next).toBeNull();
		});
	});

	describe('canAccessInSequence', () => {
		it('should allow access to first course', () => {
			const lp = createLearningPath('sequential');
			const progress: CourseProgress[] = [];

			const canAccess = canAccessInSequence('course-1', lp, progress);
			expect(canAccess).toBe(true);
		});

		it('should deny access to second course when first not completed', () => {
			const lp = createLearningPath('sequential');
			const progress: CourseProgress[] = [];

			const canAccess = canAccessInSequence('course-2', lp, progress);
			expect(canAccess).toBe(false);
		});

		it('should allow access to second course when first is completed', () => {
			const lp = createLearningPath('sequential');
			const progress: CourseProgress[] = [
				{
					id: '1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const canAccess = canAccessInSequence('course-2', lp, progress);
			expect(canAccess).toBe(true);
		});

		it('should allow all access in automatic mode', () => {
			const lp = createLearningPath('automatic');
			const progress: CourseProgress[] = [];

			expect(canAccessInSequence('course-1', lp, progress)).toBe(true);
			expect(canAccessInSequence('course-2', lp, progress)).toBe(true);
			expect(canAccessInSequence('course-3', lp, progress)).toBe(true);
		});
	});

	describe('getLockedCourses', () => {
		it('should return empty array for automatic mode', () => {
			const lp = createLearningPath('automatic');
			const progress: CourseProgress[] = [];

			const locked = getLockedCourses(lp, progress);
			expect(locked).toEqual([]);
		});

		it('should return all but first course when no progress', () => {
			const lp = createLearningPath('sequential');
			const progress: CourseProgress[] = [];

			const locked = getLockedCourses(lp, progress);
			expect(locked).toContain('course-2');
			expect(locked).toContain('course-3');
			expect(locked).not.toContain('course-1');
		});

		it('should update locked courses as progress is made', () => {
			const lp = createLearningPath('sequential');
			const progress: CourseProgress[] = [
				{
					id: '1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const locked = getLockedCourses(lp, progress);
			expect(locked).toContain('course-3');
			expect(locked).not.toContain('course-1');
			expect(locked).not.toContain('course-2');
		});
	});

	describe('getUnlockedCourses', () => {
		it('should return all courses for automatic mode', () => {
			const lp = createLearningPath('automatic');
			const progress: CourseProgress[] = [];

			const unlocked = getUnlockedCourses(lp, progress);
			expect(unlocked).toContain('course-1');
			expect(unlocked).toContain('course-2');
			expect(unlocked).toContain('course-3');
		});

		it('should return only first course when no progress', () => {
			const lp = createLearningPath('sequential');
			const progress: CourseProgress[] = [];

			const unlocked = getUnlockedCourses(lp, progress);
			expect(unlocked).toEqual(['course-1']);
		});

		it('should include completed courses and next accessible', () => {
			const lp = createLearningPath('sequential');
			const progress: CourseProgress[] = [
				{
					id: '1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					createdAt: '2024-01-01',
					updatedAt: '2024-01-01'
				}
			];

			const unlocked = getUnlockedCourses(lp, progress);
			expect(unlocked).toContain('course-1'); // completed
			expect(unlocked).toContain('course-2'); // next accessible
			expect(unlocked).not.toContain('course-3'); // locked
		});
	});
});
