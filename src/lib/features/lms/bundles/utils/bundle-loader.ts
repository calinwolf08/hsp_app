import type {
	Bundle,
	BundleDepth1,
	BundleDepth2,
	Module,
	ModuleDepth1,
	ModuleDepth2,
	Course,
	CourseDepth1
} from '../../shared/types';
import { getCourseId, getModuleId, isBundleDepth1, isBundleDepth2 } from '../../shared/types/content';
import type { BundleProgress, CourseProgress } from '../../shared/types';
import type { BundleWithProgress, ModuleWithProgress, CourseWithProgress } from '../types';

/**
 * Extract all course IDs from a bundle
 * Requires BundleDepth2 (modules populated, courses can be IDs or objects)
 */
export const extractCourseIds = (bundle: Bundle): number[] => {
	const courseIds: number[] = [];

	if (!isBundleDepth2(bundle)) {
		console.warn('extractCourseIds requires BundleDepth2');
		return [];
	}

	for (const moduleItem of bundle.modules) {
		const module = moduleItem.module;
		// Module is populated at BundleDepth2

		for (const courseItem of module.courses) {
			courseIds.push(getCourseId(courseItem.course));
		}
	}

	return courseIds;
};

/**
 * Extract all courses (full objects) from a bundle
 * Requires BundleDepth2 with courses populated (not just IDs)
 */
export const extractAllCourses = (bundle: Bundle): CourseDepth1[] => {
	const courses: CourseDepth1[] = [];

	if (!isBundleDepth2(bundle)) {
		console.warn('extractAllCourses requires BundleDepth2');
		return [];
	}

	for (const moduleItem of bundle.modules) {
		const module = moduleItem.module;

		for (const courseItem of module.courses) {
			const course = courseItem.course;
			if (typeof course !== 'number') {
				courses.push(course);
			}
		}
	}

	return courses;
};

/**
 * Extract all modules from a bundle
 * Requires BundleDepth1 (modules populated)
 */
export const extractAllModules = (bundle: Bundle): ModuleDepth1[] => {
	if (!isBundleDepth1(bundle)) {
		console.warn('extractAllModules requires BundleDepth1');
		return [];
	}

	return bundle.modules.map((item) => item.module);
};

/**
 * Attach progress data to bundle
 */
export const attachProgressToBundle = (
	bundle: Bundle,
	courseProgress: CourseProgress[]
): Map<number, CourseProgress> => {
	const progressMap = new Map<number, CourseProgress>();

	for (const progress of courseProgress) {
		progressMap.set(getCourseId(progress.course), progress);
	}

	return progressMap;
};

/**
 * Calculate overall progress for a bundle
 */
export const calculateBundleProgress = (
	bundle: Bundle,
	courseProgress: CourseProgress[]
): {
	totalCourses: number;
	completedCourses: number;
	inProgressCourses: number;
	completionPercentage: number;
} => {
	const courseIds = extractCourseIds(bundle);
	const totalCourses = courseIds.length;

	if (totalCourses === 0) {
		return {
			totalCourses: 0,
			completedCourses: 0,
			inProgressCourses: 0,
			completionPercentage: 0
		};
	}

	const progressMap = attachProgressToBundle(bundle, courseProgress);

	let completedCourses = 0;
	let inProgressCourses = 0;

	for (const courseId of courseIds) {
		const progress = progressMap.get(courseId);
		if (progress?.status === 'completed') {
			completedCourses++;
		} else if (progress?.status === 'in-progress') {
			inProgressCourses++;
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
 * Get course IDs from a module
 */
const getCourseIdsFromModule = (module: ModuleDepth1 | ModuleDepth2): number[] => {
	return module.courses.map((item) => getCourseId(item.course));
};

/**
 * Calculate completion percentage for a module
 */
export const calculateModuleCompletion = (
	module: ModuleDepth1 | ModuleDepth2,
	courseProgress: CourseProgress[]
): number => {
	const courseIds = getCourseIdsFromModule(module);
	const totalCourses = courseIds.length;

	if (totalCourses === 0) return 0;

	const progressMap = new Map<number, CourseProgress>();
	for (const progress of courseProgress) {
		progressMap.set(getCourseId(progress.course), progress);
	}

	let completedCourses = 0;
	for (const courseId of courseIds) {
		const progress = progressMap.get(courseId);
		if (progress?.status === 'completed') {
			completedCourses++;
		}
	}

	return Math.round((completedCourses / totalCourses) * 100);
};

/**
 * Attach progress to module with courses
 */
export const attachProgressToModule = (
	module: ModuleDepth2,
	courseProgress: CourseProgress[]
): ModuleWithProgress => {
	const courses: CourseWithProgress[] = module.courses
		.map((item) => {
			const course = item.course;
			if (typeof course === 'number') {
				return null;
			}

			const progress = courseProgress.find((p) => getCourseId(p.course) === course.id);

			return {
				course,
				progress: progress || null,
				completionPercentage: progress?.status === 'completed' ? 100 : 0
			};
		})
		.filter((c): c is CourseWithProgress => c !== null);

	const completionPercentage = calculateModuleCompletion(module, courseProgress);

	return {
		module,
		courses,
		completionPercentage
	};
};

/**
 * Build BundleWithProgress from bundle and progress data
 */
export const buildBundleWithProgress = (
	bundle: BundleDepth2,
	bundleProgress: BundleProgress | null,
	courseProgress: CourseProgress[]
): BundleWithProgress => {
	const modules: ModuleWithProgress[] = bundle.modules.map((item) =>
		attachProgressToModule(item.module, courseProgress)
	);

	const {
		totalCourses,
		completedCourses,
		inProgressCourses,
		completionPercentage
	} = calculateBundleProgress(bundle, courseProgress);

	return {
		bundle,
		modules,
		progress: bundleProgress,
		totalCourses,
		completedCourses,
		inProgressCourses,
		completionPercentage
	};
};

/**
 * Get all courses from a bundle
 */
export const getAllCoursesFromBundle = (bundle: BundleDepth2): CourseDepth1[] => {
	return extractAllCourses(bundle);
};

/**
 * Get total number of courses in a bundle
 */
export const getTotalCourseCount = (bundle: Bundle): number => {
	return extractCourseIds(bundle).length;
};

/**
 * Check if a bundle has any courses
 */
export const bundleHasCourses = (bundle: Bundle): boolean => {
	return getTotalCourseCount(bundle) > 0;
};

/**
 * Get all modules with their course counts
 */
export const getModulesWithCourseCounts = (bundle: BundleDepth2): Array<{
	module: ModuleDepth2;
	courseCount: number;
}> => {
	return bundle.modules.map((item) => ({
		module: item.module,
		courseCount: item.module.courses.length
	}));
};
