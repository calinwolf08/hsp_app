import type {
	LearningPath,
	LearningPathDepth1,
	LearningPathDepth2,
	Bundle,
	BundleDepth1,
	BundleDepth2,
	Course,
	CourseDepth1,
	CourseDepth2,
	CourseDepth3,
	CourseDepth4,
	Section,
	SectionDepth1,
	SectionDepth2,
	SectionDepth3,
	Activity,
	ActivityDepth1,
	ActivityDepth2,
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

// LearningPath overloads
export async function getLearningPath(id: string, depth: 1): Promise<LearningPathDepth1>;
export async function getLearningPath(id: string, depth: 2): Promise<LearningPathDepth2>;
export async function getLearningPath(id: string, depth?: number): Promise<LearningPath>;
export async function getLearningPath(id: string, depth = 2): Promise<LearningPath> {
	const url = buildUrl(API_ENDPOINTS.LEARNING_PATHS, `/${id}${buildQueryString({ depth })}`);
	return apiClient<LearningPath>(url);
}

export const getBundles = async (params: QueryParams = {}): Promise<PaginatedResponse<Bundle>> => {
	const url = buildUrl(API_ENDPOINTS.BUNDLES, buildQueryString(params));
	return apiClient<PaginatedResponse<Bundle>>(url);
};

// Bundle overloads
export async function getBundle(id: string, depth: 1): Promise<BundleDepth1>;
export async function getBundle(id: string, depth: 2): Promise<BundleDepth2>;
export async function getBundle(id: string, depth?: number): Promise<Bundle>;
export async function getBundle(id: string, depth = 3): Promise<Bundle> {
	const url = buildUrl(API_ENDPOINTS.BUNDLES, `/${id}${buildQueryString({ depth })}`);
	return apiClient<Bundle>(url);
}

export const getCourses = async (params: QueryParams = {}): Promise<PaginatedResponse<Course>> => {
	const url = buildUrl(API_ENDPOINTS.COURSES, buildQueryString(params));
	return apiClient<PaginatedResponse<Course>>(url);
};

// Course overloads
export async function getCourse(id: string | number, depth: 1): Promise<CourseDepth1>;
export async function getCourse(id: string | number, depth: 2): Promise<CourseDepth2>;
export async function getCourse(id: string | number, depth: 3): Promise<CourseDepth3>;
export async function getCourse(id: string | number, depth: 4): Promise<CourseDepth4>;
export async function getCourse(id: string | number, depth?: number): Promise<Course>;
export async function getCourse(id: string | number, depth = 3): Promise<Course> {
	const url = buildUrl(API_ENDPOINTS.COURSES, `/${id}${buildQueryString({ depth })}`);
	return apiClient<Course>(url);
}

// Section overloads
export async function getSection(id: string, depth: 1): Promise<SectionDepth1>;
export async function getSection(id: string, depth: 2): Promise<SectionDepth2>;
export async function getSection(id: string, depth: 3): Promise<SectionDepth3>;
export async function getSection(id: string, depth?: number): Promise<Section>;
export async function getSection(id: string, depth = 2): Promise<Section> {
	const url = buildUrl(API_ENDPOINTS.SECTIONS, `/${id}${buildQueryString({ depth })}`);
	return apiClient<Section>(url);
}

// Activity overloads
export async function getActivity(id: string | number, depth: 1): Promise<ActivityDepth1>;
export async function getActivity(id: string | number, depth: 2): Promise<ActivityDepth2>;
export async function getActivity(id: string | number, depth?: number): Promise<Activity>;
export async function getActivity(id: string | number, depth = 2): Promise<Activity> {
	const url = `${API_ENDPOINTS.ACTIVITIES}/${id}${depth ? buildQueryString({ depth }) : ''}`;
	return apiClient<Activity>(url);
}
