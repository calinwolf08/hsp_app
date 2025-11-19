import type { ProgressStatus, ActivityType, EnrollmentSource } from './types';

// API Endpoints
export const API_ENDPOINTS = {
	LEARNING_PATHS: '/api/learning-paths',
	BUNDLES: '/api/bundles',
	MODULES: '/api/modules',
	COURSES: '/api/courses',
	SECTIONS: '/api/sections',
	ACTIVITIES: '/api/activities',
	ORGANIZATION_ENROLLMENTS: '/api/organization-enrollments',
	BUNDLE_ENROLLMENTS: '/api/bundle-enrollments',
	COURSE_ENROLLMENTS: '/api/course-enrollments',
	BUNDLE_PROGRESS: '/api/bundle-progress',
	COURSE_PROGRESS: '/api/course-progress',
	SECTION_PROGRESS: '/api/section-progress',
	ACTIVITY_PROGRESS: '/api/activity-progress'
} as const;

// Progress Status Values
export const PROGRESS_STATUS: Record<string, ProgressStatus> = {
	NOT_STARTED: 'not-started',
	IN_PROGRESS: 'in-progress',
	COMPLETED: 'completed'
} as const;

// Enrollment Source Values
export const ENROLLMENT_SOURCE: Record<string, EnrollmentSource> = {
	DIRECT: 'direct',
	BUNDLE: 'bundle',
	LEARNING_PATH: 'learning-path'
} as const;

// Access Types
export const ACCESS_TYPE = {
	SEQUENTIAL: 'sequential',
	AUTOMATIC: 'automatic'
} as const;

// Activity Types
export const ACTIVITY_TYPE: Record<string, ActivityType> = {
	SCORM: 'scorm',
	SURVEY: 'survey',
	VIDEO: 'video',
	DOCUMENT: 'document'
} as const;

// Pagination
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// Query Builder Helpers
export const buildQueryString = (params: Record<string, unknown>): string => {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined || value === null) return;

		if (typeof value === 'object' && !Array.isArray(value)) {
			// Handle nested objects (e.g., where conditions)
			Object.entries(value).forEach(([nestedKey, nestedValue]) => {
				if (nestedValue !== undefined && nestedValue !== null) {
					if (typeof nestedValue === 'object' && !Array.isArray(nestedValue)) {
						// Handle deeply nested (e.g., where[field][equals])
						Object.entries(nestedValue).forEach(([deepKey, deepValue]) => {
							if (deepValue !== undefined && deepValue !== null) {
								searchParams.append(`${key}[${nestedKey}][${deepKey}]`, String(deepValue));
							}
						});
					} else {
						searchParams.append(`${key}[${nestedKey}]`, String(nestedValue));
					}
				}
			});
		} else if (Array.isArray(value)) {
			searchParams.append(key, value.join(','));
		} else {
			searchParams.append(key, String(value));
		}
	});

	const result = searchParams.toString();
	return result ? `?${result}` : '';
};

// Where Condition Builders
export const whereEquals = (field: string, value: string | number | boolean) => ({
	where: {
		[field]: {
			equals: value
		}
	}
});

export const whereIn = (field: string, values: string[]) => ({
	where: {
		[field]: {
			in: values
		}
	}
});

export const whereContains = (field: string, value: string) => ({
	where: {
		[field]: {
			contains: value
		}
	}
});
