import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCourse } from '$lib/features/lms/shared/api/content-api';
import { getCourseProgress, getMultipleProgress } from '$lib/features/lms/shared/api/progress-api';
import { checkCourseAccess } from '$lib/features/lms/shared/api/enrollment-api';
import { getActivityIds, calculateCourseCompletion } from '$lib/features/lms/course-player/utils/course-loader';
import type { ActivityProgress } from '$lib/features/lms/shared/types';

export const GET: RequestHandler = async ({ locals, params }) => {
	// Check authentication
	if (!locals.session?.user) {
		return error(401, 'Not authenticated');
	}

	const userId = locals.session.user.id;
	const { courseId } = params;

	try {
		// Check if user has access to this course
		const hasAccess = await checkCourseAccess(userId, courseId);
		if (!hasAccess) {
			return error(403, 'No enrollment found for this course');
		}

		// Fetch course with full depth (sections and activities)
		const course = await getCourse(courseId, 3);

		// Fetch course progress
		const courseProgress = await getCourseProgress(userId, courseId);

		// Fetch all activity progress for this course
		const activityIds = getActivityIds(course);
		const activityProgress = activityIds.length > 0
			? (await getMultipleProgress(userId, activityIds, 'activity') as ActivityProgress[])
			: [];

		// Calculate completion percentage
		const completionPercentage = calculateCourseCompletion(course, activityProgress);

		return json({
			course,
			courseProgress,
			activityProgress,
			completionPercentage,
			totalActivities: activityIds.length
		});
	} catch (err) {
		console.error('Course content API error:', err);
		return error(500, 'Failed to load course content');
	}
};
