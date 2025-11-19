import type { LearningPathDepth4, BundleDepth3, ModuleDepth2, CourseDepth1, Course } from '../../shared/types';
import type { CourseProgress } from '../../shared/types';
import type { LearningPathWithProgress } from '../types';
import { getCourseId } from '../../shared/types/content';

/**
 * Extract all course IDs from a learning path
 */
export const extractAllCourseIds = (learningPath: LearningPathDepth4): number[] => {
	const courseIds: number[] = [];

	for (const bundleItem of learningPath.bundles) {
		const bundle = bundleItem.bundle;

		for (const moduleItem of bundle.modules) {
			const module = moduleItem.module;

			for (const courseItem of module.courses) {
				courseIds.push(courseItem.course.id);
			}
		}
	}

	return courseIds;
};

/**
 * Extract all courses (full objects) from a learning path
 */
export const extractAllCourses = (learningPath: LearningPathDepth4): CourseDepth1[] => {
	const courses: CourseDepth1[] = [];

	for (const bundleItem of learningPath.bundles) {
		const bundle = bundleItem.bundle;

		for (const moduleItem of bundle.modules) {
			const module = moduleItem.module;

			for (const courseItem of module.courses) {
				courses.push(courseItem.course);
			}
		}
	}

	return courses;
};

/**
 * Attach progress data to learning path
 */
export const attachProgressToPath = (
	learningPath: LearningPathDepth4,
	courseProgress: CourseProgress[]
): Map<number, CourseProgress> => {
	const progressMap = new Map<number, CourseProgress>();

	for (const progress of courseProgress) {
		progressMap.set(getCourseId(progress.course), progress);
	}

	return progressMap;
};

/**
 * Calculate overall progress for a learning path
 */
export const calculatePathProgress = (
	learningPath: LearningPathDepth4,
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
		const progress = courseProgress.find((p) => getCourseId(p.course) === courseId);
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
	learningPath: LearningPathDepth4,
	courseProgress: CourseProgress[]
): CourseDepth1 | null => {
	const courses = extractAllCourses(learningPath);
	const progressMap = new Map(courseProgress.map((p) => [getCourseId(p.course), p]));

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
	learningPath: LearningPathDepth4,
	courseProgress: CourseProgress[]
): CourseDepth1 | null => {
	const courses = extractAllCourses(learningPath);
	const progressMap = new Map(courseProgress.map((p) => [getCourseId(p.course), p]));

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
	learningPath: LearningPathDepth4,
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
export const extractAllBundles = (learningPath: LearningPathDepth4): BundleDepth3[] => {
	return learningPath.bundles.map((item) => item.bundle);
};

/**
 * Get all modules from a learning path
 */
export const extractAllModules = (learningPath: LearningPathDepth4): ModuleDepth2[] => {
	const modules: ModuleDepth2[] = [];
	const bundles = extractAllBundles(learningPath);

	for (const bundle of bundles) {
		const bundleModules = bundle.modules.map((item) => item.module);
		modules.push(...bundleModules);
	}

	return modules;
};

/**
 * Get course count by bundle
 */
export const getCourseCountByBundle = (bundle: BundleDepth3): number => {
	let count = 0;
	for (const moduleItem of bundle.modules) {
		count += moduleItem.module.courses.length;
	}
	return count;
};

/**
 * Get course count by module
 */
export const getCourseCountByModule = (module: ModuleDepth2): number => {
	return module.courses.length;
};
