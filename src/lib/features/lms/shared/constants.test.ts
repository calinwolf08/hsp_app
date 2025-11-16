import { describe, it, expect } from 'vitest';
import {
	API_ENDPOINTS,
	PROGRESS_STATUS,
	ENROLLMENT_SOURCE,
	ACCESS_TYPE,
	ACTIVITY_TYPE,
	buildQueryString,
	whereEquals,
	whereIn,
	whereContains
} from './constants';

describe('LMS Constants', () => {
	describe('API_ENDPOINTS', () => {
		it('should have all required endpoints', () => {
			expect(API_ENDPOINTS.LEARNING_PATHS).toBe('/api/learning-paths');
			expect(API_ENDPOINTS.BUNDLES).toBe('/api/bundles');
			expect(API_ENDPOINTS.COURSES).toBe('/api/courses');
			expect(API_ENDPOINTS.ACTIVITIES).toBe('/api/activities');
			expect(API_ENDPOINTS.COURSE_ENROLLMENTS).toBe('/api/course-enrollments');
			expect(API_ENDPOINTS.COURSE_PROGRESS).toBe('/api/course-progress');
		});
	});

	describe('PROGRESS_STATUS', () => {
		it('should have all progress statuses', () => {
			expect(PROGRESS_STATUS.NOT_STARTED).toBe('not-started');
			expect(PROGRESS_STATUS.IN_PROGRESS).toBe('in-progress');
			expect(PROGRESS_STATUS.COMPLETED).toBe('completed');
		});
	});

	describe('buildQueryString', () => {
		it('should build simple query string', () => {
			const result = buildQueryString({ page: 1, limit: 10 });
			expect(result).toBe('?page=1&limit=10');
		});

		it('should build query string with where conditions', () => {
			const result = buildQueryString({
				where: {
					published: {
						equals: true
					}
				}
			});
			expect(result).toBe('?where%5Bpublished%5D%5Bequals%5D=true');
		});

		it('should handle array values', () => {
			const result = buildQueryString({
				where: {
					id: {
						in: ['id1', 'id2', 'id3']
					}
				}
			});
			expect(result).toContain('id1%2Cid2%2Cid3');
		});

		it('should skip null and undefined values', () => {
			const result = buildQueryString({
				page: 1,
				limit: null,
				sort: undefined
			});
			expect(result).toBe('?page=1');
		});

		it('should return empty string for empty params', () => {
			const result = buildQueryString({});
			expect(result).toBe('');
		});

		it('should handle depth parameter', () => {
			const result = buildQueryString({ depth: 2 });
			expect(result).toBe('?depth=2');
		});
	});

	describe('Where Condition Builders', () => {
		it('should build equals condition', () => {
			const result = whereEquals('published', true);
			expect(result).toEqual({
				where: {
					published: {
						equals: true
					}
				}
			});
		});

		it('should build in condition', () => {
			const result = whereIn('id', ['1', '2', '3']);
			expect(result).toEqual({
				where: {
					id: {
						in: ['1', '2', '3']
					}
				}
			});
		});

		it('should build contains condition', () => {
			const result = whereContains('name', 'test');
			expect(result).toEqual({
				where: {
					name: {
						contains: 'test'
					}
				}
			});
		});
	});
});
