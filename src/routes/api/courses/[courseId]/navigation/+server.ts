import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCourse } from '$lib/features/lms/shared/api/content-api';
import { getCourseProgress, getMultipleProgress } from '$lib/features/lms/shared/api/progress-api';
import { checkCourseAccess } from '$lib/features/lms/shared/api/enrollment-api';
import {
	buildNavigationTree,
	getNextActivity,
	getPreviousActivity,
	getTotalActivityCount,
	getActivityPosition,
	canNavigateNext,
	canNavigatePrevious
} from '$lib/features/lms/course-player/utils/navigation';
import { getActivityIds } from '$lib/features/lms/course-player/utils/course-loader';
import type { ActivityProgress, Activity } from '$lib/features/lms/shared/types';

/**
 * Helper to extract ID from either string or Activity object
 */
const getActivityId = (activity: string | Activity): string => {
	return typeof activity === 'string' ? activity : activity.id;
};

export const GET: RequestHandler = async ({ locals, params, url }) => {
	// Check authentication
	if (!locals.session?.user) {
		return error(401, 'Not authenticated');
	}

	const userId = locals.session.user.id;
	const { courseId } = params;
	const currentActivityId = url.searchParams.get('activityId');

	try {
		// Check if user has access to this course
		const hasAccess = await checkCourseAccess(userId, courseId);
		if (!hasAccess) {
			return error(403, 'No enrollment found for this course');
		}

		// Fetch course with full depth
		const course = await getCourse(courseId, 3);

		// Fetch all activity progress for this course
		const activityIds = getActivityIds(course);
		const activityProgress = activityIds.length > 0
			? (await getMultipleProgress(userId, activityIds, 'activity') as ActivityProgress[])
			: [];

		// Get completed activity IDs
		const completedActivityIds = activityProgress
			.filter((p) => p.status === 'completed')
			.map((p) => getActivityId(p.activity));

		// Build navigation tree
		const navigationTree = buildNavigationTree(course, currentActivityId || undefined, completedActivityIds);

		// Get total count
		const totalActivities = getTotalActivityCount(course);

		// Get current activity info if provided
		let currentActivityInfo = null;
		if (currentActivityId) {
			const position = getActivityPosition(course, currentActivityId);
			const nextActivity = getNextActivity(course, currentActivityId);
			const previousActivity = getPreviousActivity(course, currentActivityId);
			const canNext = canNavigateNext(course, currentActivityId);
			const canPrevious = canNavigatePrevious(course, currentActivityId);

			currentActivityInfo = {
				activityId: currentActivityId,
				position,
				totalActivities,
				nextActivityId: nextActivity?.id || null,
				previousActivityId: previousActivity?.id || null,
				canNavigateNext: canNext,
				canNavigatePrevious: canPrevious
			};
		}

		return json({
			navigationTree,
			totalActivities,
			completedCount: completedActivityIds.length,
			currentActivity: currentActivityInfo
		});
	} catch (err) {
		console.error('Course navigation API error:', err);
		return error(500, 'Failed to load course navigation');
	}
};
