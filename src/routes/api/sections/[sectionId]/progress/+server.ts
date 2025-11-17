import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateSectionProgress } from '$lib/features/lms/shared/api/progress-api';
import type { ProgressStatus } from '$lib/features/lms/shared/types';

export const POST: RequestHandler = async ({ locals, params, request }) => {
	// Check authentication
	if (!locals.session?.user) {
		return error(401, 'Not authenticated');
	}

	const userId = locals.session.user.id;
	const { sectionId } = params;

	try {
		// Parse request body
		const body = await request.json();
		const { status } = body as { status: ProgressStatus };

		// Validate status
		if (!status || !['not-started', 'in-progress', 'completed'].includes(status)) {
			return error(400, 'Invalid status');
		}

		// Update section progress
		const sectionProgress = await updateSectionProgress(userId, sectionId, status);

		return json({
			progress: sectionProgress,
			success: true
		});
	} catch (err) {
		console.error('Section progress update error:', err);
		return error(500, 'Failed to update section progress');
	}
};
