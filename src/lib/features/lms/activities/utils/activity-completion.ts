import type { CompletionData, ActivityType } from '../types';
import type { ActivityProgress } from '../../shared/types';

/**
 * Determine if an activity should be marked as complete based on type and completion data
 */
export const shouldMarkComplete = (
	activityType: ActivityType,
	completionData: CompletionData
): boolean => {
	switch (activityType) {
		case 'scorm':
			return (
				completionData.scormData?.completionStatus === 'completed' ||
				completionData.scormData?.successStatus === 'passed'
			);

		case 'video':
			return completionData.videoData?.completed === true;

		case 'document':
			return completionData.documentData?.completed === true;

		case 'survey':
			return completionData.surveyData?.submitted === true;

		default:
			return false;
	}
};

/**
 * Validate completion data for a specific activity type
 */
export const validateCompletion = (
	activityType: ActivityType,
	data: CompletionData
): { valid: boolean; errors: string[] } => {
	const errors: string[] = [];

	switch (activityType) {
		case 'scorm':
			if (!data.scormData) {
				errors.push('SCORM data is required');
			} else {
				if (!data.scormData.completionStatus) {
					errors.push('SCORM completion status is required');
				}
				if (
					data.scormData.score !== undefined &&
					data.scormData.maxScore !== undefined &&
					data.scormData.score > data.scormData.maxScore
				) {
					errors.push('SCORM score cannot exceed max score');
				}
			}
			break;

		case 'video':
			if (!data.videoData) {
				errors.push('Video data is required');
			} else {
				if (
					data.videoData.watchedSeconds < 0 ||
					data.videoData.totalSeconds < 0
				) {
					errors.push('Video time values must be positive');
				}
				if (data.videoData.watchedSeconds > data.videoData.totalSeconds) {
					errors.push('Watched time cannot exceed total time');
				}
				if (
					data.videoData.watchedPercentage < 0 ||
					data.videoData.watchedPercentage > 100
				) {
					errors.push('Watch percentage must be between 0 and 100');
				}
			}
			break;

		case 'document':
			if (!data.documentData) {
				errors.push('Document data is required');
			} else {
				if (data.documentData.viewedPages > data.documentData.totalPages) {
					errors.push('Viewed pages cannot exceed total pages');
				}
				if (data.documentData.viewTimeSeconds < 0) {
					errors.push('View time must be positive');
				}
			}
			break;

		case 'survey':
			if (!data.surveyData) {
				errors.push('Survey data is required');
			} else {
				if (
					data.surveyData.answeredQuestions !== undefined &&
					data.surveyData.totalQuestions !== undefined &&
					data.surveyData.answeredQuestions > data.surveyData.totalQuestions
				) {
					errors.push('Answered questions cannot exceed total questions');
				}
			}
			break;

		default:
			errors.push('Unknown activity type');
	}

	return {
		valid: errors.length === 0,
		errors
	};
};

/**
 * Get current timestamp in ISO format
 */
export const getCompletionTimestamp = (): string => {
	return new Date().toISOString();
};

/**
 * Build completion payload for API update
 */
export const buildCompletionPayload = (
	userId: string,
	activityId: string,
	data: CompletionData
): Partial<ActivityProgress> => {
	const isComplete = shouldMarkComplete(
		inferActivityType(data),
		data
	);

	const payload: Partial<ActivityProgress> = {
		user: userId,
		activity: activityId,
		status: isComplete ? 'completed' : 'in-progress'
	};

	// Set timestamps
	if (data.startedAt && !data.completedAt) {
		payload.startedAt = data.startedAt;
	}

	if (isComplete && !data.completedAt) {
		payload.completedAt = getCompletionTimestamp();
	} else if (data.completedAt) {
		payload.completedAt = data.completedAt;
	}

	return payload;
};

/**
 * Infer activity type from completion data
 */
const inferActivityType = (data: CompletionData): ActivityType => {
	if (data.scormData) return 'scorm';
	if (data.videoData) return 'video';
	if (data.documentData) return 'document';
	if (data.surveyData) return 'survey';
	throw new Error('Cannot infer activity type from completion data');
};

/**
 * Calculate completion percentage for an activity
 */
export const calculateActivityCompletion = (
	activityType: ActivityType,
	data: CompletionData
): number => {
	switch (activityType) {
		case 'scorm':
			if (data.scormData?.completionStatus === 'completed') return 100;
			if (data.scormData?.completionStatus === 'incomplete') return 50;
			return 0;

		case 'video':
			return data.videoData?.watchedPercentage || 0;

		case 'document':
			if (!data.documentData) return 0;
			const { viewedPages, totalPages } = data.documentData;
			return totalPages > 0 ? Math.round((viewedPages / totalPages) * 100) : 0;

		case 'survey':
			return data.surveyData?.submitted ? 100 : 0;

		default:
			return 0;
	}
};
