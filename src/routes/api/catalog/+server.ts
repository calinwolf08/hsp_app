import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCourses } from '$lib/features/lms/shared/api/content-api';
import { getCourseEnrollments } from '$lib/features/lms/shared/api/enrollment-api';
import {
	applyAllFilters,
	sortCourses,
	calculatePagination,
	paginateItems
} from '$lib/features/lms/catalog/utils/catalog-filters';
import {
	attachEnrollmentStatus,
	filterByEnrollmentStatus
} from '$lib/features/lms/catalog/utils/enrollment-actions';
import type { SortOption, CatalogFilters } from '$lib/features/lms/catalog/types';

export const GET: RequestHandler = async ({ locals, url }) => {
	try {
		// Get query parameters
		const search = url.searchParams.get('search') || '';
		const categories = url.searchParams.get('categories') || '';
		const tags = url.searchParams.get('tags') || '';
		const sort = (url.searchParams.get('sort') as SortOption) || 'title-asc';
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '12');
		const enrollmentStatus =
			(url.searchParams.get('enrollmentStatus') as 'all' | 'enrolled' | 'not-enrolled') || 'all';

		// Fetch all courses with depth 1 (basic course info, no activities)
		const coursesResponse = await getCourses({
			limit: 1000, // Get all courses for client-side filtering
			depth: 1
		});

		let courses = coursesResponse.docs;

		// Build filters
		const filters: CatalogFilters = {
			searchTerm: search,
			categoryIds: categories ? categories.split(',').filter(Boolean) : [],
			tagIds: tags ? tags.split(',').filter(Boolean) : [],
			enrollmentStatus
		};

		// Apply filters
		courses = applyAllFilters(courses, filters);

		// Apply sorting
		courses = sortCourses(courses, sort);

		// Get user's enrollments if authenticated
		let catalogCourses;
		if (locals.session?.user) {
			const userId = locals.session.user.id;
			const enrollmentsResponse = await getCourseEnrollments(userId, {
				limit: 1000
			});
			const enrollments = enrollmentsResponse.docs;

			// Attach enrollment status
			catalogCourses = attachEnrollmentStatus(courses, enrollments, userId);

			// Filter by enrollment status
			catalogCourses = filterByEnrollmentStatus(catalogCourses, enrollmentStatus);
		} else {
			// Not authenticated - all courses are not enrolled
			catalogCourses = courses.map((course) => ({
				course,
				isEnrolled: false,
				enrollmentId: undefined,
				enrolledAt: undefined
			}));
		}

		// Calculate pagination
		const pagination = calculatePagination(page, limit, catalogCourses.length);

		// Paginate results
		const paginatedCourses = paginateItems(catalogCourses, pagination.page, pagination.pageSize);

		return json({
			courses: paginatedCourses,
			pagination,
			filters: {
				categories: [], // TODO: Get actual categories
				tags: [] // TODO: Get actual tags
			}
		});
	} catch (err) {
		console.error('Catalog API error:', err);
		return error(500, 'Failed to load catalog');
	}
};
