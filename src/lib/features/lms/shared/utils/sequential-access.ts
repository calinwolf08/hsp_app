import type { LearningPathDepth3, CourseProgress } from '../types';
import { isItemCompleted } from './progress-calculator';
import { ACCESS_TYPE } from '../constants';
import { getCourseId } from '../types/content';

export const getNextAccessibleCourse = (
	learningPath: LearningPathDepth3,
	progressRecords: CourseProgress[]
): number | null => {
	if (!isSequentialMode(learningPath)) {
		return null; // All courses accessible in automatic mode
	}

	// Flatten all courses from bundles -> modules -> courses
	for (const bundleRef of learningPath.bundles) {
		const bundle = bundleRef.bundle;

		for (const moduleRef of bundle.modules) {
			const module = moduleRef.module;

			for (const courseRef of module.courses) {
				const courseId = courseRef.course;

				// Find progress for this course
				const progress = progressRecords.find((p) => getCourseId(p.course) === courseId);

				// If not completed, this is the next accessible course
				if (!isItemCompleted(progress?.status)) {
					return courseId;
				}
			}
		}
	}

	return null; // All courses completed
};

export const isSequentialMode = (learningPath: LearningPathDepth3): boolean => {
	return learningPath.accessType === ACCESS_TYPE.SEQUENTIAL;
};

export const canAccessInSequence = (
	courseId: number,
	learningPath: LearningPathDepth3,
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
	targetCourseId: number,
	learningPath: LearningPathDepth3,
	progressRecords: CourseProgress[]
): boolean => {
	let foundTarget = false;

	for (const bundleRef of learningPath.bundles) {
		const bundle = bundleRef.bundle;

		for (const moduleRef of bundle.modules) {
			const module = moduleRef.module;

			for (const courseRef of module.courses) {
				const courseId = courseRef.course;

				if (courseId === targetCourseId) {
					foundTarget = true;
					break;
				}

				// Check if this previous course is completed
				const progress = progressRecords.find((p) => getCourseId(p.course) === courseId);
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
	learningPath: LearningPathDepth3,
	progressRecords: CourseProgress[]
): number[] => {
	if (!isSequentialMode(learningPath)) {
		return []; // No locked courses in automatic mode
	}

	const locked: number[] = [];
	const nextAccessible = getNextAccessibleCourse(learningPath, progressRecords);

	for (const bundleRef of learningPath.bundles) {
		const bundle = bundleRef.bundle;

		for (const moduleRef of bundle.modules) {
			const module = moduleRef.module;

			for (const courseRef of module.courses) {
				const courseId = courseRef.course;

				if (nextAccessible && courseId !== nextAccessible) {
					const progress = progressRecords.find((p) => getCourseId(p.course) === courseId);
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
	learningPath: LearningPathDepth3,
	progressRecords: CourseProgress[]
): number[] => {
	if (!isSequentialMode(learningPath)) {
		// In automatic mode, all courses are unlocked
		const allCourses: number[] = [];
		for (const bundleRef of learningPath.bundles) {
			const bundle = bundleRef.bundle;

			for (const moduleRef of bundle.modules) {
				const module = moduleRef.module;

				for (const courseRef of module.courses) {
					allCourses.push(courseRef.course);
				}
			}
		}
		return allCourses;
	}

	const unlocked: number[] = [];
	const nextAccessible = getNextAccessibleCourse(learningPath, progressRecords);

	for (const bundleRef of learningPath.bundles) {
		const bundle = bundleRef.bundle;

		for (const moduleRef of bundle.modules) {
			const module = moduleRef.module;

			for (const courseRef of module.courses) {
				const courseId = courseRef.course;
				const progress = progressRecords.find((p) => getCourseId(p.course) === courseId);

				// Unlocked if completed or is the next accessible
				if (isItemCompleted(progress?.status) || courseId === nextAccessible) {
					unlocked.push(courseId);
				}
			}
		}
	}

	return unlocked;
};
