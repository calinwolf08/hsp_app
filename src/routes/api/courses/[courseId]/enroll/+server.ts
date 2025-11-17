import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	enrollInCourse,
	unenrollFromCourse,
	checkEnrollmentStatus
} from '$lib/features/lms/catalog/utils/enrollment-actions';
import { getCourseEnrollments } from '$lib/features/lms/shared/api/enrollment-api';
import { getCourse } from '$lib/features/lms/shared/api/content-api';

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
		const { source = 'direct' } = body as { source?: 'direct' | 'bundle' | 'organization' };

		// Verify course exists
		try {
			await getCourse(courseId);
		} catch {
			return error(404, 'Course not found');
		}

		// Check if already enrolled
		const enrollmentsResponse = await getCourseEnrollments(userId, {
			limit: 1000
		});
		const enrollments = enrollmentsResponse.docs;
		const enrollmentStatus = checkEnrollmentStatus(userId, courseId, enrollments);

		if (enrollmentStatus.isEnrolled) {
			return error(409, 'Already enrolled in this course');
		}

		// Enroll user
		const enrollment = await enrollInCourse(userId, courseId, source);

		return json({
			enrollment,
			success: true
		});
	} catch (err) {
		console.error('Enrollment API error:', err);
		return error(500, 'Enrollment failed');
	}
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	// Check authentication
	if (!locals.session?.user) {
		return error(401, 'Not authenticated');
	}

	const userId = locals.session.user.id;
	const { courseId } = params;

	try {
		// Find enrollment
		const enrollmentsResponse = await getCourseEnrollments(userId, {
			limit: 1000
		});
		const enrollments = enrollmentsResponse.docs;
		const enrollmentStatus = checkEnrollmentStatus(userId, courseId, enrollments);

		if (!enrollmentStatus.isEnrolled || !enrollmentStatus.enrollment) {
			return error(404, 'Enrollment not found');
		}

		// Unenroll user
		await unenrollFromCourse(enrollmentStatus.enrollment.id);

		return json({
			success: true
		});
	} catch (err) {
		console.error('Unenrollment API error:', err);
		return error(500, 'Unenrollment failed');
	}
};
