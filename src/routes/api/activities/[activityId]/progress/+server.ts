import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateActivityProgress } from '$lib/features/lms/shared/api/progress-api';
import type { ProgressStatus } from '$lib/features/lms/shared/types';

export const POST: RequestHandler = async ({ locals, params, request }) => {
	// Check authentication
	if (!locals.session?.user) {
		return error(401, 'Not authenticated');
	}

	const userId = locals.session.user.id;
	const { activityId } = params;

	try {
		// Parse request body
		const body = await request.json();
		const { status, completionData } = body as {
			status: ProgressStatus;
			completionData?: Record<string, unknown>;
		};

		// Validate status
		if (!status || !['not-started', 'in-progress', 'completed'].includes(status)) {
			return error(400, 'Invalid status');
		}

		// Update activity progress
		const activityProgress = await updateActivityProgress(userId, activityId, status);

		// Note: Completion cascade (section/course updates) should happen in a background job
		// or via hooks in the PayloadCMS backend. For now, we just update the activity.

		return json({
			progress: activityProgress,
			completionData,
			success: true
		});
	} catch (err) {
		console.error('Activity progress update error:', err);
		return error(500, 'Failed to update activity progress');
	}
};
