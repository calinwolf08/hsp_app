import type {
	Course,
	CourseDepth3,
	CourseDepth4,
	Section,
	SectionDepth2,
	SectionDepth3,
	Activity,
	ActivityDepth1,
	ActivityDepth2
} from '../../shared/types';
import {
	getActivityId,
	getSectionId,
	isCourseDepth3,
	isCourseDepth4,
	isActivityDepth1,
	isActivityDepth2
} from '../../shared/types/content';
import type { CourseProgress, SectionProgress, ActivityProgress } from '../../shared/types';
import type { CourseWithProgress } from '../types';

/**
 * Extract all activity IDs from a course
 * Only works with CourseDepth3 or higher (sections must be populated)
 */
export const getActivityIds = (course: Course): number[] => {
	const activityIds: number[] = [];

	// Type guard to ensure we have populated sections
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		console.warn('getActivityIds requires CourseDepth3 or CourseDepth4');
		return [];
	}

	for (const sectionItem of course.sections) {
		const section = sectionItem.section;
		// Section is already populated (SectionDepth2 or SectionDepth3)
		for (const activityItem of section.activities) {
			activityIds.push(getActivityId(activityItem.activity));
		}
	}

	return activityIds;
};

/**
 * Extract all section IDs from a course
 */
export const getSectionIds = (course: Course): number[] => {
	if (typeof course === 'number') {
		return [];
	}

	return course.sections.map((item) => getSectionId(item.section));
};

/**
 * Organize activity progress by section
 */
export const organizeProgress = (
	activityProgress: ActivityProgress[],
	sections: Array<{ id: string; section: number | Section }>
): Record<number, ActivityProgress[]> => {
	const progressBySection: Record<number, ActivityProgress[]> = {};

	// Build mapping of activity ID to section ID
	const activityToSection: Record<number, number> = {};
	for (const sectionItem of sections) {
		const section = sectionItem.section;
		if (typeof section === 'number') continue;

		const sectionId = section.id;
		for (const activityItem of section.activities) {
			const activityId = getActivityId(activityItem.activity);
			activityToSection[activityId] = sectionId;
		}
	}

	// Group progress records by section
	for (const progress of activityProgress) {
		const activityId = getActivityId(progress.activity);
		const sectionId = activityToSection[activityId];
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
 * Section must be SectionDepth2 or SectionDepth3 (activities populated)
 */
export const getActivitiesInSection = (section: Section): (ActivityDepth1 | ActivityDepth2)[] => {
	if (typeof section === 'number') {
		return [];
	}

	return section.activities
		.map((item) => item.activity)
		.filter((activity): activity is ActivityDepth1 | ActivityDepth2 =>
			isActivityDepth1(activity) || isActivityDepth2(activity)
		);
};

/**
 * Find section by activity ID
 */
export const findSectionByActivityId = (
	course: Course,
	activityId: number
): SectionDepth2 | SectionDepth3 | null => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		console.warn('findSectionByActivityId requires CourseDepth3 or CourseDepth4');
		return null;
	}

	for (const sectionItem of course.sections) {
		const section = sectionItem.section;

		for (const activityItem of section.activities) {
			if (getActivityId(activityItem.activity) === activityId) {
				return section;
			}
		}
	}

	return null;
};
