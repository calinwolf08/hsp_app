import { describe, it, expect } from 'vitest';
import {
	extractCourseIds,
	extractAllCourses,
	extractAllModules,
	attachProgressToBundle,
	calculateBundleProgress,
	calculateModuleProgress,
	buildModuleWithProgress,
	buildBundleWithProgress,
	getTotalModuleCount,
	getTotalCourseCount,
	isBundleComplete,
	isModuleComplete,
	getCoursesByModule,
	findModuleByCourseId
} from './bundle-loader';
import type { Bundle, Module, Course } from '../../shared/types';
import type { CourseProgress } from '../../shared/types';

describe('bundle-loader utils', () => {
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

	const mockCourse4: Course = {
		id: 'course-4',
		name: 'Course 4',
		internal_name: 'course-4',
		slug: 'course-4',
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
		courses: [
			{ id: 'course-3-item', course: mockCourse3 },
			{ id: 'course-4-item', course: mockCourse4 }
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
		modules: [
			{ id: 'module-1-item', module: mockModule1 },
			{ id: 'module-2-item', module: mockModule2 }
		],
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

	describe('extractCourseIds', () => {
		it('should extract all course IDs from bundle', () => {
			const courseIds = extractCourseIds(mockBundle);
			expect(courseIds).toEqual(['course-1', 'course-2', 'course-3', 'course-4']);
		});

		it('should return empty array for bundle with no modules', () => {
			const emptyBundle: Bundle = {
				...mockBundle,
				modules: []
			};
			const courseIds = extractCourseIds(emptyBundle);
			expect(courseIds).toEqual([]);
		});

		it('should handle modules with string references', () => {
			const bundleWithStringRefs: Bundle = {
				...mockBundle,
				modules: [{ id: 'module-1', module: 'module-1' }]
			};
			const courseIds = extractCourseIds(bundleWithStringRefs);
			expect(courseIds).toEqual([]);
		});

		it('should handle modules with empty courses', () => {
			const moduleWithoutCourses: Module = {
				...mockModule1,
				courses: []
			};
			const bundle: Bundle = {
				...mockBundle,
				modules: [{ id: 'module-1-item', module: moduleWithoutCourses }]
			};
			const courseIds = extractCourseIds(bundle);
			expect(courseIds).toEqual([]);
		});
	});

	describe('extractAllCourses', () => {
		it('should extract all course objects from bundle', () => {
			const courses = extractAllCourses(mockBundle);
			expect(courses).toHaveLength(4);
			expect(courses.map((c) => c.id)).toEqual(['course-1', 'course-2', 'course-3', 'course-4']);
		});

		it('should return empty array for bundle with no modules', () => {
			const emptyBundle: Bundle = {
				...mockBundle,
				modules: []
			};
			const courses = extractAllCourses(emptyBundle);
			expect(courses).toEqual([]);
		});

		it('should handle modules with string references', () => {
			const bundleWithStringRefs: Bundle = {
				...mockBundle,
				modules: [{ id: 'module-1', module: 'module-1' }]
			};
			const courses = extractAllCourses(bundleWithStringRefs);
			expect(courses).toEqual([]);
		});
	});

	describe('extractAllModules', () => {
		it('should extract all module objects', () => {
			const modules = extractAllModules(mockBundle);
			expect(modules).toHaveLength(2);
			expect(modules.map((m) => m.id)).toEqual(['module-1', 'module-2']);
		});

		it('should return empty array for bundle with no modules', () => {
			const emptyBundle: Bundle = {
				...mockBundle,
				modules: []
			};
			const modules = extractAllModules(emptyBundle);
			expect(modules).toEqual([]);
		});

		it('should filter out string references', () => {
			const bundleWithStringRefs: Bundle = {
				...mockBundle,
				modules: [
					{ id: 'module-1-item', module: mockModule1 },
					{ id: 'module-2', module: 'module-2' }
				]
			};
			const modules = extractAllModules(bundleWithStringRefs);
			expect(modules).toHaveLength(1);
		});
	});

	describe('attachProgressToBundle', () => {
		it('should create progress map from course progress array', () => {
			const progressMap = attachProgressToBundle(mockBundle, mockCourseProgress);

			expect(progressMap.size).toBe(2);
			expect(progressMap.get('course-1')?.status).toBe('completed');
			expect(progressMap.get('course-2')?.status).toBe('in-progress');
		});

		it('should return empty map when no progress provided', () => {
			const progressMap = attachProgressToBundle(mockBundle, []);

			expect(progressMap.size).toBe(0);
		});
	});

	describe('calculateBundleProgress', () => {
		it('should calculate progress correctly', () => {
			const stats = calculateBundleProgress(mockBundle, mockCourseProgress);

			expect(stats.totalCourses).toBe(4);
			expect(stats.completedCourses).toBe(1);
			expect(stats.inProgressCourses).toBe(1);
			expect(stats.completionPercentage).toBe(25); // 1/4 = 25%
		});

		it('should return zero stats for bundle with no courses', () => {
			const emptyBundle: Bundle = {
				...mockBundle,
				modules: []
			};
			const stats = calculateBundleProgress(emptyBundle, mockCourseProgress);

			expect(stats.totalCourses).toBe(0);
			expect(stats.completedCourses).toBe(0);
			expect(stats.inProgressCourses).toBe(0);
			expect(stats.completionPercentage).toBe(0);
		});

		it('should handle all courses completed', () => {
			const allCompleted: CourseProgress[] = [
				{ id: 'p1', user: 'user-1', course: 'course-1', status: 'completed', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
				{ id: 'p2', user: 'user-1', course: 'course-2', status: 'completed', createdAt: '2024-01-21', updatedAt: '2024-01-22' },
				{ id: 'p3', user: 'user-1', course: 'course-3', status: 'completed', createdAt: '2024-01-23', updatedAt: '2024-01-25' },
				{ id: 'p4', user: 'user-1', course: 'course-4', status: 'completed', createdAt: '2024-01-26', updatedAt: '2024-01-27' }
			];

			const stats = calculateBundleProgress(mockBundle, allCompleted);

			expect(stats.completedCourses).toBe(4);
			expect(stats.inProgressCourses).toBe(0);
			expect(stats.completionPercentage).toBe(100);
		});

		it('should handle no progress', () => {
			const stats = calculateBundleProgress(mockBundle, []);

			expect(stats.completedCourses).toBe(0);
			expect(stats.inProgressCourses).toBe(0);
			expect(stats.completionPercentage).toBe(0);
		});
	});

	describe('calculateModuleProgress', () => {
		it('should calculate module progress correctly', () => {
			const stats = calculateModuleProgress(mockModule1, mockCourseProgress);

			expect(stats.totalCourses).toBe(2);
			expect(stats.completedCourses).toBe(1);
			expect(stats.inProgressCourses).toBe(1);
			expect(stats.completionPercentage).toBe(50); // 1/2 = 50%
		});

		it('should return zero stats for module with no courses', () => {
			const emptyModule: Module = {
				...mockModule1,
				courses: []
			};
			const stats = calculateModuleProgress(emptyModule, mockCourseProgress);

			expect(stats.totalCourses).toBe(0);
			expect(stats.completedCourses).toBe(0);
			expect(stats.inProgressCourses).toBe(0);
			expect(stats.completionPercentage).toBe(0);
		});

		it('should handle all courses completed', () => {
			const allCompleted: CourseProgress[] = [
				{ id: 'p1', user: 'user-1', course: 'course-1', status: 'completed', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
				{ id: 'p2', user: 'user-1', course: 'course-2', status: 'completed', createdAt: '2024-01-21', updatedAt: '2024-01-22' }
			];

			const stats = calculateModuleProgress(mockModule1, allCompleted);

			expect(stats.completionPercentage).toBe(100);
		});
	});

	describe('buildModuleWithProgress', () => {
		it('should build module with progress and courses', () => {
			const progressMap = attachProgressToBundle(mockBundle, mockCourseProgress);
			const moduleWithProgress = buildModuleWithProgress(mockModule1, progressMap);

			expect(moduleWithProgress.module).toBe(mockModule1);
			expect(moduleWithProgress.totalCourses).toBe(2);
			expect(moduleWithProgress.completedCourses).toBe(1);
			expect(moduleWithProgress.inProgressCourses).toBe(1);
			expect(moduleWithProgress.courses).toHaveLength(2);
			expect(moduleWithProgress.courses[0].isCompleted).toBe(true);
			expect(moduleWithProgress.courses[1].isInProgress).toBe(true);
		});

		it('should handle module with no progress', () => {
			const progressMap = new Map();
			const moduleWithProgress = buildModuleWithProgress(mockModule1, progressMap);

			expect(moduleWithProgress.completedCourses).toBe(0);
			expect(moduleWithProgress.courses[0].isNotStarted).toBe(true);
			expect(moduleWithProgress.courses[1].isNotStarted).toBe(true);
		});
	});

	describe('buildBundleWithProgress', () => {
		it('should build complete bundle with progress', () => {
			const bundleWithProgress = buildBundleWithProgress(mockBundle, mockCourseProgress);

			expect(bundleWithProgress.bundle).toBe(mockBundle);
			expect(bundleWithProgress.totalCourses).toBe(4);
			expect(bundleWithProgress.completedCourses).toBe(1);
			expect(bundleWithProgress.inProgressCourses).toBe(1);
			expect(bundleWithProgress.completionPercentage).toBe(25);
			expect(bundleWithProgress.modules).toHaveLength(2);
		});

		it('should handle no progress', () => {
			const bundleWithProgress = buildBundleWithProgress(mockBundle, []);

			expect(bundleWithProgress.completedCourses).toBe(0);
			expect(bundleWithProgress.completionPercentage).toBe(0);
		});

		it('should handle all courses completed', () => {
			const allCompleted: CourseProgress[] = [
				{ id: 'p1', user: 'user-1', course: 'course-1', status: 'completed', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
				{ id: 'p2', user: 'user-1', course: 'course-2', status: 'completed', createdAt: '2024-01-21', updatedAt: '2024-01-22' },
				{ id: 'p3', user: 'user-1', course: 'course-3', status: 'completed', createdAt: '2024-01-23', updatedAt: '2024-01-25' },
				{ id: 'p4', user: 'user-1', course: 'course-4', status: 'completed', createdAt: '2024-01-26', updatedAt: '2024-01-27' }
			];

			const bundleWithProgress = buildBundleWithProgress(mockBundle, allCompleted);

			expect(bundleWithProgress.completionPercentage).toBe(100);
		});
	});

	describe('getTotalModuleCount', () => {
		it('should return correct module count', () => {
			const count = getTotalModuleCount(mockBundle);
			expect(count).toBe(2);
		});

		it('should return 0 for empty bundle', () => {
			const emptyBundle: Bundle = {
				...mockBundle,
				modules: []
			};
			const count = getTotalModuleCount(emptyBundle);
			expect(count).toBe(0);
		});
	});

	describe('getTotalCourseCount', () => {
		it('should return correct course count', () => {
			const count = getTotalCourseCount(mockBundle);
			expect(count).toBe(4);
		});

		it('should return 0 for empty bundle', () => {
			const emptyBundle: Bundle = {
				...mockBundle,
				modules: []
			};
			const count = getTotalCourseCount(emptyBundle);
			expect(count).toBe(0);
		});
	});

	describe('isBundleComplete', () => {
		it('should return false when no progress', () => {
			const complete = isBundleComplete(mockBundle, []);
			expect(complete).toBe(false);
		});

		it('should return false when some courses completed', () => {
			const complete = isBundleComplete(mockBundle, mockCourseProgress);
			expect(complete).toBe(false);
		});

		it('should return true when all courses completed', () => {
			const allCompleted: CourseProgress[] = [
				{ id: 'p1', user: 'user-1', course: 'course-1', status: 'completed', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
				{ id: 'p2', user: 'user-1', course: 'course-2', status: 'completed', createdAt: '2024-01-21', updatedAt: '2024-01-22' },
				{ id: 'p3', user: 'user-1', course: 'course-3', status: 'completed', createdAt: '2024-01-23', updatedAt: '2024-01-25' },
				{ id: 'p4', user: 'user-1', course: 'course-4', status: 'completed', createdAt: '2024-01-26', updatedAt: '2024-01-27' }
			];

			const complete = isBundleComplete(mockBundle, allCompleted);
			expect(complete).toBe(true);
		});

		it('should return false for empty bundle', () => {
			const emptyBundle: Bundle = {
				...mockBundle,
				modules: []
			};
			const complete = isBundleComplete(emptyBundle, []);
			expect(complete).toBe(false);
		});
	});

	describe('isModuleComplete', () => {
		it('should return false when no progress', () => {
			const complete = isModuleComplete(mockModule1, []);
			expect(complete).toBe(false);
		});

		it('should return false when some courses completed', () => {
			const complete = isModuleComplete(mockModule1, mockCourseProgress);
			expect(complete).toBe(false);
		});

		it('should return true when all courses completed', () => {
			const allCompleted: CourseProgress[] = [
				{ id: 'p1', user: 'user-1', course: 'course-1', status: 'completed', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
				{ id: 'p2', user: 'user-1', course: 'course-2', status: 'completed', createdAt: '2024-01-21', updatedAt: '2024-01-22' }
			];

			const complete = isModuleComplete(mockModule1, allCompleted);
			expect(complete).toBe(true);
		});
	});

	describe('getCoursesByModule', () => {
		it('should return courses for valid module', () => {
			const courses = getCoursesByModule('module-1', mockBundle);
			expect(courses).toHaveLength(2);
			expect(courses.map((c) => c.id)).toEqual(['course-1', 'course-2']);
		});

		it('should return empty array for non-existent module', () => {
			const courses = getCoursesByModule('non-existent', mockBundle);
			expect(courses).toEqual([]);
		});

		it('should filter out string references', () => {
			const moduleWithStringRefs: Module = {
				...mockModule1,
				courses: [
					{ id: 'course-1-item', course: mockCourse1 },
					{ id: 'course-2', course: 'course-2' }
				]
			};
			const bundle: Bundle = {
				...mockBundle,
				modules: [{ id: 'module-1-item', module: moduleWithStringRefs }]
			};
			const courses = getCoursesByModule('module-1', bundle);
			expect(courses).toHaveLength(1);
		});
	});

	describe('findModuleByCourseId', () => {
		it('should find module containing the course', () => {
			const module = findModuleByCourseId('course-1', mockBundle);
			expect(module).not.toBeNull();
			expect(module?.id).toBe('module-1');
		});

		it('should find module for course in second module', () => {
			const module = findModuleByCourseId('course-3', mockBundle);
			expect(module).not.toBeNull();
			expect(module?.id).toBe('module-2');
		});

		it('should return null if course not found', () => {
			const module = findModuleByCourseId('non-existent', mockBundle);
			expect(module).toBeNull();
		});

		it('should return null for bundle with no modules', () => {
			const emptyBundle: Bundle = {
				...mockBundle,
				modules: []
			};
			const module = findModuleByCourseId('course-1', emptyBundle);
			expect(module).toBeNull();
		});
	});
});
