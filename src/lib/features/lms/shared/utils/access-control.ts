import type { CourseEnrollment, BundleEnrollment, Course } from '../types';

export const hasActiveEnrollment = (enrollments: CourseEnrollment[] | BundleEnrollment[]): boolean => {
	return enrollments.some((enrollment) => enrollment.isActive);
};

export const canAccessCourse = (enrollments: CourseEnrollment[], courseId: string): boolean => {
	return enrollments.some((enrollment) => enrollment.course === courseId && enrollment.isActive);
};

export const canAccessBundle = (enrollments: BundleEnrollment[], bundleId: string): boolean => {
	return enrollments.some((enrollment) => enrollment.bundle === bundleId && enrollment.isActive);
};

export const filterAccessibleCourses = (
	courses: Course[],
	enrollments: CourseEnrollment[]
): Course[] => {
	const accessibleCourseIds = new Set(
		enrollments.filter((e) => e.isActive).map((e) => e.course)
	);

	return courses.filter((course) => accessibleCourseIds.has(course.id));
};

export const getEnrollmentSource = (
	enrollments: CourseEnrollment[] | BundleEnrollment[],
	itemId: string
): string | null => {
	const enrollment = enrollments.find(
		(e) => e.isActive && ('course' in e ? e.course === itemId : e.bundle === itemId)
	);

	return enrollment?.enrollmentSource || null;
};
