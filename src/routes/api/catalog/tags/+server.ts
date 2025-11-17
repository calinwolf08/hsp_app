import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tag } from '$lib/features/lms/shared/types';

export const GET: RequestHandler = async () => {
	try {
		// Fetch tags from PayloadCMS
		// For now, returning an empty array since tags collection may not exist yet
		// TODO: Replace with actual API call when tags collection is available
		const tags: Tag[] = [];

		// Alternative: Extract unique tag IDs from courses and fetch them
		// This would require fetching all courses first

		return json({
			tags
		});
	} catch (err) {
		console.error('Tags API error:', err);
		return error(500, 'Failed to load tags');
	}
};
