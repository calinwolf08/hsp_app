import type {
	BundleProgress,
	CourseProgress,
	SectionProgress,
	ActivityProgress,
	ProgressStatus,
	PaginatedResponse,
	QueryParams
} from '../types';
import { apiClient, buildUrl } from './client';
import { API_ENDPOINTS, buildQueryString, whereEquals, whereIn } from '../constants';

export const getBundleProgress = async (
	userId: string,
	bundleId: string
): Promise<BundleProgress | null> => {
	const queryParams = {
		...whereEquals('user', userId),
		where: {
			...whereEquals('bundle', bundleId).where
		},
		limit: 1
	};
	const url = buildUrl(API_ENDPOINTS.BUNDLE_PROGRESS, buildQueryString(queryParams));
	const response = await apiClient<PaginatedResponse<BundleProgress>>(url);
	return response.docs[0] || null;
};

export const getCourseProgress = async (
	userId: string,
	courseId: string
): Promise<CourseProgress | null> => {
	const queryParams = {
		...whereEquals('user', userId),
		where: {
			...whereEquals('course', courseId).where
		},
		limit: 1
	};
	const url = buildUrl(API_ENDPOINTS.COURSE_PROGRESS, buildQueryString(queryParams));
	const response = await apiClient<PaginatedResponse<CourseProgress>>(url);
	return response.docs[0] || null;
};

export const getSectionProgress = async (
	userId: string,
	sectionId: string
): Promise<SectionProgress | null> => {
	const queryParams = {
		...whereEquals('user', userId),
		where: {
			...whereEquals('section', sectionId).where
		},
		limit: 1
	};
	const url = buildUrl(API_ENDPOINTS.SECTION_PROGRESS, buildQueryString(queryParams));
	const response = await apiClient<PaginatedResponse<SectionProgress>>(url);
	return response.docs[0] || null;
};

export const getActivityProgress = async (
	userId: string,
	activityId: string
): Promise<ActivityProgress | null> => {
	const queryParams = {
		...whereEquals('user', userId),
		where: {
			...whereEquals('activity', activityId).where
		},
		limit: 1
	};
	const url = buildUrl(API_ENDPOINTS.ACTIVITY_PROGRESS, buildQueryString(queryParams));
	const response = await apiClient<PaginatedResponse<ActivityProgress>>(url);
	return response.docs[0] || null;
};

export const getMultipleProgress = async (
	userId: string,
	ids: string[],
	type: 'activity' | 'section' | 'course' | 'bundle'
): Promise<ActivityProgress[] | SectionProgress[] | CourseProgress[] | BundleProgress[]> => {
	const endpointMap = {
		activity: API_ENDPOINTS.ACTIVITY_PROGRESS,
		section: API_ENDPOINTS.SECTION_PROGRESS,
		course: API_ENDPOINTS.COURSE_PROGRESS,
		bundle: API_ENDPOINTS.BUNDLE_PROGRESS
	};

	const fieldMap = {
		activity: 'activity',
		section: 'section',
		course: 'course',
		bundle: 'bundle'
	};

	const queryParams = {
		...whereEquals('user', userId),
		where: {
			...whereIn(fieldMap[type], ids).where
		}
	};

	const url = buildUrl(endpointMap[type], buildQueryString(queryParams));
	const response = await apiClient<PaginatedResponse<any>>(url);
	return response.docs;
};

export const updateActivityProgress = async (
	userId: string,
	activityId: string,
	status: ProgressStatus,
	scormData?: object | null
): Promise<ActivityProgress> => {
	// Check if progress exists
	const existing = await getActivityProgress(userId, activityId);

	if (existing) {
		// Update existing
		return apiClient<ActivityProgress>(`${API_ENDPOINTS.ACTIVITY_PROGRESS}/${existing.id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				status,
				...(status === 'in-progress' && !existing.startedAt
					? { startedAt: new Date().toISOString() }
					: {}),
				...(status === 'completed' ? { completedAt: new Date().toISOString() } : {}),
				...(scormData !== undefined ? { scormData } : {})
			})
		});
	} else {
		// Create new
		return apiClient<ActivityProgress>(API_ENDPOINTS.ACTIVITY_PROGRESS, {
			method: 'POST',
			body: JSON.stringify({
				user: userId,
				activity: activityId,
				status,
				...(status === 'in-progress' || status === 'completed'
					? { startedAt: new Date().toISOString() }
					: {}),
				...(status === 'completed' ? { completedAt: new Date().toISOString() } : {}),
				...(scormData !== undefined ? { scormData } : {})
			})
		});
	}
};

export const updateSectionProgress = async (
	userId: string,
	sectionId: string,
	status: ProgressStatus
): Promise<SectionProgress> => {
	const existing = await getSectionProgress(userId, sectionId);

	if (existing) {
		return apiClient<SectionProgress>(`${API_ENDPOINTS.SECTION_PROGRESS}/${existing.id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				status,
				...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
			})
		});
	} else {
		return apiClient<SectionProgress>(API_ENDPOINTS.SECTION_PROGRESS, {
			method: 'POST',
			body: JSON.stringify({
				user: userId,
				section: sectionId,
				status,
				...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
			})
		});
	}
};

export const updateCourseProgress = async (
	userId: string,
	courseId: string,
	status: ProgressStatus
): Promise<CourseProgress> => {
	const existing = await getCourseProgress(userId, courseId);

	if (existing) {
		return apiClient<CourseProgress>(`${API_ENDPOINTS.COURSE_PROGRESS}/${existing.id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				status,
				...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
			})
		});
	} else {
		return apiClient<CourseProgress>(API_ENDPOINTS.COURSE_PROGRESS, {
			method: 'POST',
			body: JSON.stringify({
				user: userId,
				course: courseId,
				status,
				...(status === 'in-progress' || status === 'completed'
					? { startedAt: new Date().toISOString() }
					: {}),
				...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
			})
		});
	}
};
