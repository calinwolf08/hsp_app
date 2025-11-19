import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getCourseEnrollments } from '$lib/features/lms/shared/api/enrollment-api';
import { getCourseProgress } from '$lib/features/lms/shared/api/progress-api';
import { getCourses } from '$lib/features/lms/shared/api/content-api';
import {
	combineCourseData,
	calculateDashboardStats,
	getContinueLearning
} from '$lib/features/lms/dashboard/utils/dashboard-data';
import type { DashboardData } from '$lib/features/lms/dashboard/types';
import type { Course } from '$lib/features/lms/shared/types';
import { PageSlugs } from '$lib/constants';

/**
 * Helper to extract ID from either string or Course object
 */
const getCourseId = (course: string | Course): string => {
	return typeof course === 'string' ? course : course.id;
};

export const load: PageServerLoad = async ({ locals }) => {
	// Ensure user is authenticated
	if (!locals.session?.user) {
		throw redirect(302, PageSlugs.login);
	}

	const userId = locals.session.user.id;

	try {
		// Fetch all course enrollments for the user
		const enrollmentsResponse = await getCourseEnrollments(userId);
		const enrollments = enrollmentsResponse.docs;

		// Get unique course IDs from enrollments
		const courseIds = enrollments.map((e) => getCourseId(e.course));

		// Fetch all enrolled courses and progress records in parallel
		const [coursesResponse, progressRecords] = await Promise.all([
			courseIds.length > 0
				? getCourses({
						where: {
							id: { in: courseIds }
						}
					})
				: Promise.resolve({ docs: [] }),
			// Fetch progress for each course
			Promise.all(
				courseIds.map((courseId) => getCourseProgress(userId, courseId).catch(() => null))
			)
		]);

		// Extract courses from paginated response
		const courses = Array.isArray(coursesResponse) ? coursesResponse : coursesResponse.docs;

		// Filter out null progress records
		const validProgressRecords = progressRecords.filter((p) => p !== null);

		// Combine data into dashboard courses
		const dashboardCourses = combineCourseData(enrollments, validProgressRecords, courses);

		// Calculate statistics
		const stats = calculateDashboardStats(dashboardCourses);

		// Get continue learning course
		const continueLearning = getContinueLearning(dashboardCourses);

		const dashboardData: DashboardData = {
			courses: dashboardCourses,
			stats,
			continueLearning
		};

		return {
			dashboardData
		};
	} catch (error) {
		console.error('Failed to load dashboard data:', error);
		// Return empty dashboard data on error
		return {
			dashboardData: {
				courses: [],
				stats: {
					totalEnrolled: 0,
					inProgress: 0,
					completed: 0,
					notStarted: 0,
					overallCompletionPercentage: 0
				},
				continueLearning: null
			} as DashboardData,
			error: 'Failed to load dashboard data'
		};
	}
};
