import type {
	Course,
	CourseEnrollment,
	CourseProgress,
	ProgressStatus
} from '../shared/types';

export type DashboardCourse = {
	course: Course;
	enrollment: CourseEnrollment;
	progress: CourseProgress | null;
	completionPercentage: number;
	status: ProgressStatus;
};

export type DashboardStats = {
	totalEnrolled: number;
	inProgress: number;
	completed: number;
	notStarted: number;
	overallCompletionPercentage: number;
};

export type SortOption = 'recent' | 'title' | 'progress';
export type FilterOption = 'all' | 'in-progress' | 'completed' | 'not-started';

export type FilterOptions = {
	sort: SortOption;
	filter: FilterOption;
};

export type DashboardData = {
	courses: DashboardCourse[];
	stats: DashboardStats;
	continueLearning: DashboardCourse | null;
};
