import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCourseEnrollments } from '$lib/features/lms/shared/api/enrollment-api';
import { getMultipleProgress } from '$lib/features/lms/shared/api/progress-api';
import { apiClient } from '$lib/features/lms/shared/api/client';
import {
	combineCourseData,
	calculateDashboardStats,
	sortCourses,
	filterCourses
} from '$lib/features/lms/dashboard/utils/dashboard-data';
import type { SortOption, FilterOption } from '$lib/features/lms/dashboard/types';
import type { Course, CourseProgress } from '$lib/features/lms/shared/types';
import { API_ENDPOINTS } from '$lib/features/lms/shared/constants';

export const GET: RequestHandler = async ({ locals, url }) => {
	// Check authentication
	if (!locals.session?.user) {
		return error(401, 'Not authenticated');
	}

	const userId = locals.session.user.id;

	// Get query parameters
	const sort = (url.searchParams.get('sort') as SortOption) || 'recent';
	const status = (url.searchParams.get('status') as FilterOption) || 'all';

	try {
		// Fetch enrollments for the user
		const enrollmentsResponse = await getCourseEnrollments(userId, {
			depth: 1 // Populate course data
		});

		const enrollments = enrollmentsResponse.docs;

		// If no enrollments, return empty data
		if (enrollments.length === 0) {
			return json({
				courses: [],
				stats: {
					totalEnrolled: 0,
					inProgress: 0,
					completed: 0,
					notStarted: 0,
					overallCompletionPercentage: 0
				}
			});
		}

		// Extract course IDs and courses from enrollments
		const courseIds: (string | Course)[] = enrollments.map((e) => e.course);
		const courses: Course[] = [];

		// Fetch full course data for each enrollment
		for (const enrollment of enrollments) {
			// Check if course is already populated
			if (typeof enrollment.course === 'object') {
				courses.push(enrollment.course);
			} else {
				// Fetch course data
				const course = await apiClient<Course>(`${API_ENDPOINTS.COURSES}/${enrollment.course}`);
				courses.push(course);
			}
		}

		// Fetch progress for all courses
		const progressRecords = (await getMultipleProgress(
			userId,
			courseIds.map((c) => (typeof c === 'string' ? c : c.id)),
			'course'
		)) as CourseProgress[];

		// Combine data
		let dashboardCourses = combineCourseData(enrollments, progressRecords, courses);

		// Apply filtering
		dashboardCourses = filterCourses(dashboardCourses, status);

		// Apply sorting
		dashboardCourses = sortCourses(dashboardCourses, sort);

		// Calculate stats (before filtering for accurate totals)
		const allCourses = combineCourseData(enrollments, progressRecords, courses);
		const stats = calculateDashboardStats(allCourses);

		return json({
			courses: dashboardCourses,
			stats
		});
	} catch (err) {
		console.error('Dashboard API error:', err);
		return error(500, 'Failed to load dashboard data');
	}
};
