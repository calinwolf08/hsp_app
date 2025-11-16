import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	getLearningPaths,
	getLearningPath,
	getBundles,
	getBundle,
	getCourses,
	getCourse,
	getSection,
	getActivity
} from './content-api';
import * as client from './client';

vi.mock('./client', () => ({
	apiClient: vi.fn(),
	buildUrl: (endpoint: string, query: string) => `${endpoint}${query}`
}));

vi.mock('$env/static/public', () => ({
	PUBLIC_CMS_URL: 'http://test-cms.com'
}));

describe('Content API', () => {
	const mockApiClient = vi.mocked(client.apiClient);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getLearningPaths', () => {
		it('should fetch learning paths with default params', async () => {
			const mockResponse = {
				docs: [],
				totalDocs: 0,
				limit: 10,
				page: 1,
				totalPages: 0,
				hasNextPage: false,
				hasPrevPage: false,
				nextPage: null,
				prevPage: null
			};
			mockApiClient.mockResolvedValue(mockResponse);

			const result = await getLearningPaths();
			expect(result).toEqual(mockResponse);
			expect(mockApiClient).toHaveBeenCalledWith('/api/learning-paths');
		});

		it('should fetch learning paths with query params', async () => {
			const mockResponse = { docs: [], totalDocs: 0, limit: 10, page: 1 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			await getLearningPaths({
				where: { published: { equals: true } },
				depth: 2
			});

			expect(mockApiClient).toHaveBeenCalled();
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('/api/learning-paths?');
		});
	});

	describe('getLearningPath', () => {
		it('should fetch single learning path with depth', async () => {
			const mockPath = { id: '1', name: 'Test Path' } as any;
			mockApiClient.mockResolvedValue(mockPath);

			const result = await getLearningPath('1');
			expect(result).toEqual(mockPath);
			expect(mockApiClient).toHaveBeenCalled();
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('/1');
			expect(callArg).toContain('depth=2');
		});

		it('should allow custom depth', async () => {
			const mockPath = { id: '1', name: 'Test Path' } as any;
			mockApiClient.mockResolvedValue(mockPath);

			await getLearningPath('1', 5);
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('depth=5');
		});
	});

	describe('getBundles', () => {
		it('should fetch bundles', async () => {
			const mockResponse = { docs: [], totalDocs: 0 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			const result = await getBundles();
			expect(result).toEqual(mockResponse);
			expect(mockApiClient).toHaveBeenCalledWith('/api/bundles');
		});
	});

	describe('getBundle', () => {
		it('should fetch single bundle with depth', async () => {
			const mockBundle = { id: '1', name: 'Test Bundle' } as any;
			mockApiClient.mockResolvedValue(mockBundle);

			const result = await getBundle('1');
			expect(result).toEqual(mockBundle);
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('/1');
			expect(callArg).toContain('depth=3');
		});
	});

	describe('getCourses', () => {
		it('should fetch courses', async () => {
			const mockResponse = { docs: [], totalDocs: 0 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			const result = await getCourses();
			expect(result).toEqual(mockResponse);
			expect(mockApiClient).toHaveBeenCalledWith('/api/courses');
		});

		it('should support filtering', async () => {
			const mockResponse = { docs: [], totalDocs: 0 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			await getCourses({
				where: { published: { equals: true } },
				limit: 20
			});

			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('/api/courses?');
		});
	});

	describe('getCourse', () => {
		it('should fetch single course with sections and activities', async () => {
			const mockCourse = { id: '1', name: 'Test Course' } as any;
			mockApiClient.mockResolvedValue(mockCourse);

			const result = await getCourse('1');
			expect(result).toEqual(mockCourse);
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('/1');
			expect(callArg).toContain('depth=3');
		});
	});

	describe('getSection', () => {
		it('should fetch section with activities', async () => {
			const mockSection = { id: '1', name: 'Test Section' } as any;
			mockApiClient.mockResolvedValue(mockSection);

			const result = await getSection('1');
			expect(result).toEqual(mockSection);
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('/1');
			expect(callArg).toContain('depth=2');
		});
	});

	describe('getActivity', () => {
		it('should fetch activity', async () => {
			const mockActivity = { id: '1', name: 'Test Activity', activityType: 'scorm' } as any;
			mockApiClient.mockResolvedValue(mockActivity);

			const result = await getActivity('1');
			expect(result).toEqual(mockActivity);
			expect(mockApiClient).toHaveBeenCalledWith('/api/activities/1');
		});
	});
});
