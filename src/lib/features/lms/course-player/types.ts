import type { Course, CourseProgress, Activity, Section } from '../shared/types';

/**
 * Course with attached progress data
 */
export type CourseWithProgress = {
	course: Course;
	progress: CourseProgress | null;
	completionPercentage: number;
};

/**
 * Current navigation state within a course
 */
export type NavigationState = {
	currentSectionId: string | null;
	currentActivityId: string | null;
	currentSectionIndex: number;
	currentActivityIndex: number;
	totalSections: number;
	totalActivities: number;
	isFirstActivity: boolean;
	isLastActivity: boolean;
	canNavigateNext: boolean;
	canNavigatePrevious: boolean;
};

/**
 * Navigation item for sidebar/menu
 */
export type NavigationItem = {
	id: string;
	title: string;
	type: 'section' | 'activity';
	isCompleted: boolean;
	isActive: boolean;
	isCurrent: boolean;
	isLocked: boolean;
	sectionId?: string; // For activities, which section they belong to
	activityType?: 'scorm' | 'video' | 'document' | 'survey';
	order: number;
};

/**
 * Completion handler callback type
 */
export type CompletionHandler = (params: {
	activityId: string;
	sectionId: string;
	courseId: string;
	completionData: any;
}) => Promise<void>;

/**
 * Navigation handler callback type
 */
export type NavigationHandler = (direction: 'next' | 'previous' | 'specific', targetId?: string) => void;

/**
 * Course player error types
 */
export type CoursePlayerError =
	| 'COURSE_NOT_FOUND'
	| 'NOT_ENROLLED'
	| 'ACTIVITY_NOT_FOUND'
	| 'SECTION_NOT_FOUND'
	| 'LOCKED_CONTENT'
	| 'INVALID_NAVIGATION';
