import { describe, it, expect } from 'vitest';
import {
	getSequentialState,
	getNextAvailableCourse,
	markCoursesAccessibility,
	isAccessibleInSequence,
	getPreviousCourse,
	getNextCourse,
	calculateSequentialProgress,
	isLearningPathComplete,
	getCourseIndex,
	getTotalCourseCount
} from './sequential-logic';
import type { LearningPath, Bundle, Module, Course } from '../../shared/types';
import type { CourseProgress } from '../../shared/types';

describe('sequential-logic utils', () => {
	// Mock data
	const mockCourse1: Course = {
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

	const mockCourse2: Course = {
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

	const mockCourse3: Course = {
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

	const mockModule: Module = {
		id: 'module-1',
		name: 'Module 1',
		internal_name: 'module-1',
		description: {},
		published: true,
		courses: [
			{ id: 'course-1-item', course: mockCourse1 },
			{ id: 'course-2-item', course: mockCourse2 },
			{ id: 'course-3-item', course: mockCourse3 }
		],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockBundle: Bundle = {
		id: 'bundle-1',
		name: 'Bundle 1',
		internal_name: 'bundle-1',
		description: {},
		published: true,
		categories: [],
		tags: [],
		modules: [{ id: 'module-1-item', module: mockModule }],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const sequentialPath: LearningPath = {
		id: 'path-1',
		name: 'Sequential Path',
		internal_name: 'sequential-path',
		description: {},
		published: true,
		accessType: 'sequential',
		categories: [],
		tags: [],
		bundles: [{ id: 'bundle-1-item', bundle: mockBundle }],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const automaticPath: LearningPath = {
		...sequentialPath,
		accessType: 'automatic'
	};

	describe('getSequentialState', () => {
		it('should return unlocked state for automatic access', () => {
			const state = getSequentialState(automaticPath, []);

			expect(state.isSequential).toBe(false);
			expect(state.unlockedCourseIds).toEqual(['course-1', 'course-2', 'course-3']);
			expect(state.lockedCourseIds).toEqual([]);
		});

		it('should lock all but first course when no progress (sequential)', () => {
			const state = getSequentialState(sequentialPath, []);

			expect(state.isSequential).toBe(true);
			expect(state.currentCourseId).toBe('course-1');
			expect(state.nextCourseId).toBe('course-1');
			expect(state.unlockedCourseIds).toEqual(['course-1']);
			expect(state.lockedCourseIds).toEqual(['course-2', 'course-3']);
			expect(state.completedCourseIds).toEqual([]);
		});

		it('should unlock next course when first is completed', () => {
			const progress: CourseProgress[] = [
				{
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					completedAt: '2024-01-20',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-20'
				}
			];

			const state = getSequentialState(sequentialPath, progress);

			expect(state.unlockedCourseIds).toContain('course-1');
			expect(state.unlockedCourseIds).toContain('course-2');
			expect(state.lockedCourseIds).toEqual(['course-3']);
			expect(state.completedCourseIds).toEqual(['course-1']);
			expect(state.currentCourseId).toBe('course-2');
			expect(state.nextCourseId).toBe('course-2');
		});

		it('should handle in-progress course', () => {
			const progress: CourseProgress[] = [
				{
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'in-progress',
					startedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-20'
				}
			];

			const state = getSequentialState(sequentialPath, progress);

			expect(state.currentCourseId).toBe('course-1');
			expect(state.unlockedCourseIds).toEqual(['course-1']);
			expect(state.lockedCourseIds).toEqual(['course-2', 'course-3']);
		});

		it('should unlock all courses when all completed', () => {
			const progress: CourseProgress[] = [
				{
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					completedAt: '2024-01-20',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-20'
				},
				{
					id: 'progress-2',
					user: 'user-1',
					course: 'course-2',
					status: 'completed',
					completedAt: '2024-01-22',
					createdAt: '2024-01-21',
					updatedAt: '2024-01-22'
				},
				{
					id: 'progress-3',
					user: 'user-1',
					course: 'course-3',
					status: 'completed',
					completedAt: '2024-01-25',
					createdAt: '2024-01-23',
					updatedAt: '2024-01-25'
				}
			];

			const state = getSequentialState(sequentialPath, progress);

			expect(state.unlockedCourseIds).toEqual(['course-1', 'course-2', 'course-3']);
			expect(state.lockedCourseIds).toEqual([]);
			expect(state.completedCourseIds).toEqual(['course-1', 'course-2', 'course-3']);
			expect(state.currentCourseId).toBeNull();
			expect(state.nextCourseId).toBeNull();
		});
	});

	describe('getNextAvailableCourse', () => {
		it('should return first course when no progress', () => {
			const next = getNextAvailableCourse(sequentialPath, []);

			expect(next).not.toBeNull();
			expect(next?.id).toBe('course-1');
		});

		it('should return second course when first is completed', () => {
			const progress: CourseProgress[] = [
				{
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					completedAt: '2024-01-20',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-20'
				}
			];

			const next = getNextAvailableCourse(sequentialPath, progress);

			expect(next).not.toBeNull();
			expect(next?.id).toBe('course-2');
		});

		it('should return null when all courses completed', () => {
			const progress: CourseProgress[] = [
				{ id: 'p1', user: 'user-1', course: 'course-1', status: 'completed', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
				{ id: 'p2', user: 'user-1', course: 'course-2', status: 'completed', createdAt: '2024-01-21', updatedAt: '2024-01-22' },
				{ id: 'p3', user: 'user-1', course: 'course-3', status: 'completed', createdAt: '2024-01-23', updatedAt: '2024-01-25' }
			];

			const next = getNextAvailableCourse(sequentialPath, progress);

			expect(next).toBeNull();
		});
	});

	describe('markCoursesAccessibility', () => {
		it('should mark all courses accessible for automatic path', () => {
			const accessibility = markCoursesAccessibility(automaticPath, []);

			expect(accessibility).toHaveLength(3);
			accessibility.forEach((item) => {
				expect(item.isAccessible).toBe(true);
				expect(item.isLocked).toBe(false);
			});
		});

		it('should mark courses correctly for sequential path with no progress', () => {
			const accessibility = markCoursesAccessibility(sequentialPath, []);

			expect(accessibility[0].isAccessible).toBe(true);
			expect(accessibility[0].isLocked).toBe(false);
			expect(accessibility[1].isAccessible).toBe(false);
			expect(accessibility[1].isLocked).toBe(true);
			expect(accessibility[2].isAccessible).toBe(false);
			expect(accessibility[2].isLocked).toBe(true);
		});

		it('should mark courses correctly for sequential path with progress', () => {
			const progress: CourseProgress[] = [
				{
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					completedAt: '2024-01-20',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-20'
				}
			];

			const accessibility = markCoursesAccessibility(sequentialPath, progress);

			expect(accessibility[0].isCompleted).toBe(true);
			expect(accessibility[0].isAccessible).toBe(true);
			expect(accessibility[1].isAccessible).toBe(true);
			expect(accessibility[1].isLocked).toBe(false);
			expect(accessibility[2].isAccessible).toBe(false);
			expect(accessibility[2].isLocked).toBe(true);
			expect(accessibility[2].lockReason).toBe('previous-incomplete');
		});

		it('should mark in-progress course correctly', () => {
			const progress: CourseProgress[] = [
				{
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'in-progress',
					startedAt: '2024-01-15',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-20'
				}
			];

			const accessibility = markCoursesAccessibility(sequentialPath, progress);

			expect(accessibility[0].isInProgress).toBe(true);
			expect(accessibility[0].isAccessible).toBe(true);
			expect(accessibility[0].isCompleted).toBe(false);
		});
	});

	describe('isAccessibleInSequence', () => {
		it('should return true for first course with no progress', () => {
			const accessible = isAccessibleInSequence('course-1', sequentialPath, []);

			expect(accessible).toBe(true);
		});

		it('should return false for second course with no progress', () => {
			const accessible = isAccessibleInSequence('course-2', sequentialPath, []);

			expect(accessible).toBe(false);
		});

		it('should return true for second course when first is completed', () => {
			const progress: CourseProgress[] = [
				{
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					completedAt: '2024-01-20',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-20'
				}
			];

			const accessible = isAccessibleInSequence('course-2', sequentialPath, progress);

			expect(accessible).toBe(true);
		});

		it('should return true for all courses in automatic path', () => {
			expect(isAccessibleInSequence('course-1', automaticPath, [])).toBe(true);
			expect(isAccessibleInSequence('course-2', automaticPath, [])).toBe(true);
			expect(isAccessibleInSequence('course-3', automaticPath, [])).toBe(true);
		});
	});

	describe('getPreviousCourse', () => {
		it('should return null for first course', () => {
			const prev = getPreviousCourse('course-1', sequentialPath);

			expect(prev).toBeNull();
		});

		it('should return previous course', () => {
			const prev = getPreviousCourse('course-2', sequentialPath);

			expect(prev).not.toBeNull();
			expect(prev?.id).toBe('course-1');
		});

		it('should return null for non-existent course', () => {
			const prev = getPreviousCourse('non-existent', sequentialPath);

			expect(prev).toBeNull();
		});
	});

	describe('getNextCourse', () => {
		it('should return next course', () => {
			const next = getNextCourse('course-1', sequentialPath);

			expect(next).not.toBeNull();
			expect(next?.id).toBe('course-2');
		});

		it('should return null for last course', () => {
			const next = getNextCourse('course-3', sequentialPath);

			expect(next).toBeNull();
		});

		it('should return null for non-existent course', () => {
			const next = getNextCourse('non-existent', sequentialPath);

			expect(next).toBeNull();
		});
	});

	describe('calculateSequentialProgress', () => {
		it('should return 0% for no progress', () => {
			const percentage = calculateSequentialProgress(sequentialPath, []);

			expect(percentage).toBe(0);
		});

		it('should return 33% for one of three completed', () => {
			const progress: CourseProgress[] = [
				{
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					completedAt: '2024-01-20',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-20'
				}
			];

			const percentage = calculateSequentialProgress(sequentialPath, progress);

			expect(percentage).toBe(33);
		});

		it('should return 100% for all completed', () => {
			const progress: CourseProgress[] = [
				{ id: 'p1', user: 'user-1', course: 'course-1', status: 'completed', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
				{ id: 'p2', user: 'user-1', course: 'course-2', status: 'completed', createdAt: '2024-01-21', updatedAt: '2024-01-22' },
				{ id: 'p3', user: 'user-1', course: 'course-3', status: 'completed', createdAt: '2024-01-23', updatedAt: '2024-01-25' }
			];

			const percentage = calculateSequentialProgress(sequentialPath, progress);

			expect(percentage).toBe(100);
		});

		it('should return 0% for learning path with no courses', () => {
			const emptyPath: LearningPath = {
				...sequentialPath,
				bundles: []
			};

			const percentage = calculateSequentialProgress(emptyPath, []);

			expect(percentage).toBe(0);
		});
	});

	describe('isLearningPathComplete', () => {
		it('should return false when no progress', () => {
			const complete = isLearningPathComplete(sequentialPath, []);

			expect(complete).toBe(false);
		});

		it('should return false when some courses completed', () => {
			const progress: CourseProgress[] = [
				{
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					completedAt: '2024-01-20',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-20'
				}
			];

			const complete = isLearningPathComplete(sequentialPath, progress);

			expect(complete).toBe(false);
		});

		it('should return true when all courses completed', () => {
			const progress: CourseProgress[] = [
				{ id: 'p1', user: 'user-1', course: 'course-1', status: 'completed', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
				{ id: 'p2', user: 'user-1', course: 'course-2', status: 'completed', createdAt: '2024-01-21', updatedAt: '2024-01-22' },
				{ id: 'p3', user: 'user-1', course: 'course-3', status: 'completed', createdAt: '2024-01-23', updatedAt: '2024-01-25' }
			];

			const complete = isLearningPathComplete(sequentialPath, progress);

			expect(complete).toBe(true);
		});

		it('should return false for empty learning path', () => {
			const emptyPath: LearningPath = {
				...sequentialPath,
				bundles: []
			};

			const complete = isLearningPathComplete(emptyPath, []);

			expect(complete).toBe(false);
		});
	});

	describe('getCourseIndex', () => {
		it('should return correct index for course', () => {
			expect(getCourseIndex('course-1', sequentialPath)).toBe(0);
			expect(getCourseIndex('course-2', sequentialPath)).toBe(1);
			expect(getCourseIndex('course-3', sequentialPath)).toBe(2);
		});

		it('should return -1 for non-existent course', () => {
			expect(getCourseIndex('non-existent', sequentialPath)).toBe(-1);
		});
	});

	describe('getTotalCourseCount', () => {
		it('should return correct course count', () => {
			const count = getTotalCourseCount(sequentialPath);

			expect(count).toBe(3);
		});

		it('should return 0 for empty learning path', () => {
			const emptyPath: LearningPath = {
				...sequentialPath,
				bundles: []
			};

			const count = getTotalCourseCount(emptyPath);

			expect(count).toBe(0);
		});
	});
});
