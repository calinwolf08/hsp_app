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
		const course = courses.find((c) => c.id === enrollment.course);
		const progress = progressRecords.find((p) => p.course === enrollment.course);

		if (!course) {
			throw new Error(`Course ${enrollment.course} not found`);
		}

		const status: ProgressStatus = progress?.status || 'not-started';
		const completionPercentage = progress?.completionPercentage || 0;

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
		case 'dueDate':
			return sorted.sort((a, b) => {
				const aDue = a.enrollment.dueDate;
				const bDue = b.enrollment.dueDate;
				if (!aDue && !bDue) return 0;
				if (!aDue) return 1;
				if (!bDue) return -1;
				return new Date(aDue).getTime() - new Date(bDue).getTime();
			});
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
