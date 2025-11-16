import type { Course, CourseEnrollment } from '../../shared/types';
import type { CatalogCourse } from '../types';
import { createCourseEnrollment, deleteCourseEnrollment } from '../../shared/api/enrollment-api';

/**
 * Enroll a user in a course
 */
export const enrollInCourse = async (
	userId: string,
	courseId: string,
	source: 'direct' | 'bundle' | 'organization' = 'direct'
): Promise<CourseEnrollment> => {
	const enrollment = await createCourseEnrollment({
		user: userId,
		course: courseId,
		enrollmentSource: source,
		status: 'active',
		enrolledAt: new Date().toISOString()
	});

	return enrollment;
};

/**
 * Unenroll a user from a course
 */
export const unenrollFromCourse = async (enrollmentId: string): Promise<void> => {
	await deleteCourseEnrollment(enrollmentId);
};

/**
 * Check enrollment status for a specific course
 */
export const checkEnrollmentStatus = (
	userId: string,
	courseId: string,
	enrollments: CourseEnrollment[]
): {
	isEnrolled: boolean;
	enrollment?: CourseEnrollment;
} => {
	const enrollment = enrollments.find(
		(e) => e.user === userId && e.course === courseId && e.status === 'active'
	);

	return {
		isEnrolled: !!enrollment,
		enrollment
	};
};

/**
 * Attach enrollment status to courses for catalog display
 */
export const attachEnrollmentStatus = (
	courses: Course[],
	enrollments: CourseEnrollment[],
	userId: string
): CatalogCourse[] => {
	return courses.map((course) => {
		const enrollment = enrollments.find(
			(e) => e.user === userId && e.course === course.id && e.status === 'active'
		);

		return {
			course,
			isEnrolled: !!enrollment,
			enrollmentId: enrollment?.id,
			enrolledAt: enrollment?.enrolledAt
		};
	});
};

/**
 * Get all courses user is enrolled in
 */
export const getEnrolledCourses = (
	courses: Course[],
	enrollments: CourseEnrollment[],
	userId: string
): Course[] => {
	const enrolledCourseIds = enrollments
		.filter((e) => e.user === userId && e.status === 'active')
		.map((e) => e.course);

	return courses.filter((course) => enrolledCourseIds.includes(course.id));
};

/**
 * Get all courses user is not enrolled in
 */
export const getUnenrolledCourses = (
	courses: Course[],
	enrollments: CourseEnrollment[],
	userId: string
): Course[] => {
	const enrolledCourseIds = enrollments
		.filter((e) => e.user === userId && e.status === 'active')
		.map((e) => e.course);

	return courses.filter((course) => !enrolledCourseIds.includes(course.id));
};

/**
 * Filter catalog courses by enrollment status
 */
export const filterByEnrollmentStatus = (
	catalogCourses: CatalogCourse[],
	status: 'all' | 'enrolled' | 'not-enrolled'
): CatalogCourse[] => {
	if (status === 'all') {
		return catalogCourses;
	}

	if (status === 'enrolled') {
		return catalogCourses.filter((c) => c.isEnrolled);
	}

	return catalogCourses.filter((c) => !c.isEnrolled);
};

/**
 * Count enrollments by status
 */
export const countEnrollmentsByStatus = (
	catalogCourses: CatalogCourse[]
): {
	total: number;
	enrolled: number;
	notEnrolled: number;
} => {
	const enrolled = catalogCourses.filter((c) => c.isEnrolled).length;

	return {
		total: catalogCourses.length,
		enrolled,
		notEnrolled: catalogCourses.length - enrolled
	};
};
