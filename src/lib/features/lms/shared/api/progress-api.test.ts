import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	getBundleProgress,
	getCourseProgress,
	getSectionProgress,
	getActivityProgress,
	getMultipleProgress,
	updateActivityProgress,
	updateSectionProgress,
	updateCourseProgress
} from './progress-api';
import * as client from './client';

vi.mock('./client', () => ({
	apiClient: vi.fn(),
	buildUrl: (endpoint: string, query: string) => `${endpoint}${query}`
}));

vi.mock('$env/static/public', () => ({
	PUBLIC_CMS_URL: 'http://test-cms.com'
}));

describe('Progress API', () => {
	const mockApiClient = vi.mocked(client.apiClient);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getBundleProgress', () => {
		it('should return progress if exists', async () => {
			const mockProgress = { id: '1', user: 'user-1', bundle: 'bundle-1', status: 'in-progress' };
			mockApiClient.mockResolvedValue({ docs: [mockProgress], totalDocs: 1 } as any);

			const result = await getBundleProgress('user-1', 'bundle-1');
			expect(result).toEqual(mockProgress);
		});

		it('should return null if no progress', async () => {
			mockApiClient.mockResolvedValue({ docs: [], totalDocs: 0 } as any);

			const result = await getBundleProgress('user-1', 'bundle-1');
			expect(result).toBeNull();
		});
	});

	describe('getCourseProgress', () => {
		it('should fetch course progress', async () => {
			const mockProgress = { id: '1', user: 'user-1', course: 'course-1', status: 'completed' };
			mockApiClient.mockResolvedValue({ docs: [mockProgress], totalDocs: 1 } as any);

			const result = await getCourseProgress('user-1', 'course-1');
			expect(result).toEqual(mockProgress);
		});
	});

	describe('getSectionProgress', () => {
		it('should fetch section progress', async () => {
			const mockProgress = { id: '1', user: 'user-1', section: 'section-1', status: 'in-progress' };
			mockApiClient.mockResolvedValue({ docs: [mockProgress], totalDocs: 1 } as any);

			const result = await getSectionProgress('user-1', 'section-1');
			expect(result).toEqual(mockProgress);
		});
	});

	describe('getActivityProgress', () => {
		it('should fetch activity progress', async () => {
			const mockProgress = { id: '1', user: 'user-1', activity: 'activity-1', status: 'not-started' };
			mockApiClient.mockResolvedValue({ docs: [mockProgress], totalDocs: 1 } as any);

			const result = await getActivityProgress('user-1', 'activity-1');
			expect(result).toEqual(mockProgress);
		});
	});

	describe('getMultipleProgress', () => {
		it('should fetch multiple activity progress records', async () => {
			const mockProgress = [
				{ id: '1', user: 'user-1', activity: 'activity-1', status: 'completed' },
				{ id: '2', user: 'user-1', activity: 'activity-2', status: 'in-progress' }
			];
			mockApiClient.mockResolvedValue({ docs: mockProgress, totalDocs: 2 } as any);

			const result = await getMultipleProgress('user-1', ['activity-1', 'activity-2'], 'activity');
			expect(result).toEqual(mockProgress);
			expect(result).toHaveLength(2);
		});

		it('should support different progress types', async () => {
			mockApiClient.mockResolvedValue({ docs: [], totalDocs: 0 } as any);

			await getMultipleProgress('user-1', ['course-1'], 'course');
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('/api/course-progress');
		});
	});

	describe('updateActivityProgress', () => {
		it('should create new progress if not exists', async () => {
			mockApiClient
				.mockResolvedValueOnce({ docs: [], totalDocs: 0 } as any) // getActivityProgress returns null
				.mockResolvedValueOnce({
					id: '1',
					user: 'user-1',
					activity: 'activity-1',
					status: 'in-progress'
				} as any); // create returns new progress

			const result = await updateActivityProgress('user-1', 'activity-1', 'in-progress');
			expect(result.status).toBe('in-progress');
			expect(mockApiClient).toHaveBeenCalledTimes(2);
			const createCall = mockApiClient.mock.calls[1];
			expect(createCall[1]?.method).toBe('POST');
		});

		it('should update existing progress', async () => {
			const existingProgress = {
				id: '1',
				user: 'user-1',
				activity: 'activity-1',
				status: 'in-progress'
			};
			mockApiClient
				.mockResolvedValueOnce({ docs: [existingProgress], totalDocs: 1 } as any)
				.mockResolvedValueOnce({ ...existingProgress, status: 'completed' } as any);

			const result = await updateActivityProgress('user-1', 'activity-1', 'completed');
			expect(result.status).toBe('completed');
			const updateCall = mockApiClient.mock.calls[1];
			expect(updateCall[1]?.method).toBe('PATCH');
		});

		it('should set completedAt when status is completed', async () => {
			mockApiClient
				.mockResolvedValueOnce({ docs: [], totalDocs: 0 } as any)
				.mockResolvedValueOnce({ id: '1', status: 'completed' } as any);

			await updateActivityProgress('user-1', 'activity-1', 'completed');
			const createCall = mockApiClient.mock.calls[1];
			const body = JSON.parse(createCall[1]?.body as string);
			expect(body.completedAt).toBeDefined();
		});
	});

	describe('updateSectionProgress', () => {
		it('should update section progress', async () => {
			mockApiClient
				.mockResolvedValueOnce({ docs: [], totalDocs: 0 } as any)
				.mockResolvedValueOnce({ id: '1', status: 'completed' } as any);

			const result = await updateSectionProgress('user-1', 'section-1', 'completed');
			expect(result.status).toBe('completed');
		});
	});

	describe('updateCourseProgress', () => {
		it('should update course progress', async () => {
			mockApiClient
				.mockResolvedValueOnce({ docs: [], totalDocs: 0 } as any)
				.mockResolvedValueOnce({ id: '1', status: 'in-progress' } as any);

			const result = await updateCourseProgress('user-1', 'course-1', 'in-progress');
			expect(result.status).toBe('in-progress');
		});
	});
});
