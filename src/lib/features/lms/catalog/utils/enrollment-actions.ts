import type { CourseDepth1, CourseEnrollment } from '../../shared/types';
import type { CatalogCourse } from '../types';
import { createCourseEnrollment, deleteCourseEnrollment } from '../../shared/api/enrollment-api';

/**
 * Enroll a user in a course
 */
export const enrollInCourse = async (
	userId: string,
	courseId: string | number,
	source: 'direct' | 'bundle' | 'learning-path' = 'direct'
): Promise<CourseEnrollment> => {
	const enrollment = await createCourseEnrollment({
		user: userId,
		course: typeof courseId === 'string' ? parseInt(courseId) : courseId,
		enrollmentSource: source,
		isActive: true,
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
	courseId: string | number,
	enrollments: CourseEnrollment[]
): {
	isEnrolled: boolean;
	enrollment?: CourseEnrollment;
} => {
	const courseIdNum = typeof courseId === 'string' ? parseInt(courseId) : courseId;
	const enrollment = enrollments.find(
		(e) => e.user === userId && (typeof e.course === 'number' ? e.course : e.course.id) === courseIdNum && e.isActive
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
	courses: CourseDepth1[],
	enrollments: CourseEnrollment[],
	userId: string
): CatalogCourse[] => {
	return courses.map((course) => {
		const enrollment = enrollments.find(
			(e) => e.user === userId && (typeof e.course === 'number' ? e.course : e.course.id) === course.id && e.isActive
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
	courses: CourseDepth1[],
	enrollments: CourseEnrollment[],
	userId: string
): CourseDepth1[] => {
	const enrolledCourseIds = enrollments
		.filter((e) => e.user === userId && e.isActive)
		.map((e) => typeof e.course === 'number' ? e.course : e.course.id);

	return courses.filter((course) => enrolledCourseIds.includes(course.id));
};

/**
 * Get all courses user is not enrolled in
 */
export const getUnenrolledCourses = (
	courses: CourseDepth1[],
	enrollments: CourseEnrollment[],
	userId: string
): CourseDepth1[] => {
	const enrolledCourseIds = enrollments
		.filter((e) => e.user === userId && e.isActive)
		.map((e) => typeof e.course === 'number' ? e.course : e.course.id);

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
