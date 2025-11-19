import type { LearningPathDepth4, BundleDepth3, ModuleDepth2, CourseDepth1 } from '../shared/types';
import type { CourseProgress } from '../shared/types';

/**
 * Learning path with attached progress data
 */
export type LearningPathWithProgress = {
	learningPath: LearningPathDepth4;
	totalCourses: number;
	completedCourses: number;
	inProgressCourses: number;
	completionPercentage: number;
	currentCourse?: CourseDepth1;
	nextCourse?: CourseDepth1;
};

/**
 * Sequential access state for a learning path
 */
export type SequentialState = {
	isSequential: boolean;
	currentCourseId: number | null;
	nextCourseId: number | null;
	lockedCourseIds: number[];
	unlockedCourseIds: number[];
	completedCourseIds: number[];
};

/**
 * Navigation tree item for learning path sidebar
 */
export type PathNavigationItem = {
	id: string;
	name: string;
	type: 'learning-path' | 'bundle' | 'module' | 'course';
	isCompleted: boolean;
	isLocked: boolean;
	isCurrent: boolean;
	parentId?: string;
	order: number;
	depth: number;
};

/**
 * Course accessibility info in sequential learning path
 */
export type CourseAccessibility = {
	courseId: number;
	isAccessible: boolean;
	isCompleted: boolean;
	isInProgress: boolean;
	isLocked: boolean;
	lockReason?: 'sequential' | 'previous-incomplete';
};

/**
 * Learning path enrollment info
 */
export type LearningPathEnrollment = {
	id: string;
	user: string;
	learningPath: string;
	enrollmentSource: 'direct' | 'organization';
	status: 'active' | 'inactive';
	enrolledAt: string;
	createdAt: string;
	updatedAt: string;
};
