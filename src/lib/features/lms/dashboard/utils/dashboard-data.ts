import type {
	Course,
	CourseEnrollment,
	CourseProgress,
	ProgressStatus
} from '../../shared/types';
import type {
	DashboardCourse,
	DashboardStats,
	SortOption,
	FilterOption
} from '../types';

/**
 * Combine enrollment, progress, and course data into dashboard courses
 */
export const combineCourseData = (
	enrollments: CourseEnrollment[],
	progressRecords: CourseProgress[],
	courses: Course[]
): DashboardCourse[] => {
	return enrollments.map((enrollment) => {
		const course = courses.find((c) => c.id === enrollment.course.id);
		const progress = progressRecords.find((p) => p.course === enrollment.course.id);

		if (!course) {
			throw new Error(`Course ${enrollment.course.id} not found`);
		}

		const status: ProgressStatus = progress?.status || 'not-started';

		// Calculate completion percentage based on status
		// In a real implementation, this would be calculated from section/activity progress
		let completionPercentage = 0;
		if (status === 'completed') {
			completionPercentage = 100;
		} else if (status === 'in-progress') {
			// For in-progress courses, we'd need to calculate from sections/activities
			// For now, default to 50% for in-progress courses
			completionPercentage = 50;
		}

		return {
			course,
			enrollment,
			progress: progress || null,
			completionPercentage,
			status
		};
	});
};

/**
 * Calculate aggregate statistics for dashboard
 */
export const calculateDashboardStats = (courses: DashboardCourse[]): DashboardStats => {
	const total = courses.length;
	const completed = courses.filter((c) => c.status === 'completed').length;
	const inProgress = courses.filter((c) => c.status === 'in-progress').length;
	const notStarted = courses.filter((c) => c.status === 'not-started').length;

	const totalCompletion = courses.reduce((sum, c) => sum + c.completionPercentage, 0);
	const overallCompletionPercentage = total > 0 ? Math.round(totalCompletion / total) : 0;

	return {
		totalEnrolled: total,
		inProgress,
		completed,
		notStarted,
		overallCompletionPercentage
	};
};

/**
 * Sort courses based on sort option
 */
export const sortCourses = (
	courses: DashboardCourse[],
	sortBy: SortOption
): DashboardCourse[] => {
	const sorted = [...courses];

	switch (sortBy) {
		case 'recent':
			return sorted.sort((a, b) => {
				const aDate = a.progress?.updatedAt || a.enrollment.createdAt;
				const bDate = b.progress?.updatedAt || b.enrollment.createdAt;
				return new Date(bDate).getTime() - new Date(aDate).getTime();
			});
		case 'title':
			return sorted.sort((a, b) => a.course.name.localeCompare(b.course.name));
		case 'progress':
			return sorted.sort((a, b) => b.completionPercentage - a.completionPercentage);
		default:
			return sorted;
	}
};

/**
 * Filter courses based on filter option
 */
export const filterCourses = (
	courses: DashboardCourse[],
	filterBy: FilterOption
): DashboardCourse[] => {
	if (filterBy === 'all') {
		return courses;
	}

	return courses.filter((c) => {
		switch (filterBy) {
			case 'in-progress':
				return c.status === 'in-progress';
			case 'completed':
				return c.status === 'completed';
			case 'not-started':
				return c.status === 'not-started';
			default:
				return true;
		}
	});
};

/**
 * Get the most recently accessed in-progress course
 */
export const getContinueLearning = (courses: DashboardCourse[]): DashboardCourse | null => {
	const inProgress = courses.filter((c) => c.status === 'in-progress');

	if (inProgress.length === 0) {
		return null;
	}

	return inProgress.sort((a, b) => {
		const aDate = a.progress?.updatedAt || a.enrollment.createdAt;
		const bDate = b.progress?.updatedAt || b.enrollment.createdAt;
		return new Date(bDate).getTime() - new Date(aDate).getTime();
	})[0];
};

/**
 * Get recently accessed courses up to a limit
 */
export const getRecentCourses = (
	courses: DashboardCourse[],
	limit: number = 5
): DashboardCourse[] => {
	return sortCourses(courses, 'recent').slice(0, limit);
};
