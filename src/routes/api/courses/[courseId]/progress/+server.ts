import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateCourseProgress } from '$lib/features/lms/shared/api/progress-api';
import { checkCourseAccess } from '$lib/features/lms/shared/api/enrollment-api';
import type { ProgressStatus } from '$lib/features/lms/shared/types';

export const POST: RequestHandler = async ({ locals, params, request }) => {
	// Check authentication
	if (!locals.session?.user) {
		return error(401, 'Not authenticated');
	}

	const userId = locals.session.user.id;
	const { courseId } = params;

	try {
		// Parse request body
		const body = await request.json();
		const { status } = body as { status: ProgressStatus };

		// Validate status
		if (!status || !['not-started', 'in-progress', 'completed'].includes(status)) {
			return error(400, 'Invalid status');
		}

		// Check if user has access to this course
		const hasAccess = await checkCourseAccess(userId, courseId);
		if (!hasAccess) {
			return error(403, 'No enrollment found for this course');
		}

		// Update progress
		const progress = await updateCourseProgress(userId, courseId, status);

		return json({
			progress,
			success: true
		});
	} catch (err) {
		console.error('Course progress update error:', err);
		return error(500, 'Failed to update progress');
	}
};
