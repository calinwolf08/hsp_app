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
import type { NavigationItem } from '../types';

/**
 * Get all activities in order from a course
 * Requires CourseDepth3 or CourseDepth4
 */
const getAllActivitiesOrdered = (course: CourseDepth3 | CourseDepth4): Array<{
	activity: ActivityDepth1 | ActivityDepth2;
	section: SectionDepth2 | SectionDepth3;
	sectionIndex: number;
	activityIndex: number;
}> => {
	const activities: Array<{
		activity: ActivityDepth1 | ActivityDepth2;
		section: SectionDepth2 | SectionDepth3;
		sectionIndex: number;
		activityIndex: number;
	}> = [];

	course.sections.forEach((sectionItem, sectionIndex) => {
		const section = sectionItem.section;
		// Section is already populated at this depth

		section.activities.forEach((activityItem, activityIndex) => {
			const activity = activityItem.activity;
			// Activity is already populated at this depth

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
	course: CourseDepth3 | CourseDepth4,
	activityId: number
): {
	activity: ActivityDepth1 | ActivityDepth2;
	section: SectionDepth2 | SectionDepth3;
	sectionIndex: number;
	activityIndex: number;
	globalIndex: number;
} | null => {
	const activities = getAllActivitiesOrdered(course);
	const globalIndex = activities.findIndex((item) => getActivityId(item.activity) === activityId);

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
	currentActivityId: number
): ActivityDepth1 | ActivityDepth2 | null => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		console.warn('getNextActivity requires CourseDepth3 or CourseDepth4');
		return null;
	}

	const activities = getAllActivitiesOrdered(course);
	const currentIndex = activities.findIndex(
		(item) => getActivityId(item.activity) === currentActivityId
	);

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
	currentActivityId: number
): ActivityDepth1 | ActivityDepth2 | null => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		console.warn('getPreviousActivity requires CourseDepth3 or CourseDepth4');
		return null;
	}

	const activities = getAllActivitiesOrdered(course);
	const currentIndex = activities.findIndex(
		(item) => getActivityId(item.activity) === currentActivityId
	);

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
	currentActivityId?: number,
	completedActivityIds: number[] = []
): NavigationItem[] => {
	const items: NavigationItem[] = [];
	let globalOrder = 0;

	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		console.warn('buildNavigationTree requires CourseDepth3 or CourseDepth4');
		return [];
	}

	course.sections.forEach((sectionItem, sectionIndex) => {
		const section = sectionItem.section;

		// Get all activities in this section
		const sectionActivities = section.activities.map((item) => item.activity);

		const sectionCompleted = sectionActivities.every((activity) =>
			completedActivityIds.includes(getActivityId(activity))
		);

		items.push({
			id: section.id.toString(),
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
			const activityId = getActivityId(activity);
			const isCompleted = completedActivityIds.includes(activityId);
			const isCurrent = currentActivityId === activityId;

			items.push({
				id: activityId.toString(),
				title: activity.name,
				type: 'activity',
				isCompleted,
				isActive: isCurrent,
				isCurrent,
				isLocked: false,
				sectionId: section.id.toString(),
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
	activityId: number
): Array<{ id: number; name: string; type: 'course' | 'section' | 'activity' }> => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		return [];
	}

	const context = findActivityContext(course, activityId);
	if (!context) return [];

	return [
		{ id: course.id, name: course.name, type: 'course' },
		{ id: context.section.id, name: context.section.name, type: 'section' },
		{ id: getActivityId(context.activity), name: context.activity.name, type: 'activity' }
	];
};

/**
 * Check if activity is the first in the course
 */
export const isFirstActivity = (course: Course, activityId: number): boolean => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		return false;
	}

	const context = findActivityContext(course, activityId);
	return context?.globalIndex === 0;
};

/**
 * Check if activity is the last in the course
 */
export const isLastActivity = (course: Course, activityId: number): boolean => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		return false;
	}

	const activities = getAllActivitiesOrdered(course);
	const context = findActivityContext(course, activityId);

	if (!context || activities.length === 0) return false;

	return context.globalIndex === activities.length - 1;
};

/**
 * Get activity by ID from course
 */
export const getActivityById = (
	course: Course,
	activityId: number
): ActivityDepth1 | ActivityDepth2 | null => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		return null;
	}

	const context = findActivityContext(course, activityId);
	return context?.activity || null;
};

/**
 * Get section by ID from course
 */
export const getSectionById = (
	course: Course,
	sectionId: number
): SectionDepth2 | SectionDepth3 | null => {
	if (typeof course === 'number') {
		return null;
	}

	for (const sectionItem of course.sections) {
		const section = sectionItem.section;
		if (typeof section !== 'number' && section.id === sectionId) {
			return section;
		}
	}
	return null;
};

/**
 * Get total count of activities in course
 */
export const getTotalActivityCount = (course: Course): number => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		return 0;
	}

	return getAllActivitiesOrdered(course).length;
};

/**
 * Get activity position (1-based index)
 */
export const getActivityPosition = (course: Course, activityId: number): number | null => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		return null;
	}

	const context = findActivityContext(course, activityId);
	return context ? context.globalIndex + 1 : null;
};

/**
 * Can navigate to next activity
 */
export const canNavigateNext = (course: Course, currentActivityId: number): boolean => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		return false;
	}

	const context = findActivityContext(course, currentActivityId);
	if (!context) return false; // Activity doesn't exist
	return !isLastActivity(course, currentActivityId);
};

/**
 * Can navigate to previous activity
 */
export const canNavigatePrevious = (course: Course, currentActivityId: number): boolean => {
	if (!isCourseDepth3(course) && !isCourseDepth4(course)) {
		return false;
	}

	const context = findActivityContext(course, currentActivityId);
	if (!context) return false; // Activity doesn't exist
	return !isFirstActivity(course, currentActivityId);
};
