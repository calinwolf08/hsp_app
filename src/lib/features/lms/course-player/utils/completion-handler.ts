import type {
	CourseDepth2,
	SectionDepth2,
	ActivityProgress,
	SectionProgress,
	CourseProgress
} from '../../shared/types';
import { getActivityId, getSectionId } from '../../shared/types/content';

/**
 * Check if a section is complete based on activity progress
 */
export const checkSectionComplete = (
	section: SectionDepth2,
	activityProgress: ActivityProgress[]
): boolean => {
	// Get all activity IDs in the section
	const activityIds = section.activities.map((item) => item.activity.id);

	if (activityIds.length === 0) return false;

	// Check if all activities are completed
	return activityIds.every((activityId) => {
		const progress = activityProgress.find((p) => getActivityId(p.activity) === activityId);
		return progress?.status === 'completed';
	});
};

/**
 * Check if a course is complete based on section progress
 */
export const checkCourseComplete = (
	course: CourseDepth2,
	sectionProgress: SectionProgress[]
): boolean => {
	// Get all section IDs in the course
	const sectionIds = course.sections.map((item) => item.section.id);

	if (sectionIds.length === 0) return false;

	// Check if all sections are completed
	return sectionIds.every((sectionId) => {
		const progress = sectionProgress.find((p) => getSectionId(p.section) === sectionId);
		return progress?.status === 'completed';
	});
};

/**
 * Build progress update chain for an activity completion
 */
export const buildProgressUpdateChain = (
	activityId: string,
	sectionId: string,
	courseId: string
): Array<{ type: 'activity' | 'section' | 'course'; id: string }> => {
	return [
		{ type: 'activity', id: activityId },
		{ type: 'section', id: sectionId },
		{ type: 'course', id: courseId }
	];
};

/**
 * Determine if section progress should be updated based on activity completions
 */
export const shouldUpdateSectionProgress = (
	sectionId: number,
	section: SectionDepth2,
	activityProgress: ActivityProgress[]
): {
	shouldUpdate: boolean;
	newStatus: 'not-started' | 'in-progress' | 'completed';
} => {
	// Get all activity IDs in the section
	const activityIds = section.activities.map((item) => item.activity.id);

	if (activityIds.length === 0) {
		return { shouldUpdate: false, newStatus: 'not-started' };
	}

	// Count completed and started activities
	let completedCount = 0;
	let startedCount = 0;

	for (const activityId of activityIds) {
		const progress = activityProgress.find((p) => getActivityId(p.activity) === activityId);
		if (progress) {
			if (progress.status === 'completed') {
				completedCount++;
			}
			if (progress.status === 'in-progress' || progress.status === 'completed') {
				startedCount++;
			}
		}
	}

	// Determine new status
	let newStatus: 'not-started' | 'in-progress' | 'completed';
	if (completedCount === activityIds.length) {
		newStatus = 'completed';
	} else if (startedCount > 0) {
		newStatus = 'in-progress';
	} else {
		newStatus = 'not-started';
	}

	return { shouldUpdate: true, newStatus };
};

/**
 * Determine if course progress should be updated based on section completions
 */
export const shouldUpdateCourseProgress = (
	courseId: number,
	course: CourseDepth2,
	sectionProgress: SectionProgress[]
): {
	shouldUpdate: boolean;
	newStatus: 'not-started' | 'in-progress' | 'completed';
} => {
	// Get all section IDs in the course
	const sectionIds = course.sections.map((item) => item.section.id);

	if (sectionIds.length === 0) {
		return { shouldUpdate: false, newStatus: 'not-started' };
	}

	// Count completed and started sections
	let completedCount = 0;
	let startedCount = 0;

	for (const sectionId of sectionIds) {
		const progress = sectionProgress.find((p) => getSectionId(p.section) === sectionId);
		if (progress) {
			if (progress.status === 'completed') {
				completedCount++;
			}
			if (progress.status === 'in-progress' || progress.status === 'completed') {
				startedCount++;
			}
		}
	}

	// Determine new status
	let newStatus: 'not-started' | 'in-progress' | 'completed';
	if (completedCount === sectionIds.length) {
		newStatus = 'completed';
	} else if (startedCount > 0) {
		newStatus = 'in-progress';
	} else {
		newStatus = 'not-started';
	}

	return { shouldUpdate: true, newStatus };
};

/**
 * Get completion percentage for a section based on activity progress
 */
export const getSectionCompletionPercentage = (
	section: SectionDepth2,
	activityProgress: ActivityProgress[]
): number => {
	const activityIds = section.activities.map((item) => item.activity.id);

	if (activityIds.length === 0) return 0;

	const completedCount = activityIds.filter((activityId) => {
		const progress = activityProgress.find((p) => getActivityId(p.activity) === activityId);
		return progress?.status === 'completed';
	}).length;

	return Math.round((completedCount / activityIds.length) * 100);
};

/**
 * Get completion percentage for a course based on section progress
 */
export const getCourseCompletionPercentage = (
	course: CourseDepth2,
	sectionProgress: SectionProgress[]
): number => {
	const sectionIds = course.sections.map((item) => item.section.id);

	if (sectionIds.length === 0) return 0;

	const completedCount = sectionIds.filter((sectionId) => {
		const progress = sectionProgress.find((p) => getSectionId(p.section) === sectionId);
		return progress?.status === 'completed';
	}).length;

	return Math.round((completedCount / sectionIds.length) * 100);
};
