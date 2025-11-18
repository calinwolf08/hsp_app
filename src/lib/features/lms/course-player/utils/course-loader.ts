import type { Course, Section, Activity } from '../../shared/types';
import type { CourseProgress, SectionProgress, ActivityProgress } from '../../shared/types';
import type { CourseWithProgress } from '../types';

/**
 * Helper to extract ID from either string or Activity object
 */
const getActivityId = (activity: string | Activity): string => {
	return typeof activity === 'string' ? activity : activity.id;
};

/**
 * Extract all activity IDs from a course
 */
export const getActivityIds = (course: Course): string[] => {
	const activityIds: string[] = [];

	for (const sectionItem of course.sections) {
		const section = typeof sectionItem.section === 'string' ? null : sectionItem.section;
		if (!section) continue;

		for (const activityItem of section.activities) {
			const activity =
				typeof activityItem.activity === 'string' ? activityItem.id : activityItem.activity;
			if (typeof activity !== 'string') {
				activityIds.push(activity.id);
			}
		}
	}

	return activityIds;
};

/**
 * Extract all section IDs from a course
 */
export const getSectionIds = (course: Course): string[] => {
	return course.sections
		.map((item) => {
			const section = typeof item.section === 'string' ? null : item.section;
			return section?.id;
		})
		.filter((id): id is string => id !== null && id !== undefined);
};

/**
 * Organize activity progress by section
 */
export const organizeProgress = (
	activityProgress: ActivityProgress[],
	sections: Array<{ id: string; section: string | Section }>
): Record<string, ActivityProgress[]> => {
	const progressBySection: Record<string, ActivityProgress[]> = {};

	// Build mapping of activity ID to section ID
	const activityToSection: Record<string, string> = {};
	for (const sectionItem of sections) {
		const section = typeof sectionItem.section === 'string' ? null : sectionItem.section;
		if (!section) continue;

		for (const activityItem of section.activities) {
			const activity =
				typeof activityItem.activity === 'string' ? activityItem.id : activityItem.activity;
			if (typeof activity !== 'string') {
				activityToSection[activity.id] = section.id;
			}
		}
	}

	// Group progress records by section
	for (const progress of activityProgress) {
		const sectionId = activityToSection[getActivityId(progress.activity)];
		if (sectionId) {
			if (!progressBySection[sectionId]) {
				progressBySection[sectionId] = [];
			}
			progressBySection[sectionId].push(progress);
		}
	}

	return progressBySection;
};

/**
 * Calculate completion percentage for a course
 */
export const calculateCourseCompletion = (
	course: Course,
	activityProgress: ActivityProgress[]
): number => {
	const totalActivities = getActivityIds(course).length;
	if (totalActivities === 0) return 0;

	const completedActivities = activityProgress.filter((p) => p.status === 'completed').length;
	return Math.round((completedActivities / totalActivities) * 100);
};

/**
 * Attach progress data to course structure
 * @deprecated Use buildCourseWithProgress instead
 */
export const attachProgressToCourse = (
	course: Course,
	progress: CourseProgress | null,
	activityProgress: ActivityProgress[]
): CourseWithProgress => {
	const completionPercentage = calculateCourseCompletion(course, activityProgress);

	return {
		course,
		progress,
		completionPercentage
	};
};

/**
 * Build CourseWithProgress object from course and progress data
 */
export const buildCourseWithProgress = (
	course: Course,
	progress: CourseProgress | null,
	activityProgress: ActivityProgress[] = []
): CourseWithProgress => {
	const completionPercentage = calculateCourseCompletion(course, activityProgress);

	return {
		course,
		progress,
		completionPercentage
	};
};

/**
 * Get total number of activities in a course
 */
export const getTotalActivities = (course: Course): number => {
	return getActivityIds(course).length;
};

/**
 * Get total number of sections in a course
 */
export const getTotalSections = (course: Course): number => {
	return getSectionIds(course).length;
};

/**
 * Get activities in a specific section
 */
export const getActivitiesInSection = (section: Section): Activity[] => {
	return section.activities
		.map((item) => (typeof item.activity === 'string' ? null : item.activity))
		.filter((activity): activity is Activity => activity !== null);
};

/**
 * Find section by activity ID
 */
export const findSectionByActivityId = (
	course: Course,
	activityId: string
): Section | null => {
	for (const sectionItem of course.sections) {
		const section = typeof sectionItem.section === 'string' ? null : sectionItem.section;
		if (!section) continue;

		for (const activityItem of section.activities) {
			const activity =
				typeof activityItem.activity === 'string' ? activityItem.id : activityItem.activity;
			if (typeof activity !== 'string' && activity.id === activityId) {
				return section;
			}
		}
	}

	return null;
};
