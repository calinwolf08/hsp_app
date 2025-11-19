import type {
	LearningPath,
	Bundle,
	Course,
	Section,
	Activity,
	PaginatedResponse,
	QueryParams
} from '../types';
import { apiClient, buildUrl } from './client';
import { API_ENDPOINTS, buildQueryString } from '../constants';

export const getLearningPaths = async (
	params: QueryParams = {}
): Promise<PaginatedResponse<LearningPath>> => {
	const url = buildUrl(API_ENDPOINTS.LEARNING_PATHS, buildQueryString(params));
	return apiClient<PaginatedResponse<LearningPath>>(url);
};

export const getLearningPath = async (id: string, depth = 2): Promise<LearningPath> => {
	const url = buildUrl(API_ENDPOINTS.LEARNING_PATHS, `/${id}${buildQueryString({ depth })}`);
	return apiClient<LearningPath>(url);
};

export const getBundles = async (params: QueryParams = {}): Promise<PaginatedResponse<Bundle>> => {
	const url = buildUrl(API_ENDPOINTS.BUNDLES, buildQueryString(params));
	return apiClient<PaginatedResponse<Bundle>>(url);
};

export const getBundle = async (id: string, depth = 3): Promise<Bundle> => {
	const url = buildUrl(API_ENDPOINTS.BUNDLES, `/${id}${buildQueryString({ depth })}`);
	return apiClient<Bundle>(url);
};

export const getCourses = async (params: QueryParams = {}): Promise<PaginatedResponse<Course>> => {
	const url = buildUrl(API_ENDPOINTS.COURSES, buildQueryString(params));
	return apiClient<PaginatedResponse<Course>>(url);
};

export const getCourse = async (id: string, depth = 3): Promise<Course> => {
	const url = buildUrl(API_ENDPOINTS.COURSES, `/${id}${buildQueryString({ depth })}`);
	return apiClient<Course>(url);
};

export const getSection = async (id: string, depth = 2): Promise<Section> => {
	const url = buildUrl(API_ENDPOINTS.SECTIONS, `/${id}${buildQueryString({ depth })}`);
	return apiClient<Section>(url);
};

export const getActivity = async (id: string): Promise<Activity> => {
	const url = `${API_ENDPOINTS.ACTIVITIES}/${id}`;
	return apiClient<Activity>(url);
};
