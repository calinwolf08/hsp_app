import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, ApiClientError, handleApiError, withCredentials, buildUrl } from './client';

// Mock the environment variable
vi.mock('$env/static/public', () => ({
	PUBLIC_CMS_URL: 'http://test-cms.com'
}));

describe('API Client', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('withCredentials', () => {
		it('should add credentials and content-type header', () => {
			const result = withCredentials();
			expect(result.credentials).toBe('include');
			expect(result.headers).toEqual({ 'Content-Type': 'application/json' });
		});

		it('should merge with existing options', () => {
			const result = withCredentials({
				method: 'POST',
				headers: { 'X-Custom': 'value' }
			});
			expect(result.method).toBe('POST');
			expect(result.credentials).toBe('include');
			expect(result.headers).toEqual({
				'Content-Type': 'application/json',
				'X-Custom': 'value'
			});
		});
	});

	describe('buildUrl', () => {
		it('should combine endpoint and query string', () => {
			const result = buildUrl('/api/courses', '?page=1&limit=10');
			expect(result).toBe('/api/courses?page=1&limit=10');
		});

		it('should handle empty query string', () => {
			const result = buildUrl('/api/courses', '');
			expect(result).toBe('/api/courses');
		});
	});

	describe('handleApiError', () => {
		it('should throw ApiClientError with message from response', async () => {
			const mockResponse = {
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				json: async () => ({
					errors: [{ message: 'Invalid field: name' }]
				})
			} as unknown as Response;

			await expect(handleApiError(mockResponse)).rejects.toThrow(ApiClientError);
			await expect(handleApiError(mockResponse)).rejects.toThrow('Invalid field: name');
		});

		it('should use statusText when no JSON error', async () => {
			const mockResponse = {
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
				json: async () => {
					throw new Error('Not JSON');
				}
			} as unknown as Response;

			await expect(handleApiError(mockResponse)).rejects.toThrow('Internal Server Error');
		});
	});

	describe('apiClient', () => {
		const mockFetch = vi.fn();
		global.fetch = mockFetch;

		afterEach(() => {
			mockFetch.mockReset();
		});

		it('should make successful request', async () => {
			const mockData = { id: '1', name: 'Test Course' };
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockData
			});

			const result = await apiClient('/api/courses/1');
			expect(result).toEqual(mockData);
			expect(mockFetch).toHaveBeenCalledWith(
				'http://test-cms.com/api/courses/1',
				expect.objectContaining({
					credentials: 'include'
				})
			);
		});

		it('should handle full URLs', async () => {
			const mockData = { test: 'data' };
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockData
			});

			await apiClient('http://external.com/api/data');
			expect(mockFetch).toHaveBeenCalledWith(
				'http://external.com/api/data',
				expect.any(Object)
			);
		});

		it('should throw ApiClientError on failed request', async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found',
				json: async () => ({
					errors: [{ message: 'Course not found' }]
				})
			});

			await expect(apiClient('/api/courses/999')).rejects.toThrow(ApiClientError);
			await expect(apiClient('/api/courses/999')).rejects.toThrow('Course not found');
		});

		it('should pass through request options', async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({})
			});

			await apiClient('/api/courses', {
				method: 'POST',
				body: JSON.stringify({ name: 'New Course' })
			});

			expect(mockFetch).toHaveBeenCalledWith(
				'http://test-cms.com/api/courses',
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({ name: 'New Course' })
				})
			);
		});
	});
});
