import type { Bundle, Module, Course } from '../shared/types';
import type { BundleProgress, CourseProgress } from '../shared/types';

/**
 * Bundle with attached progress data
 */
export type BundleWithProgress = {
	bundle: Bundle;
	totalCourses: number;
	completedCourses: number;
	inProgressCourses: number;
	completionPercentage: number;
	modules: ModuleWithProgress[];
};

/**
 * Module with progress information
 */
export type ModuleWithProgress = {
	module: Module;
	totalCourses: number;
	completedCourses: number;
	inProgressCourses: number;
	completionPercentage: number;
	courses: CourseWithProgress[];
};

/**
 * Course with progress for bundle display
 */
export type CourseWithProgress = {
	course: Course;
	progress: CourseProgress | null;
	isCompleted: boolean;
	isInProgress: boolean;
	isNotStarted: boolean;
};

/**
 * Bundle enrollment info
 */
export type BundleEnrollment = {
	id: string;
	user: string;
	bundle: string;
	enrollmentSource: 'direct' | 'organization' | 'learning-path';
	status: 'active' | 'inactive';
	enrolledAt: string;
	createdAt: string;
	updatedAt: string;
};

/**
 * Module navigation item
 */
export type ModuleNavigationItem = {
	id: string;
	name: string;
	isExpanded: boolean;
	completionPercentage: number;
	courseCount: number;
	completedCount: number;
};
