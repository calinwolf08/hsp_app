import type { Activity } from '../shared/types';

// SCORM activity configuration
export type ScormConfig = {
	packageUrl: string;
	version: '1.2' | '2004';
	launchUrl?: string;
	completionThreshold?: number; // Percentage for completion
	successThreshold?: number; // Minimum score for success
};

// Video activity configuration
export type VideoConfig = {
	videoUrl: string;
	provider: 'youtube' | 'vimeo' | 'direct';
	duration?: number; // Duration in seconds
	completionPercentage?: number; // Percentage watched to mark complete
	allowSkip?: boolean;
};

// Document activity configuration
export type DocumentConfig = {
	documentUrl: string;
	fileType: 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx';
	requireFullView?: boolean; // Must view all pages
	minViewTime?: number; // Minimum time in seconds
};

// Survey activity configuration
export type SurveyConfig = {
	surveyUrl: string;
	isRequired: boolean;
	questions?: number;
};

// Activity completion data
export type CompletionData = {
	// SCORM completion data
	scormData?: {
		completionStatus: 'completed' | 'incomplete' | 'not attempted';
		successStatus?: 'passed' | 'failed' | 'unknown';
		score?: number;
		maxScore?: number;
		sessionTime?: number; // In seconds
		suspendData?: string; // SCORM suspend data
	};

	// Video completion data
	videoData?: {
		watchedSeconds: number;
		totalSeconds: number;
		watchedPercentage: number;
		completed: boolean;
	};

	// Document completion data
	documentData?: {
		viewedPages: number;
		totalPages: number;
		viewTimeSeconds: number;
		completed: boolean;
	};

	// Survey completion data
	surveyData?: {
		submitted: boolean;
		answeredQuestions?: number;
		totalQuestions?: number;
	};

	// Common fields
	startedAt?: string;
	completedAt?: string;
	attempts?: number;
};

// Activity player props
export type ActivityPlayerProps = {
	activity: Activity;
	userId: string;
	onComplete?: (data: CompletionData) => void;
	onProgress?: (data: Partial<CompletionData>) => void;
	onError?: (error: Error) => void;
};

// Activity type union
export type ActivityType = 'scorm' | 'video' | 'document' | 'survey';

// Activity config union
export type ActivityConfig = ScormConfig | VideoConfig | DocumentConfig | SurveyConfig;
