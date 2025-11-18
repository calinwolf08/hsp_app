import type { Bundle, Module, Course } from '../../shared/types';
import type { BundleProgress, CourseProgress } from '../../shared/types';
import type { BundleWithProgress, ModuleWithProgress, CourseWithProgress } from '../types';

/**
 * Extract all course IDs from a bundle
 */
export const extractCourseIds = (bundle: Bundle): string[] => {
	const courseIds: string[] = [];

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

	return courseIds;
};

/**
 * Extract all courses (full objects) from a bundle
 */
export const extractAllCourses = (bundle: Bundle): Course[] => {
	const courses: Course[] = [];

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

	return courses;
};

/**
 * Extract all modules from a bundle
 */
export const extractAllModules = (bundle: Bundle): Module[] => {
	return bundle.modules
		.map((item) => (typeof item.module === 'string' ? null : item.module))
		.filter((module): module is Module => module !== null);
};

/**
 * Helper to extract ID from either string or Course object
 */
const getCourseId = (course: string | Course): string => {
	return typeof course === 'string' ? course : course.id;
};

/**
 * Attach progress data to bundle
 */
export const attachProgressToBundle = (
	bundle: Bundle,
	courseProgress: CourseProgress[]
): Map<string, CourseProgress> => {
	const progressMap = new Map<string, CourseProgress>();

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
 * Calculate progress for a specific module
 */
export const calculateModuleProgress = (
	module: Module,
	courseProgress: CourseProgress[]
): {
	totalCourses: number;
	completedCourses: number;
	inProgressCourses: number;
	completionPercentage: number;
} => {
	const courseIds = module.courses
		.map((item) => {
			const course = typeof item.course === 'string' ? null : item.course;
			return course?.id;
		})
		.filter((id): id is string => id !== null);

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
 * Build module with progress and courses
 */
export const buildModuleWithProgress = (
	module: Module,
	progressMap: Map<string, CourseProgress>
): ModuleWithProgress => {
	const courses: CourseWithProgress[] = module.courses
		.map((item) => {
			const course = typeof item.course === 'string' ? null : item.course;
			if (!course) return null;

			const progress = progressMap.get(course.id) || null;
			return {
				course,
				progress,
				isCompleted: progress?.status === 'completed',
				isInProgress: progress?.status === 'in-progress',
				isNotStarted: !progress || progress.status === 'not-started'
			};
		})
		.filter((item): item is CourseWithProgress => item !== null);

	const progressArray = courses.map((c) => c.progress).filter((p): p is CourseProgress => p !== null);
	const stats = calculateModuleProgress(module, progressArray);

	return {
		module,
		...stats,
		courses
	};
};

/**
 * Build BundleWithProgress object
 */
export const buildBundleWithProgress = (
	bundle: Bundle,
	courseProgress: CourseProgress[]
): BundleWithProgress => {
	const progressMap = attachProgressToBundle(bundle, courseProgress);
	const progressStats = calculateBundleProgress(bundle, courseProgress);

	const modules: ModuleWithProgress[] = extractAllModules(bundle).map((module) =>
		buildModuleWithProgress(module, progressMap)
	);

	return {
		bundle,
		...progressStats,
		modules
	};
};

/**
 * Get total module count in bundle
 */
export const getTotalModuleCount = (bundle: Bundle): number => {
	return extractAllModules(bundle).length;
};

/**
 * Get total course count in bundle
 */
export const getTotalCourseCount = (bundle: Bundle): number => {
	return extractCourseIds(bundle).length;
};

/**
 * Check if bundle is completed
 */
export const isBundleComplete = (bundle: Bundle, courseProgress: CourseProgress[]): boolean => {
	const stats = calculateBundleProgress(bundle, courseProgress);
	return stats.totalCourses > 0 && stats.completedCourses === stats.totalCourses;
};

/**
 * Check if module is completed
 */
export const isModuleComplete = (module: Module, courseProgress: CourseProgress[]): boolean => {
	const stats = calculateModuleProgress(module, courseProgress);
	return stats.totalCourses > 0 && stats.completedCourses === stats.totalCourses;
};

/**
 * Get courses by module
 */
export const getCoursesByModule = (moduleId: string, bundle: Bundle): Course[] => {
	const modules = extractAllModules(bundle);
	const module = modules.find((m) => m.id === moduleId);

	if (!module) return [];

	return module.courses
		.map((item) => (typeof item.course === 'string' ? null : item.course))
		.filter((course): course is Course => course !== null);
};

/**
 * Find module by course ID
 */
export const findModuleByCourseId = (courseId: string, bundle: Bundle): Module | null => {
	const modules = extractAllModules(bundle);

	for (const module of modules) {
		const courseIds = module.courses
			.map((item) => {
				const course = typeof item.course === 'string' ? null : item.course;
				return course?.id;
			})
			.filter((id): id is string => id !== null);

		if (courseIds.includes(courseId)) {
			return module;
		}
	}

	return null;
};
