import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { apiClient } from '$lib/features/lms/shared/api/client';
import type { Category } from '$lib/features/lms/shared/types';

export const GET: RequestHandler = async () => {
	try {
		// Fetch categories from PayloadCMS
		// For now, returning an empty array since categories collection may not exist yet
		// TODO: Replace with actual API call when categories collection is available
		const categories: Category[] = [];

		// Alternative: Extract unique category IDs from courses and fetch them
		// This would require fetching all courses first

		return json({
			categories
		});
	} catch (err) {
		console.error('Categories API error:', err);
		return error(500, 'Failed to load categories');
	}
};
