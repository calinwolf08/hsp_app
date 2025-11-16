import type { ApiError } from '../types';
import { PUBLIC_CMS_URL } from '$env/static/public';

export class ApiClientError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public errors?: ApiError['errors']
	) {
		super(message);
		this.name = 'ApiClientError';
	}
}

export const handleApiError = async (response: Response): Promise<never> => {
	let errorData: ApiError | null = null;

	try {
		errorData = await response.json();
	} catch {
		// If response is not JSON, use status text
	}

	const message = errorData?.errors?.[0]?.message || response.statusText || 'API request failed';

	throw new ApiClientError(message, response.status, errorData?.errors);
};

export const withCredentials = (options: RequestInit = {}): RequestInit => {
	return {
		...options,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		}
	};
};

export const apiClient = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
	const baseUrl = PUBLIC_CMS_URL || 'http://localhost:3000';
	const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

	const response = await fetch(fullUrl, withCredentials(options));

	if (!response.ok) {
		await handleApiError(response);
	}

	return response.json();
};

export const buildUrl = (endpoint: string, queryString: string): string => {
	return `${endpoint}${queryString}`;
};
