import type { ProgressStatus, SectionProgress, CourseProgress } from '../types';
import { PROGRESS_STATUS } from '../constants';

export const calculateCompletionPercentage = (total: number, completed: number): number => {
	if (total === 0) return 0;
	return Math.round((completed / total) * 100);
};

export const calculateCourseProgress = (
	sections: Array<{ id: string }>,
	sectionProgress: SectionProgress[]
): number => {
	if (sections.length === 0) return 0;

	const completedCount = sections.filter((section) => {
		const progress = sectionProgress.find((p) => p.section === section.id);
		return progress?.status === PROGRESS_STATUS.COMPLETED;
	}).length;

	return calculateCompletionPercentage(sections.length, completedCount);
};

export const calculateBundleProgress = (
	courses: Array<{ id: string }>,
	courseProgress: CourseProgress[]
): number => {
	if (courses.length === 0) return 0;

	const completedCount = courses.filter((course) => {
		const progress = courseProgress.find((p) => p.course === course.id);
		return progress?.status === PROGRESS_STATUS.COMPLETED;
	}).length;

	return calculateCompletionPercentage(courses.length, completedCount);
};

export const isItemCompleted = (progressStatus?: ProgressStatus): boolean => {
	return progressStatus === PROGRESS_STATUS.COMPLETED;
};

export type ProgressStats = {
	total: number;
	notStarted: number;
	inProgress: number;
	completed: number;
	completionPercentage: number;
};

export const getProgressStats = <T extends { status?: ProgressStatus }>(
	items: Array<{ id: string }>,
	progressRecords: T[]
): ProgressStats => {
	const total = items.length;
	let notStarted = 0;
	let inProgress = 0;
	let completed = 0;

	items.forEach((item) => {
		const progress = progressRecords.find((p: any) => {
			// Find matching progress record by checking various ID fields
			return (
				p.activity === item.id ||
				p.section === item.id ||
				p.course === item.id ||
				p.bundle === item.id
			);
		});

		if (!progress || progress.status === PROGRESS_STATUS.NOT_STARTED) {
			notStarted++;
		} else if (progress.status === PROGRESS_STATUS.IN_PROGRESS) {
			inProgress++;
		} else if (progress.status === PROGRESS_STATUS.COMPLETED) {
			completed++;
		}
	});

	return {
		total,
		notStarted,
		inProgress,
		completed,
		completionPercentage: calculateCompletionPercentage(total, completed)
	};
};

export const aggregateProgress = <T extends { status: ProgressStatus }>(
	progressRecords: T[]
): ProgressStats => {
	const total = progressRecords.length;
	const notStarted = progressRecords.filter((p) => p.status === PROGRESS_STATUS.NOT_STARTED).length;
	const inProgress = progressRecords.filter((p) => p.status === PROGRESS_STATUS.IN_PROGRESS).length;
	const completed = progressRecords.filter((p) => p.status === PROGRESS_STATUS.COMPLETED).length;

	return {
		total,
		notStarted,
		inProgress,
		completed,
		completionPercentage: calculateCompletionPercentage(total, completed)
	};
};
