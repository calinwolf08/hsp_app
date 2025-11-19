import type { LearningPathDepth2, CourseProgress } from '../types';
import { isItemCompleted } from './progress-calculator';
import { ACCESS_TYPE } from '../constants';

export const getNextAccessibleCourse = (
	learningPath: LearningPathDepth2,
	progressRecords: CourseProgress[]
): string | null => {
	if (!isSequentialMode(learningPath)) {
		return null; // All courses accessible in automatic mode
	}

	// Flatten all courses from bundles -> modules -> courses
	for (const bundleRef of learningPath.bundles) {
		const bundle = typeof bundleRef.bundle === 'string' ? null : bundleRef.bundle;
		if (!bundle) continue;

		for (const moduleRef of bundle.modules) {
			const module = typeof moduleRef.module === 'string' ? null : moduleRef.module;
			if (!module) continue;

			for (const courseRef of module.courses) {
				const courseId = typeof courseRef.course === 'string' ? courseRef.course : courseRef.course.id;

				// Find progress for this course
				const progress = progressRecords.find((p) => p.course === courseId);

				// If not completed, this is the next accessible course
				if (!isItemCompleted(progress?.status)) {
					return courseId;
				}
			}
		}
	}

	return null; // All courses completed
};

export const isSequentialMode = (learningPath: LearningPathDepth2): boolean => {
	return learningPath.accessType === ACCESS_TYPE.SEQUENTIAL;
};

export const canAccessInSequence = (
	courseId: string,
	learningPath: LearningPathDepth2,
	progressRecords: CourseProgress[]
): boolean => {
	if (!isSequentialMode(learningPath)) {
		return true; // All courses accessible in automatic mode
	}

	const nextAccessible = getNextAccessibleCourse(learningPath, progressRecords);

	// If no next accessible course, all are completed, allow access
	if (!nextAccessible) {
		return true;
	}

	// Course is accessible if it's the next one or all previous are completed
	return courseId === nextAccessible || isAllPreviousCompleted(courseId, learningPath, progressRecords);
};

const isAllPreviousCompleted = (
	targetCourseId: string,
	learningPath: LearningPathDepth2,
	progressRecords: CourseProgress[]
): boolean => {
	let foundTarget = false;

	for (const bundleRef of learningPath.bundles) {
		const bundle = typeof bundleRef.bundle === 'string' ? null : bundleRef.bundle;
		if (!bundle) continue;

		for (const moduleRef of bundle.modules) {
			const module = typeof moduleRef.module === 'string' ? null : moduleRef.module;
			if (!module) continue;

			for (const courseRef of module.courses) {
				const courseId = typeof courseRef.course === 'string' ? courseRef.course : courseRef.course.id;

				if (courseId === targetCourseId) {
					foundTarget = true;
					break;
				}

				// Check if this previous course is completed
				const progress = progressRecords.find((p) => p.course === courseId);
				if (!isItemCompleted(progress?.status)) {
					return false;
				}
			}

			if (foundTarget) break;
		}

		if (foundTarget) break;
	}

	return foundTarget;
};

export const getLockedCourses = (
	learningPath: LearningPathDepth2,
	progressRecords: CourseProgress[]
): string[] => {
	if (!isSequentialMode(learningPath)) {
		return []; // No locked courses in automatic mode
	}

	const locked: string[] = [];
	const nextAccessible = getNextAccessibleCourse(learningPath, progressRecords);

	for (const bundleRef of learningPath.bundles) {
		const bundle = typeof bundleRef.bundle === 'string' ? null : bundleRef.bundle;
		if (!bundle) continue;

		for (const moduleRef of bundle.modules) {
			const module = typeof moduleRef.module === 'string' ? null : moduleRef.module;
			if (!module) continue;

			for (const courseRef of module.courses) {
				const courseId = typeof courseRef.course === 'string' ? courseRef.course : courseRef.course.id;

				if (nextAccessible && courseId !== nextAccessible) {
					const progress = progressRecords.find((p) => p.course === courseId);
					if (!isItemCompleted(progress?.status)) {
						locked.push(courseId);
					}
				}
			}
		}
	}

	return locked;
};

export const getUnlockedCourses = (
	learningPath: LearningPathDepth2,
	progressRecords: CourseProgress[]
): string[] => {
	if (!isSequentialMode(learningPath)) {
		// In automatic mode, all courses are unlocked
		const allCourses: string[] = [];
		for (const bundleRef of learningPath.bundles) {
			const bundle = typeof bundleRef.bundle === 'string' ? null : bundleRef.bundle;
			if (!bundle) continue;

			for (const moduleRef of bundle.modules) {
				const module = typeof moduleRef.module === 'string' ? null : moduleRef.module;
				if (!module) continue;

				for (const courseRef of module.courses) {
					const courseId = typeof courseRef.course === 'string' ? courseRef.course : courseRef.course.id;
					allCourses.push(courseId);
				}
			}
		}
		return allCourses;
	}

	const unlocked: string[] = [];
	const nextAccessible = getNextAccessibleCourse(learningPath, progressRecords);

	for (const bundleRef of learningPath.bundles) {
		const bundle = typeof bundleRef.bundle === 'string' ? null : bundleRef.bundle;
		if (!bundle) continue;

		for (const moduleRef of bundle.modules) {
			const module = typeof moduleRef.module === 'string' ? null : moduleRef.module;
			if (!module) continue;

			for (const courseRef of module.courses) {
				const courseId = typeof courseRef.course === 'string' ? courseRef.course : courseRef.course.id;
				const progress = progressRecords.find((p) => p.course === courseId);

				// Unlocked if completed or is the next accessible
				if (isItemCompleted(progress?.status) || courseId === nextAccessible) {
					unlocked.push(courseId);
				}
			}
		}
	}

	return unlocked;
};
