import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	getOrganizationEnrollments,
	getBundleEnrollments,
	getCourseEnrollments,
	checkCourseAccess,
	checkBundleAccess,
	createCourseEnrollment
} from './enrollment-api';
import * as client from './client';

vi.mock('./client', () => ({
	apiClient: vi.fn(),
	buildUrl: (endpoint: string, query: string) => `${endpoint}${query}`
}));

vi.mock('$env/static/public', () => ({
	PUBLIC_CMS_URL: 'http://test-cms.com'
}));

describe('Enrollment API', () => {
	const mockApiClient = vi.mocked(client.apiClient);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getOrganizationEnrollments', () => {
		it('should fetch organization enrollments', async () => {
			const mockResponse = { docs: [], totalDocs: 0 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			const result = await getOrganizationEnrollments('org-1');
			expect(result).toEqual(mockResponse);
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('/api/organization-enrollments');
			expect(callArg).toContain('organization');
		});

		it('should support additional params', async () => {
			const mockResponse = { docs: [], totalDocs: 0 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			await getOrganizationEnrollments('org-1', { depth: 1 });
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('depth=1');
		});
	});

	describe('getBundleEnrollments', () => {
		it('should fetch bundle enrollments for user', async () => {
			const mockResponse = { docs: [], totalDocs: 0 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			const result = await getBundleEnrollments('user-1');
			expect(result).toEqual(mockResponse);
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('/api/bundle-enrollments');
			expect(callArg).toContain('user');
		});
	});

	describe('getCourseEnrollments', () => {
		it('should fetch course enrollments for user', async () => {
			const mockResponse = { docs: [], totalDocs: 0 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			const result = await getCourseEnrollments('user-1');
			expect(result).toEqual(mockResponse);
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('/api/course-enrollments');
			expect(callArg).toContain('user');
		});

		it('should support filtering by active status', async () => {
			const mockResponse = { docs: [], totalDocs: 0 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			await getCourseEnrollments('user-1', {
				where: { isActive: { equals: true } }
			});
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('user');
		});
	});

	describe('checkCourseAccess', () => {
		it('should return true when user has active enrollment', async () => {
			const mockResponse = {
				docs: [{ id: '1', user: 'user-1', course: 'course-1', isActive: true }],
				totalDocs: 1
			} as any;
			mockApiClient.mockResolvedValue(mockResponse);

			const result = await checkCourseAccess('user-1', 'course-1');
			expect(result).toBe(true);
			const callArg = mockApiClient.mock.calls[0][0];
			expect(callArg).toContain('limit=1');
		});

		it('should return false when user has no active enrollment', async () => {
			const mockResponse = { docs: [], totalDocs: 0 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			const result = await checkCourseAccess('user-1', 'course-1');
			expect(result).toBe(false);
		});
	});

	describe('checkBundleAccess', () => {
		it('should return true when user has active bundle enrollment', async () => {
			const mockResponse = {
				docs: [{ id: '1', user: 'user-1', bundle: 'bundle-1', isActive: true }],
				totalDocs: 1
			} as any;
			mockApiClient.mockResolvedValue(mockResponse);

			const result = await checkBundleAccess('user-1', 'bundle-1');
			expect(result).toBe(true);
		});

		it('should return false when user has no active bundle enrollment', async () => {
			const mockResponse = { docs: [], totalDocs: 0 } as any;
			mockApiClient.mockResolvedValue(mockResponse);

			const result = await checkBundleAccess('user-1', 'bundle-1');
			expect(result).toBe(false);
		});
	});

	describe('createCourseEnrollment', () => {
		it('should create course enrollment', async () => {
			const mockEnrollment = {
				id: '1',
				user: 'user-1',
				course: 'course-1',
				isActive: true,
				enrollmentSource: 'direct'
			} as any;
			mockApiClient.mockResolvedValue(mockEnrollment);

			const result = await createCourseEnrollment({ user: 'user-1', course: 'course-1' });
			expect(result).toEqual(mockEnrollment);
			expect(mockApiClient).toHaveBeenCalledWith(
				'/api/course-enrollments',
				expect.objectContaining({
					method: 'POST',
					body: expect.stringContaining('user-1')
				})
			);
		});
	});
});
