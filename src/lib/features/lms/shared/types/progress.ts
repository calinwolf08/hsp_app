// Progress collection types based on PayloadCMS LMS API

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';

export type BundleProgress = {
	id: string;
	user: string;
	bundle: string;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type CourseProgress = {
	id: string;
	user: string;
	course: string;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type SectionProgress = {
	id: string;
	user: string;
	section: string;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type ActivityProgress = {
	id: string;
	user: string;
	activity: string;
	status: ProgressStatus;
	startedAt?: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};
