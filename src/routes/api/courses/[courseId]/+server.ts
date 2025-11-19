import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCourse } from '$lib/features/lms/shared/api/content-api';
import { checkEnrollmentStatus } from '$lib/features/lms/catalog/utils/enrollment-actions';
import { getCourseEnrollments } from '$lib/features/lms/shared/api/enrollment-api';

export const GET: RequestHandler = async ({ locals, params }) => {
	const { courseId } = params;

	try {
		// Fetch course details with depth to include sections
		const course = await getCourse(courseId, 3);

		// Count total activities
		let totalActivities = 0;
		for (const sectionItem of course.sections) {
			const section = typeof sectionItem.section === 'string' ? null : sectionItem.section;
			if (section) {
				totalActivities += section.activities.length;
			}
		}

		// Check enrollment status if user is authenticated
		let isEnrolled = false;
		let enrollmentId: string | undefined = undefined;
		let enrolledAt: string | undefined = undefined;

		if (locals.session?.user) {
			const userId = locals.session.user.id;
			const enrollmentsResponse = await getCourseEnrollments(userId, {
				limit: 1000
			});
			const enrollments = enrollmentsResponse.docs;

			const enrollmentStatus = checkEnrollmentStatus(userId, courseId, enrollments);
			isEnrolled = enrollmentStatus.isEnrolled;
			enrollmentId = enrollmentStatus.enrollment?.id;
			enrolledAt = enrollmentStatus.enrollment?.enrolledAt;
		}

		return json({
			course,
			isEnrolled,
			enrollmentId,
			enrolledAt,
			sections: course.sections.length,
			totalActivities
		});
	} catch (err) {
		console.error('Course details API error:', err);
		return error(404, 'Course not found');
	}
};
