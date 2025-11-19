import type { LearningPathDepth4, CourseDepth1 } from '../../shared/types';
import type { CourseProgress } from '../../shared/types';
import type { SequentialState, CourseAccessibility } from '../types';
import { extractAllCourses } from './learning-path-loader';
import { getCourseId } from '../../shared/types/content';

/**
 * Get sequential access state for a learning path
 */
export const getSequentialState = (
	learningPath: LearningPathDepth4,
	courseProgress: CourseProgress[]
): SequentialState => {
	const isSequential = learningPath.accessType === 'sequential';

	if (!isSequential) {
		// For automatic access, all courses are unlocked
		const courseIds = extractAllCourses(learningPath).map((c) => c.id);
		const completedCourseIds = courseProgress
			.filter((p) => p.status === 'completed')
			.map((p) => getCourseId(p.course));

		return {
			isSequential: false,
			currentCourseId: null,
			nextCourseId: null,
			lockedCourseIds: [],
			unlockedCourseIds: courseIds,
			completedCourseIds
		};
	}

	// Sequential logic
	const courses = extractAllCourses(learningPath);
	const progressMap = new Map(courseProgress.map((p) => [getCourseId(p.course), p]));

	const completedCourseIds: number[] = [];
	const unlockedCourseIds: number[] = [];
	const lockedCourseIds: number[] = [];
	let currentCourseId: number | null = null;
	let nextCourseId: number | null = null;

	for (let i = 0; i < courses.length; i++) {
		const course = courses[i];
		const progress = progressMap.get(course.id);

		if (progress?.status === 'completed') {
			completedCourseIds.push(course.id);
			unlockedCourseIds.push(course.id);
		} else if (progress?.status === 'in-progress') {
			currentCourseId = course.id;
			unlockedCourseIds.push(course.id);
		} else {
			// Not started - check if previous is completed
			const previousCourse = courses[i - 1];
			const previousProgress = previousCourse ? progressMap.get(previousCourse.id) : null;

			if (!previousCourse || previousProgress?.status === 'completed') {
				// First course or previous is completed - unlock this
				unlockedCourseIds.push(course.id);
				if (!currentCourseId) {
					currentCourseId = course.id;
				}
				if (!nextCourseId) {
					nextCourseId = course.id;
				}
			} else {
				// Previous not completed - lock this
				lockedCourseIds.push(course.id);
			}
		}
	}

	return {
		isSequential: true,
		currentCourseId,
		nextCourseId,
		lockedCourseIds,
		unlockedCourseIds,
		completedCourseIds
	};
};

/**
 * Get next available course (first unlocked, not completed)
 */
export const getNextAvailableCourse = (
	learningPath: LearningPathDepth4,
	courseProgress: CourseProgress[]
): CourseDepth1 | null => {
	const state = getSequentialState(learningPath, courseProgress);

	if (!state.nextCourseId) {
		return null;
	}

	const courses = extractAllCourses(learningPath);
	return courses.find((c) => c.id === state.nextCourseId) || null;
};

/**
 * Mark courses with their accessibility status
 */
export const markCoursesAccessibility = (
	learningPath: LearningPathDepth4,
	courseProgress: CourseProgress[]
): CourseAccessibility[] => {
	const state = getSequentialState(learningPath, courseProgress);
	const courses = extractAllCourses(learningPath);
	const progressMap = new Map(courseProgress.map((p) => [getCourseId(p.course), p]));

	return courses.map((course) => {
		const isCompleted = state.completedCourseIds.includes(course.id);
		const isLocked = state.lockedCourseIds.includes(course.id);
		const isAccessible = state.unlockedCourseIds.includes(course.id);
		const progress = progressMap.get(course.id);
		const isInProgress = progress?.status === 'in-progress';

		return {
			courseId: course.id,
			isAccessible,
			isCompleted,
			isInProgress,
			isLocked,
			lockReason: isLocked ? 'previous-incomplete' : undefined
		};
	});
};

/**
 * Check if a specific course is accessible in sequential mode
 */
export const isAccessibleInSequence = (
	courseId: number,
	learningPath: LearningPathDepth4,
	courseProgress: CourseProgress[]
): boolean => {
	const state = getSequentialState(learningPath, courseProgress);

	// If not sequential, all courses are accessible
	if (!state.isSequential) {
		return true;
	}

	// Check if course is in unlocked list
	return state.unlockedCourseIds.includes(courseId);
};

/**
 * Get the previous course in sequence
 */
export const getPreviousCourse = (
	courseId: number,
	learningPath: LearningPathDepth4
): CourseDepth1 | null => {
	const courses = extractAllCourses(learningPath);
	const currentIndex = courses.findIndex((c) => c.id === courseId);

	if (currentIndex === -1 || currentIndex === 0) {
		return null;
	}

	return courses[currentIndex - 1];
};

/**
 * Get the next course in sequence (regardless of lock status)
 */
export const getNextCourse = (courseId: number, learningPath: LearningPathDepth4): CourseDepth1 | null => {
	const courses = extractAllCourses(learningPath);
	const currentIndex = courses.findIndex((c) => c.id === courseId);

	if (currentIndex === -1 || currentIndex === courses.length - 1) {
		return null;
	}

	return courses[currentIndex + 1];
};

/**
 * Calculate progress percentage for sequential learning path
 */
export const calculateSequentialProgress = (
	learningPath: LearningPathDepth4,
	courseProgress: CourseProgress[]
): number => {
	const courses = extractAllCourses(learningPath);
	const totalCourses = courses.length;

	if (totalCourses === 0) return 0;

	const state = getSequentialState(learningPath, courseProgress);
	const completedCount = state.completedCourseIds.length;

	return Math.round((completedCount / totalCourses) * 100);
};

/**
 * Check if learning path is completed
 */
export const isLearningPathComplete = (
	learningPath: LearningPathDepth4,
	courseProgress: CourseProgress[]
): boolean => {
	const courses = extractAllCourses(learningPath);
	const state = getSequentialState(learningPath, courseProgress);

	return courses.length > 0 && state.completedCourseIds.length === courses.length;
};

/**
 * Get course index in learning path (0-based)
 */
export const getCourseIndex = (courseId: number, learningPath: LearningPathDepth4): number => {
	const courses = extractAllCourses(learningPath);
	return courses.findIndex((c) => c.id === courseId);
};

/**
 * Get total course count in learning path
 */
export const getTotalCourseCount = (learningPath: LearningPathDepth4): number => {
	return extractAllCourses(learningPath).length;
};
