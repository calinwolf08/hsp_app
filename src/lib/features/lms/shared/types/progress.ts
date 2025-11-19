// Progress collection types based on PayloadCMS LMS API
import type { Course, Bundle, Section, Activity } from './content';

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';

export type BundleProgress = {
	id: string;
	user: string;
	bundle: number | Bundle;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type CourseProgress = {
	id: string;
	user: string;
	course: number | Course;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type SectionProgress = {
	id: string;
	user: string;
	section: number | Section;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type ActivityProgress = {
	id: string;
	user: string;
	activity: number | Activity;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};
