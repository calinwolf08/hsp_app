import type { CourseEnrollment, BundleEnrollment, CourseDepth1 } from '../types';

export const hasActiveEnrollment = (enrollments: CourseEnrollment[] | BundleEnrollment[]): boolean => {
	return enrollments.some((enrollment) => enrollment.isActive);
};

export const canAccessCourse = (enrollments: CourseEnrollment[], courseId: string | number): boolean => {
	const courseIdNum = typeof courseId === 'string' ? parseInt(courseId) : courseId;
	return enrollments.some((enrollment) => {
		const enrollmentCourseId = typeof enrollment.course === 'number' ? enrollment.course : enrollment.course.id;
		return enrollmentCourseId === courseIdNum && enrollment.isActive;
	});
};

export const canAccessBundle = (enrollments: BundleEnrollment[], bundleId: string | number): boolean => {
	const bundleIdNum = typeof bundleId === 'string' ? parseInt(bundleId) : bundleId;
	return enrollments.some((enrollment) => {
		const enrollmentBundleId = typeof enrollment.bundle === 'number' ? enrollment.bundle : enrollment.bundle.id;
		return enrollmentBundleId === bundleIdNum && enrollment.isActive;
	});
};

export const filterAccessibleCourses = (
	courses: CourseDepth1[],
	enrollments: CourseEnrollment[]
): CourseDepth1[] => {
	const accessibleCourseIds = new Set(
		enrollments.filter((e) => e.isActive).map((e) => typeof e.course === 'number' ? e.course : e.course.id)
	);

	return courses.filter((course) => accessibleCourseIds.has(course.id));
};

export const getEnrollmentSource = (
	enrollments: CourseEnrollment[] | BundleEnrollment[],
	itemId: string | number
): string | null => {
	const itemIdNum = typeof itemId === 'string' ? parseInt(itemId) : itemId;
	const enrollment = enrollments.find(
		(e) => {
			if (!e.isActive) return false;
			if ('course' in e) {
				const courseId = typeof e.course === 'number' ? e.course : e.course.id;
				return courseId === itemIdNum;
			} else {
				const bundleId = typeof e.bundle === 'number' ? e.bundle : e.bundle.id;
				return bundleId === itemIdNum;
			}
		}
	);

	return enrollment?.enrollmentSource || null;
};
