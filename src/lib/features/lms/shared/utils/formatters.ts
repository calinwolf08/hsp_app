import type { EnrollmentSource, ActivityType } from '../types';

export const formatDate = (isoString: string): string => {
	const date = new Date(isoString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

export const formatRelativeTime = (isoString: string): string => {
	const date = new Date(isoString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return 'just now';
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 30) {
		return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) {
		return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
	}

	const diffInYears = Math.floor(diffInMonths / 12);
	return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

export const formatDuration = (seconds: number): string => {
	if (seconds < 60) {
		return `${seconds}s`;
	}

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	if (minutes < 60) {
		return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatPercentage = (value: number): string => {
	return `${Math.round(value)}%`;
};

export const formatEnrollmentSource = (source: EnrollmentSource): string => {
	const sourceMap: Record<EnrollmentSource, string> = {
		direct: 'Direct Enrollment',
		bundle: 'Bundle',
		'learning-path': 'Learning Path'
	};

	return sourceMap[source] || source;
};

export const formatActivityType = (type: ActivityType): string => {
	const typeMap: Record<ActivityType, string> = {
		scorm: 'SCORM',
		survey: 'Survey',
		video: 'Video',
		document: 'Document'
	};

	return typeMap[type] || type;
};
