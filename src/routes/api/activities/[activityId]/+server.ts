import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getActivity } from '$lib/features/lms/shared/api/content-api';
import { getActivityProgress } from '$lib/features/lms/shared/api/progress-api';

export const GET: RequestHandler = async ({ locals, params }) => {
	// Check authentication
	if (!locals.session?.user) {
		return error(401, 'Not authenticated');
	}

	const userId = locals.session.user.id;
	const { activityId } = params;

	try {
		// Fetch activity
		const activity = await getActivity(activityId);

		// Fetch activity progress
		const activityProgress = await getActivityProgress(userId, activityId);

		return json({
			activity,
			progress: activityProgress
		});
	} catch (err) {
		console.error('Activity content API error:', err);
		return error(404, 'Activity not found');
	}
};
