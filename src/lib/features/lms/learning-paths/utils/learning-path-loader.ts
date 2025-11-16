import type { LearningPath, Bundle, Module, Course } from '../../shared/types';
import type { CourseProgress } from '../../shared/types';
import type { LearningPathWithProgress } from '../types';

/**
 * Extract all course IDs from a learning path
 */
export const extractAllCourseIds = (learningPath: LearningPath): string[] => {
	const courseIds: string[] = [];

	for (const bundleItem of learningPath.bundles) {
		const bundle = typeof bundleItem.bundle === 'string' ? null : bundleItem.bundle;
		if (!bundle) continue;

		for (const moduleItem of bundle.modules) {
			const module = typeof moduleItem.module === 'string' ? null : moduleItem.module;
			if (!module) continue;

			for (const courseItem of module.courses) {
				const course = typeof courseItem.course === 'string' ? courseItem.id : courseItem.course;
				if (typeof course !== 'string') {
					courseIds.push(course.id);
				}
			}
		}
	}

	return courseIds;
};

/**
 * Extract all courses (full objects) from a learning path
 */
export const extractAllCourses = (learningPath: LearningPath): Course[] => {
	const courses: Course[] = [];

	for (const bundleItem of learningPath.bundles) {
		const bundle = typeof bundleItem.bundle === 'string' ? null : bundleItem.bundle;
		if (!bundle) continue;

		for (const moduleItem of bundle.modules) {
			const module = typeof moduleItem.module === 'string' ? null : moduleItem.module;
			if (!module) continue;

			for (const courseItem of module.courses) {
				const course = typeof courseItem.course === 'string' ? null : courseItem.course;
				if (course) {
					courses.push(course);
				}
			}
		}
	}

	return courses;
};

/**
 * Attach progress data to learning path
 */
export const attachProgressToPath = (
	learningPath: LearningPath,
	courseProgress: CourseProgress[]
): Map<string, CourseProgress> => {
	const progressMap = new Map<string, CourseProgress>();

	for (const progress of courseProgress) {
		progressMap.set(progress.course, progress);
	}

	return progressMap;
};

/**
 * Calculate overall progress for a learning path
 */
export const calculatePathProgress = (
	learningPath: LearningPath,
	courseProgress: CourseProgress[]
): {
	totalCourses: number;
	completedCourses: number;
	inProgressCourses: number;
	completionPercentage: number;
} => {
	const courseIds = extractAllCourseIds(learningPath);
	const totalCourses = courseIds.length;

	if (totalCourses === 0) {
		return {
			totalCourses: 0,
			completedCourses: 0,
			inProgressCourses: 0,
			completionPercentage: 0
		};
	}

	let completedCourses = 0;
	let inProgressCourses = 0;

	for (const courseId of courseIds) {
		const progress = courseProgress.find((p) => p.course === courseId);
		if (progress) {
			if (progress.status === 'completed') {
				completedCourses++;
			} else if (progress.status === 'in-progress') {
				inProgressCourses++;
			}
		}
	}

	const completionPercentage = Math.round((completedCourses / totalCourses) * 100);

	return {
		totalCourses,
		completedCourses,
		inProgressCourses,
		completionPercentage
	};
};

/**
 * Find the current course (first in-progress or first not started)
 */
export const findCurrentCourse = (
	learningPath: LearningPath,
	courseProgress: CourseProgress[]
): Course | null => {
	const courses = extractAllCourses(learningPath);
	const progressMap = new Map(courseProgress.map((p) => [p.course, p]));

	// First, look for in-progress course
	for (const course of courses) {
		const progress = progressMap.get(course.id);
		if (progress?.status === 'in-progress') {
			return course;
		}
	}

	// If no in-progress, return first not-started course
	for (const course of courses) {
		const progress = progressMap.get(course.id);
		if (!progress || progress.status === 'not-started') {
			return course;
		}
	}

	return null;
};

/**
 * Find the next course to start
 */
export const findNextCourse = (
	learningPath: LearningPath,
	courseProgress: CourseProgress[]
): Course | null => {
	const courses = extractAllCourses(learningPath);
	const progressMap = new Map(courseProgress.map((p) => [p.course, p]));

	// Return first not-started or not-completed course
	for (const course of courses) {
		const progress = progressMap.get(course.id);
		if (!progress || progress.status !== 'completed') {
			return course;
		}
	}

	return null;
};

/**
 * Build LearningPathWithProgress object
 */
export const buildPathWithProgress = (
	learningPath: LearningPath,
	courseProgress: CourseProgress[]
): LearningPathWithProgress => {
	const progressStats = calculatePathProgress(learningPath, courseProgress);
	const currentCourse = findCurrentCourse(learningPath, courseProgress);
	const nextCourse = findNextCourse(learningPath, courseProgress);

	return {
		learningPath,
		...progressStats,
		currentCourse: currentCourse || undefined,
		nextCourse: nextCourse || undefined
	};
};

/**
 * Get all bundles from a learning path
 */
export const extractAllBundles = (learningPath: LearningPath): Bundle[] => {
	return learningPath.bundles
		.map((item) => (typeof item.bundle === 'string' ? null : item.bundle))
		.filter((bundle): bundle is Bundle => bundle !== null);
};

/**
 * Get all modules from a learning path
 */
export const extractAllModules = (learningPath: LearningPath): Module[] => {
	const modules: Module[] = [];
	const bundles = extractAllBundles(learningPath);

	for (const bundle of bundles) {
		const bundleModules = bundle.modules
			.map((item) => (typeof item.module === 'string' ? null : item.module))
			.filter((module): module is Module => module !== null);
		modules.push(...bundleModules);
	}

	return modules;
};

/**
 * Get course count by bundle
 */
export const getCourseCountByBundle = (bundle: Bundle): number => {
	let count = 0;
	for (const moduleItem of bundle.modules) {
		const module = typeof moduleItem.module === 'string' ? null : moduleItem.module;
		if (module) {
			count += module.courses.length;
		}
	}
	return count;
};

/**
 * Get course count by module
 */
export const getCourseCountByModule = (module: Module): number => {
	return module.courses.filter((item) => typeof item.course !== 'string').length;
};
