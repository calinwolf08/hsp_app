// Progress collection types based on PayloadCMS LMS API
import type { Course, Bundle, Section, Activity } from './content';

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';

export type BundleProgress = {
	id: string;
	user: string;
	bundle: string | Bundle;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type CourseProgress = {
	id: string;
	user: string;
	course: string | Course;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type SectionProgress = {
	id: string;
	user: string;
	section: string | Section;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type ActivityProgress = {
	id: string;
	user: string;
	activity: string | Activity;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};
