import { describe, it, expect } from 'vitest';
import {
	extractAllCourseIds,
	extractAllCourses,
	attachProgressToPath,
	calculatePathProgress,
	findCurrentCourse,
	findNextCourse,
	buildPathWithProgress,
	extractAllBundles,
	extractAllModules,
	getCourseCountByBundle,
	getCourseCountByModule
} from './learning-path-loader';
import type { LearningPath, Bundle, Module, Course } from '../../shared/types';
import type { CourseProgress } from '../../shared/types';

describe('learning-path-loader utils', () => {
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

	const mockModule1: Module = {
		id: 'module-1',
		name: 'Module 1',
		internal_name: 'module-1',
		description: {},
		published: true,
		courses: [
			{ id: 'course-1-item', course: mockCourse1 },
			{ id: 'course-2-item', course: mockCourse2 }
		],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockModule2: Module = {
		id: 'module-2',
		name: 'Module 2',
		internal_name: 'module-2',
		description: {},
		published: true,
		courses: [{ id: 'course-3-item', course: mockCourse3 }],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockBundle1: Bundle = {
		id: 'bundle-1',
		name: 'Bundle 1',
		internal_name: 'bundle-1',
		description: {},
		published: true,
		categories: [],
		tags: [],
		modules: [
			{ id: 'module-1-item', module: mockModule1 },
			{ id: 'module-2-item', module: mockModule2 }
		],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockLearningPath: LearningPath = {
		id: 'path-1',
		name: 'Learning Path 1',
		internal_name: 'learning-path-1',
		description: {},
		published: true,
		accessType: 'sequential',
		categories: [],
		tags: [],
		bundles: [{ id: 'bundle-1-item', bundle: mockBundle1 }],
		createdAt: '2024-01-01',
		updatedAt: '2024-01-01'
	};

	const mockCourseProgress: CourseProgress[] = [
		{
			id: 'progress-1',
			user: 'user-1',
			course: 'course-1',
			status: 'completed',
			startedAt: '2024-01-15',
			completedAt: '2024-01-20',
			createdAt: '2024-01-15',
			updatedAt: '2024-01-20'
		},
		{
			id: 'progress-2',
			user: 'user-1',
			course: 'course-2',
			status: 'in-progress',
			startedAt: '2024-01-21',
			createdAt: '2024-01-21',
			updatedAt: '2024-01-22'
		}
	];

	describe('extractAllCourseIds', () => {
		it('should extract all course IDs from learning path', () => {
			const courseIds = extractAllCourseIds(mockLearningPath);
			expect(courseIds).toEqual(['course-1', 'course-2', 'course-3']);
		});

		it('should return empty array for learning path with no bundles', () => {
			const emptyPath: LearningPath = {
				...mockLearningPath,
				bundles: []
			};
			const courseIds = extractAllCourseIds(emptyPath);
			expect(courseIds).toEqual([]);
		});

		it('should handle bundles with string references', () => {
			const pathWithStringRefs: LearningPath = {
				...mockLearningPath,
				bundles: [{ id: 'bundle-1', bundle: 'bundle-1' }]
			};
			const courseIds = extractAllCourseIds(pathWithStringRefs);
			expect(courseIds).toEqual([]);
		});

		it('should handle modules with string references', () => {
			const bundleWithStringRefs: Bundle = {
				...mockBundle1,
				modules: [{ id: 'module-1', module: 'module-1' }]
			};
			const pathWithStringRefs: LearningPath = {
				...mockLearningPath,
				bundles: [{ id: 'bundle-1-item', bundle: bundleWithStringRefs }]
			};
			const courseIds = extractAllCourseIds(pathWithStringRefs);
			expect(courseIds).toEqual([]);
		});
	});

	describe('extractAllCourses', () => {
		it('should extract all course objects from learning path', () => {
			const courses = extractAllCourses(mockLearningPath);
			expect(courses).toHaveLength(3);
			expect(courses.map((c) => c.id)).toEqual(['course-1', 'course-2', 'course-3']);
		});

		it('should return empty array for learning path with no bundles', () => {
			const emptyPath: LearningPath = {
				...mockLearningPath,
				bundles: []
			};
			const courses = extractAllCourses(emptyPath);
			expect(courses).toEqual([]);
		});

		it('should handle bundles with string references', () => {
			const pathWithStringRefs: LearningPath = {
				...mockLearningPath,
				bundles: [{ id: 'bundle-1', bundle: 'bundle-1' }]
			};
			const courses = extractAllCourses(pathWithStringRefs);
			expect(courses).toEqual([]);
		});
	});

	describe('attachProgressToPath', () => {
		it('should create progress map from course progress array', () => {
			const progressMap = attachProgressToPath(mockLearningPath, mockCourseProgress);

			expect(progressMap.size).toBe(2);
			expect(progressMap.get('course-1')?.status).toBe('completed');
			expect(progressMap.get('course-2')?.status).toBe('in-progress');
		});

		it('should return empty map when no progress provided', () => {
			const progressMap = attachProgressToPath(mockLearningPath, []);

			expect(progressMap.size).toBe(0);
		});

		it('should handle duplicate course IDs (last one wins)', () => {
			const duplicateProgress: CourseProgress[] = [
				{
					id: 'progress-1',
					user: 'user-1',
					course: 'course-1',
					status: 'in-progress',
					createdAt: '2024-01-15',
					updatedAt: '2024-01-15'
				},
				{
					id: 'progress-2',
					user: 'user-1',
					course: 'course-1',
					status: 'completed',
					createdAt: '2024-01-16',
					updatedAt: '2024-01-16'
				}
			];

			const progressMap = attachProgressToPath(mockLearningPath, duplicateProgress);

			expect(progressMap.get('course-1')?.status).toBe('completed');
		});
	});

	describe('calculatePathProgress', () => {
		it('should calculate progress correctly', () => {
			const stats = calculatePathProgress(mockLearningPath, mockCourseProgress);

			expect(stats.totalCourses).toBe(3);
			expect(stats.completedCourses).toBe(1);
			expect(stats.inProgressCourses).toBe(1);
			expect(stats.completionPercentage).toBe(33); // 1/3 = 33%
		});

		it('should return zero stats for learning path with no courses', () => {
			const emptyPath: LearningPath = {
				...mockLearningPath,
				bundles: []
			};
			const stats = calculatePathProgress(emptyPath, mockCourseProgress);

			expect(stats.totalCourses).toBe(0);
			expect(stats.completedCourses).toBe(0);
			expect(stats.inProgressCourses).toBe(0);
			expect(stats.completionPercentage).toBe(0);
		});

		it('should handle all courses completed', () => {
			const allCompleted: CourseProgress[] = [
				{ ...mockCourseProgress[0], course: 'course-1', status: 'completed' },
				{ ...mockCourseProgress[0], course: 'course-2', status: 'completed' },
				{ ...mockCourseProgress[0], course: 'course-3', status: 'completed' }
			];

			const stats = calculatePathProgress(mockLearningPath, allCompleted);

			expect(stats.completedCourses).toBe(3);
			expect(stats.inProgressCourses).toBe(0);
			expect(stats.completionPercentage).toBe(100);
		});

		it('should handle no progress', () => {
			const stats = calculatePathProgress(mockLearningPath, []);

			expect(stats.completedCourses).toBe(0);
			expect(stats.inProgressCourses).toBe(0);
			expect(stats.completionPercentage).toBe(0);
		});

		it('should round completion percentage', () => {
			const oneCompleted: CourseProgress[] = [
				{ ...mockCourseProgress[0], course: 'course-1', status: 'completed' }
			];

			const stats = calculatePathProgress(mockLearningPath, oneCompleted);

			expect(stats.completionPercentage).toBe(33); // 1/3 = 0.333... -> 33
		});
	});

	describe('findCurrentCourse', () => {
		it('should return in-progress course if one exists', () => {
			const current = findCurrentCourse(mockLearningPath, mockCourseProgress);

			expect(current).not.toBeNull();
			expect(current?.id).toBe('course-2');
		});

		it('should return first not-started course if no in-progress', () => {
			const noInProgress: CourseProgress[] = [
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

			const current = findCurrentCourse(mockLearningPath, noInProgress);

			expect(current).not.toBeNull();
			expect(current?.id).toBe('course-2');
		});

		it('should return null if all courses completed', () => {
			const allCompleted: CourseProgress[] = [
				{ ...mockCourseProgress[0], course: 'course-1', status: 'completed' },
				{ ...mockCourseProgress[0], course: 'course-2', status: 'completed' },
				{ ...mockCourseProgress[0], course: 'course-3', status: 'completed' }
			];

			const current = findCurrentCourse(mockLearningPath, allCompleted);

			expect(current).toBeNull();
		});

		it('should return first course if no progress', () => {
			const current = findCurrentCourse(mockLearningPath, []);

			expect(current).not.toBeNull();
			expect(current?.id).toBe('course-1');
		});
	});

	describe('findNextCourse', () => {
		it('should return first not-completed course', () => {
			const next = findNextCourse(mockLearningPath, mockCourseProgress);

			expect(next).not.toBeNull();
			expect(next?.id).toBe('course-2');
		});

		it('should return null if all courses completed', () => {
			const allCompleted: CourseProgress[] = [
				{ ...mockCourseProgress[0], course: 'course-1', status: 'completed' },
				{ ...mockCourseProgress[0], course: 'course-2', status: 'completed' },
				{ ...mockCourseProgress[0], course: 'course-3', status: 'completed' }
			];

			const next = findNextCourse(mockLearningPath, allCompleted);

			expect(next).toBeNull();
		});

		it('should return first course if no progress', () => {
			const next = findNextCourse(mockLearningPath, []);

			expect(next).not.toBeNull();
			expect(next?.id).toBe('course-1');
		});
	});

	describe('buildPathWithProgress', () => {
		it('should build complete learning path with progress', () => {
			const pathWithProgress = buildPathWithProgress(mockLearningPath, mockCourseProgress);

			expect(pathWithProgress.learningPath).toBe(mockLearningPath);
			expect(pathWithProgress.totalCourses).toBe(3);
			expect(pathWithProgress.completedCourses).toBe(1);
			expect(pathWithProgress.inProgressCourses).toBe(1);
			expect(pathWithProgress.completionPercentage).toBe(33);
			expect(pathWithProgress.currentCourse?.id).toBe('course-2');
			expect(pathWithProgress.nextCourse?.id).toBe('course-2');
		});

		it('should handle no progress', () => {
			const pathWithProgress = buildPathWithProgress(mockLearningPath, []);

			expect(pathWithProgress.completedCourses).toBe(0);
			expect(pathWithProgress.currentCourse?.id).toBe('course-1');
			expect(pathWithProgress.nextCourse?.id).toBe('course-1');
		});

		it('should handle all courses completed', () => {
			const allCompleted: CourseProgress[] = [
				{ ...mockCourseProgress[0], course: 'course-1', status: 'completed' },
				{ ...mockCourseProgress[0], course: 'course-2', status: 'completed' },
				{ ...mockCourseProgress[0], course: 'course-3', status: 'completed' }
			];

			const pathWithProgress = buildPathWithProgress(mockLearningPath, allCompleted);

			expect(pathWithProgress.completionPercentage).toBe(100);
			expect(pathWithProgress.currentCourse).toBeUndefined();
			expect(pathWithProgress.nextCourse).toBeUndefined();
		});
	});

	describe('extractAllBundles', () => {
		it('should extract all bundle objects', () => {
			const bundles = extractAllBundles(mockLearningPath);

			expect(bundles).toHaveLength(1);
			expect(bundles[0].id).toBe('bundle-1');
		});

		it('should return empty array for learning path with no bundles', () => {
			const emptyPath: LearningPath = {
				...mockLearningPath,
				bundles: []
			};
			const bundles = extractAllBundles(emptyPath);

			expect(bundles).toEqual([]);
		});

		it('should filter out string references', () => {
			const pathWithStringRefs: LearningPath = {
				...mockLearningPath,
				bundles: [
					{ id: 'bundle-1-item', bundle: mockBundle1 },
					{ id: 'bundle-2', bundle: 'bundle-2' }
				]
			};
			const bundles = extractAllBundles(pathWithStringRefs);

			expect(bundles).toHaveLength(1);
		});
	});

	describe('extractAllModules', () => {
		it('should extract all module objects', () => {
			const modules = extractAllModules(mockLearningPath);

			expect(modules).toHaveLength(2);
			expect(modules.map((m) => m.id)).toEqual(['module-1', 'module-2']);
		});

		it('should return empty array for learning path with no bundles', () => {
			const emptyPath: LearningPath = {
				...mockLearningPath,
				bundles: []
			};
			const modules = extractAllModules(emptyPath);

			expect(modules).toEqual([]);
		});

		it('should filter out string references', () => {
			const bundleWithStringRefs: Bundle = {
				...mockBundle1,
				modules: [
					{ id: 'module-1-item', module: mockModule1 },
					{ id: 'module-2', module: 'module-2' }
				]
			};
			const pathWithStringRefs: LearningPath = {
				...mockLearningPath,
				bundles: [{ id: 'bundle-1-item', bundle: bundleWithStringRefs }]
			};
			const modules = extractAllModules(pathWithStringRefs);

			expect(modules).toHaveLength(1);
		});
	});

	describe('getCourseCountByBundle', () => {
		it('should count all courses in bundle', () => {
			const count = getCourseCountByBundle(mockBundle1);

			expect(count).toBe(3);
		});

		it('should return 0 for bundle with no modules', () => {
			const emptyBundle: Bundle = {
				...mockBundle1,
				modules: []
			};
			const count = getCourseCountByBundle(emptyBundle);

			expect(count).toBe(0);
		});

		it('should handle modules with string references', () => {
			const bundleWithStringRefs: Bundle = {
				...mockBundle1,
				modules: [{ id: 'module-1', module: 'module-1' }]
			};
			const count = getCourseCountByBundle(bundleWithStringRefs);

			expect(count).toBe(0);
		});
	});

	describe('getCourseCountByModule', () => {
		it('should count all courses in module', () => {
			const count = getCourseCountByModule(mockModule1);

			expect(count).toBe(2);
		});

		it('should return 0 for module with no courses', () => {
			const emptyModule: Module = {
				...mockModule1,
				courses: []
			};
			const count = getCourseCountByModule(emptyModule);

			expect(count).toBe(0);
		});

		it('should filter out string references', () => {
			const moduleWithStringRefs: Module = {
				...mockModule1,
				courses: [
					{ id: 'course-1-item', course: mockCourse1 },
					{ id: 'course-2', course: 'course-2' }
				]
			};
			const count = getCourseCountByModule(moduleWithStringRefs);

			expect(count).toBe(1);
		});
	});
});
