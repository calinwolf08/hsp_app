import type {
	OrganizationEnrollment,
	BundleEnrollment,
	CourseEnrollment,
	PaginatedResponse,
	QueryParams
} from '../types';
import { apiClient, buildUrl } from './client';
import { API_ENDPOINTS, buildQueryString, whereEquals } from '../constants';

export const getOrganizationEnrollments = async (
	orgId: string,
	params: QueryParams = {}
): Promise<PaginatedResponse<OrganizationEnrollment>> => {
	const orgWhere = whereEquals('organization', orgId);
	const queryParams = {
		...params,
		where: {
			...orgWhere.where,
			...(params.where || {})
		}
	};
	const url = buildUrl(API_ENDPOINTS.ORGANIZATION_ENROLLMENTS, buildQueryString(queryParams));
	return apiClient<PaginatedResponse<OrganizationEnrollment>>(url);
};

export const getBundleEnrollments = async (
	userId: string,
	params: QueryParams = {}
): Promise<PaginatedResponse<BundleEnrollment>> => {
	const userWhere = whereEquals('user', userId);
	const queryParams = {
		...params,
		where: {
			...userWhere.where,
			...(params.where || {})
		}
	};
	const url = buildUrl(API_ENDPOINTS.BUNDLE_ENROLLMENTS, buildQueryString(queryParams));
	return apiClient<PaginatedResponse<BundleEnrollment>>(url);
};

export const getCourseEnrollments = async (
	userId: string,
	params: QueryParams = {}
): Promise<PaginatedResponse<CourseEnrollment>> => {
	const userWhere = whereEquals('user', userId);
	const queryParams = {
		...params,
		where: {
			...userWhere.where,
			...(params.where || {})
		}
	};
	const url = buildUrl(API_ENDPOINTS.COURSE_ENROLLMENTS, buildQueryString(queryParams));
	return apiClient<PaginatedResponse<CourseEnrollment>>(url);
};

export const checkCourseAccess = async (userId: string, courseId: string): Promise<boolean> => {
	const queryParams = {
		...whereEquals('user', userId),
		where: {
			...whereEquals('course', courseId).where,
			...whereEquals('isActive', true).where
		},
		limit: 1
	};
	const url = buildUrl(API_ENDPOINTS.COURSE_ENROLLMENTS, buildQueryString(queryParams));
	const response = await apiClient<PaginatedResponse<CourseEnrollment>>(url);
	return response.docs.length > 0;
};

export const checkBundleAccess = async (userId: string, bundleId: string): Promise<boolean> => {
	const queryParams = {
		...whereEquals('user', userId),
		where: {
			...whereEquals('bundle', bundleId).where,
			...whereEquals('isActive', true).where
		},
		limit: 1
	};
	const url = buildUrl(API_ENDPOINTS.BUNDLE_ENROLLMENTS, buildQueryString(queryParams));
	const response = await apiClient<PaginatedResponse<BundleEnrollment>>(url);
	return response.docs.length > 0;
};

export const createCourseEnrollment = async (
	userId: string,
	courseId: string
): Promise<CourseEnrollment> => {
	return apiClient<CourseEnrollment>(API_ENDPOINTS.COURSE_ENROLLMENTS, {
		method: 'POST',
		body: JSON.stringify({
			user: userId,
			course: courseId,
			isActive: true,
			enrollmentSource: 'direct',
			enrolledAt: new Date().toISOString()
		})
	});
};
