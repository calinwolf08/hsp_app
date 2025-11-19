import type { LearningPath, Bundle, Module, Course } from '../shared/types';
import type { CourseProgress } from '../shared/types';

/**
 * Learning path with attached progress data
 */
export type LearningPathWithProgress = {
	learningPath: LearningPath;
	totalCourses: number;
	completedCourses: number;
	inProgressCourses: number;
	completionPercentage: number;
	currentCourse?: Course;
	nextCourse?: Course;
};

/**
 * Sequential access state for a learning path
 */
export type SequentialState = {
	isSequential: boolean;
	currentCourseId: string | null;
	nextCourseId: string | null;
	lockedCourseIds: string[];
	unlockedCourseIds: string[];
	completedCourseIds: string[];
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
	courseId: string;
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
