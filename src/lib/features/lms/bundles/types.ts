import type { BundleDepth3, ModuleDepth2, CourseDepth1 } from '../shared/types';
import type { BundleProgress, CourseProgress } from '../shared/types';

/**
 * Bundle with attached progress data
 */
export type BundleWithProgress = {
	bundle: BundleDepth3;
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
	module: ModuleDepth2;
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
	course: CourseDepth1;
	progress: CourseProgress | null;
	completionPercentage: number;
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
