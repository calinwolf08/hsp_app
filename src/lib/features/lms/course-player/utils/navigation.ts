import type { Course, Section, Activity } from '../../shared/types';
import type { NavigationItem } from '../types';

/**
 * Get all activities in order from a course
 */
const getAllActivitiesOrdered = (course: Course): Array<{
	activity: Activity;
	section: Section;
	sectionIndex: number;
	activityIndex: number;
}> => {
	const activities: Array<{
		activity: Activity;
		section: Section;
		sectionIndex: number;
		activityIndex: number;
	}> = [];

	course.sections.forEach((sectionItem, sectionIndex) => {
		const section = typeof sectionItem.section === 'string' ? null : sectionItem.section;
		if (!section) return;

		section.activities.forEach((activityItem, activityIndex) => {
			const activity =
				typeof activityItem.activity === 'string' ? null : activityItem.activity;
			if (!activity) return;

			activities.push({
				activity,
				section,
				sectionIndex,
				activityIndex
			});
		});
	});

	return activities;
};

/**
 * Find activity and its context by ID
 */
const findActivityContext = (
	course: Course,
	activityId: string
): {
	activity: Activity;
	section: Section;
	sectionIndex: number;
	activityIndex: number;
	globalIndex: number;
} | null => {
	const activities = getAllActivitiesOrdered(course);
	const globalIndex = activities.findIndex((item) => item.activity.id === activityId);

	if (globalIndex === -1) return null;

	return {
		...activities[globalIndex],
		globalIndex
	};
};

/**
 * Get the next activity in the course
 */
export const getNextActivity = (
	course: Course,
	currentActivityId: string
): Activity | null => {
	const activities = getAllActivitiesOrdered(course);
	const currentIndex = activities.findIndex((item) => item.activity.id === currentActivityId);

	if (currentIndex === -1 || currentIndex === activities.length - 1) {
		return null;
	}

	return activities[currentIndex + 1].activity;
};

/**
 * Get the previous activity in the course
 */
export const getPreviousActivity = (
	course: Course,
	currentActivityId: string
): Activity | null => {
	const activities = getAllActivitiesOrdered(course);
	const currentIndex = activities.findIndex((item) => item.activity.id === currentActivityId);

	if (currentIndex === -1 || currentIndex === 0) {
		return null;
	}

	return activities[currentIndex - 1].activity;
};

/**
 * Build navigation tree structure from course
 */
export const buildNavigationTree = (
	course: Course,
	currentActivityId?: string,
	completedActivityIds: string[] = []
): NavigationItem[] => {
	const items: NavigationItem[] = [];
	let globalOrder = 0;

	course.sections.forEach((sectionItem, sectionIndex) => {
		const section = typeof sectionItem.section === 'string' ? null : sectionItem.section;
		if (!section) return;

		// Add section item
		const sectionActivities = section.activities
			.map((item) => (typeof item.activity === 'string' ? null : item.activity))
			.filter((a): a is Activity => a !== null);

		const sectionCompleted = sectionActivities.every((activity) =>
			completedActivityIds.includes(activity.id)
		);

		items.push({
			id: section.id,
			title: section.name,
			type: 'section',
			isCompleted: sectionCompleted,
			isActive: false,
			isCurrent: false,
			isLocked: false,
			order: globalOrder++
		});

		// Add activity items
		sectionActivities.forEach((activity, activityIndex) => {
			const isCompleted = completedActivityIds.includes(activity.id);
			const isCurrent = currentActivityId === activity.id;

			items.push({
				id: activity.id,
				title: activity.name,
				type: 'activity',
				isCompleted,
				isActive: isCurrent,
				isCurrent,
				isLocked: false,
				sectionId: section.id,
				activityType: activity.activityType,
				order: globalOrder++
			});
		});
	});

	return items;
};

/**
 * Find the breadcrumb path to an activity
 */
export const findActivityPath = (
	course: Course,
	activityId: string
): Array<{ id: string; name: string; type: 'course' | 'section' | 'activity' }> => {
	const context = findActivityContext(course, activityId);
	if (!context) return [];

	return [
		{ id: course.id, name: course.name, type: 'course' },
		{ id: context.section.id, name: context.section.name, type: 'section' },
		{ id: context.activity.id, name: context.activity.name, type: 'activity' }
	];
};

/**
 * Check if activity is the first in the course
 */
export const isFirstActivity = (course: Course, activityId: string): boolean => {
	const context = findActivityContext(course, activityId);
	return context?.globalIndex === 0;
};

/**
 * Check if activity is the last in the course
 */
export const isLastActivity = (course: Course, activityId: string): boolean => {
	const activities = getAllActivitiesOrdered(course);
	const context = findActivityContext(course, activityId);

	if (!context || activities.length === 0) return false;

	return context.globalIndex === activities.length - 1;
};

/**
 * Get activity by ID from course
 */
export const getActivityById = (course: Course, activityId: string): Activity | null => {
	const context = findActivityContext(course, activityId);
	return context?.activity || null;
};

/**
 * Get section by ID from course
 */
export const getSectionById = (course: Course, sectionId: string): Section | null => {
	for (const sectionItem of course.sections) {
		const section = typeof sectionItem.section === 'string' ? null : sectionItem.section;
		if (section && section.id === sectionId) {
			return section;
		}
	}
	return null;
};

/**
 * Get total count of activities in course
 */
export const getTotalActivityCount = (course: Course): number => {
	return getAllActivitiesOrdered(course).length;
};

/**
 * Get activity position (1-based index)
 */
export const getActivityPosition = (course: Course, activityId: string): number | null => {
	const context = findActivityContext(course, activityId);
	return context ? context.globalIndex + 1 : null;
};

/**
 * Can navigate to next activity
 */
export const canNavigateNext = (course: Course, currentActivityId: string): boolean => {
	const context = findActivityContext(course, currentActivityId);
	if (!context) return false; // Activity doesn't exist
	return !isLastActivity(course, currentActivityId);
};

/**
 * Can navigate to previous activity
 */
export const canNavigatePrevious = (course: Course, currentActivityId: string): boolean => {
	const context = findActivityContext(course, currentActivityId);
	if (!context) return false; // Activity doesn't exist
	return !isFirstActivity(course, currentActivityId);
};
