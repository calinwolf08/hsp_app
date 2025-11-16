import { describe, it, expect } from 'vitest';
import {
	filterByCategory,
	filterByTag,
	searchCourses,
	sortCourses,
	applyAllFilters,
	buildQueryParams,
	calculatePagination,
	paginateItems,
	hasActiveFilters,
	resetFilters,
	countActiveFilters
} from './catalog-filters';
import type { Course } from '../../shared/types';
import type { CatalogFilters, PaginationState } from '../types';

describe('catalog-filters utils', () => {
	// Mock courses
	const mockCourses: Course[] = [
		{
			id: 'course-1',
			name: 'Introduction to JavaScript',
			internal_name: 'intro-js',
			slug: 'intro-javascript',
			description: {},
			published: true,
			categories: ['cat-1', 'cat-2'],
			tags: ['tag-1'],
			sections: [],
			createdAt: '2024-01-01',
			updatedAt: '2024-01-01'
		},
		{
			id: 'course-2',
			name: 'Advanced TypeScript',
			internal_name: 'adv-ts',
			slug: 'advanced-typescript',
			description: {},
			published: true,
			categories: ['cat-2'],
			tags: ['tag-2', 'tag-3'],
			sections: [],
			createdAt: '2024-01-15',
			updatedAt: '2024-01-15'
		},
		{
			id: 'course-3',
			name: 'Python Fundamentals',
			internal_name: 'python-fund',
			slug: 'python-fundamentals',
			description: {},
			published: true,
			categories: ['cat-3'],
			tags: ['tag-1', 'tag-3'],
			sections: [],
			createdAt: '2024-02-01',
			updatedAt: '2024-02-01'
		},
		{
			id: 'course-4',
			name: 'React Best Practices',
			internal_name: 'react-bp',
			slug: 'react-best-practices',
			description: {},
			published: true,
			categories: ['cat-1'],
			tags: ['tag-2'],
			sections: [],
			createdAt: '2024-01-20',
			updatedAt: '2024-01-20'
		}
	];

	describe('filterByCategory', () => {
		it('should filter courses by single category', () => {
			const filtered = filterByCategory(mockCourses, ['cat-1']);
			expect(filtered).toHaveLength(2);
			expect(filtered.map((c) => c.id)).toEqual(['course-1', 'course-4']);
		});

		it('should filter courses by multiple categories', () => {
			const filtered = filterByCategory(mockCourses, ['cat-1', 'cat-2']);
			expect(filtered).toHaveLength(3);
			expect(filtered.map((c) => c.id)).toEqual(['course-1', 'course-2', 'course-4']);
		});

		it('should return all courses when category list is empty', () => {
			const filtered = filterByCategory(mockCourses, []);
			expect(filtered).toHaveLength(4);
		});

		it('should return empty array when no courses match category', () => {
			const filtered = filterByCategory(mockCourses, ['cat-999']);
			expect(filtered).toHaveLength(0);
		});

		it('should handle courses with multiple categories', () => {
			const filtered = filterByCategory(mockCourses, ['cat-2']);
			expect(filtered).toHaveLength(2);
			expect(filtered.map((c) => c.id)).toEqual(['course-1', 'course-2']);
		});
	});

	describe('filterByTag', () => {
		it('should filter courses by single tag', () => {
			const filtered = filterByTag(mockCourses, ['tag-1']);
			expect(filtered).toHaveLength(2);
			expect(filtered.map((c) => c.id)).toEqual(['course-1', 'course-3']);
		});

		it('should filter courses by multiple tags', () => {
			const filtered = filterByTag(mockCourses, ['tag-1', 'tag-2']);
			expect(filtered).toHaveLength(4);
		});

		it('should return all courses when tag list is empty', () => {
			const filtered = filterByTag(mockCourses, []);
			expect(filtered).toHaveLength(4);
		});

		it('should return empty array when no courses match tag', () => {
			const filtered = filterByTag(mockCourses, ['tag-999']);
			expect(filtered).toHaveLength(0);
		});

		it('should handle courses with multiple tags', () => {
			const filtered = filterByTag(mockCourses, ['tag-3']);
			expect(filtered).toHaveLength(2);
			expect(filtered.map((c) => c.id)).toEqual(['course-2', 'course-3']);
		});
	});

	describe('searchCourses', () => {
		it('should search courses by name', () => {
			const results = searchCourses(mockCourses, 'javascript');
			expect(results).toHaveLength(1);
			expect(results[0].id).toBe('course-1');
		});

		it('should search courses by slug', () => {
			const results = searchCourses(mockCourses, 'typescript');
			expect(results).toHaveLength(1);
			expect(results[0].id).toBe('course-2');
		});

		it('should search courses by internal name', () => {
			const results = searchCourses(mockCourses, 'react-bp');
			expect(results).toHaveLength(1);
			expect(results[0].id).toBe('course-4');
		});

		it('should be case-insensitive', () => {
			const results = searchCourses(mockCourses, 'PYTHON');
			expect(results).toHaveLength(1);
			expect(results[0].id).toBe('course-3');
		});

		it('should handle partial matches', () => {
			const results = searchCourses(mockCourses, 'script');
			expect(results).toHaveLength(2);
			expect(results.map((c) => c.id)).toEqual(['course-1', 'course-2']);
		});

		it('should return all courses when search term is empty', () => {
			const results = searchCourses(mockCourses, '');
			expect(results).toHaveLength(4);
		});

		it('should return all courses when search term is whitespace', () => {
			const results = searchCourses(mockCourses, '   ');
			expect(results).toHaveLength(4);
		});

		it('should return empty array when no matches found', () => {
			const results = searchCourses(mockCourses, 'nonexistent');
			expect(results).toHaveLength(0);
		});

		it('should trim whitespace from search term', () => {
			const results = searchCourses(mockCourses, '  python  ');
			expect(results).toHaveLength(1);
			expect(results[0].id).toBe('course-3');
		});
	});

	describe('sortCourses', () => {
		it('should sort courses by title ascending', () => {
			const sorted = sortCourses(mockCourses, 'title-asc');
			expect(sorted.map((c) => c.name)).toEqual([
				'Advanced TypeScript',
				'Introduction to JavaScript',
				'Python Fundamentals',
				'React Best Practices'
			]);
		});

		it('should sort courses by title descending', () => {
			const sorted = sortCourses(mockCourses, 'title-desc');
			expect(sorted.map((c) => c.name)).toEqual([
				'React Best Practices',
				'Python Fundamentals',
				'Introduction to JavaScript',
				'Advanced TypeScript'
			]);
		});

		it('should sort courses by most recent', () => {
			const sorted = sortCourses(mockCourses, 'recent');
			expect(sorted.map((c) => c.id)).toEqual(['course-3', 'course-4', 'course-2', 'course-1']);
		});

		it('should sort courses by popular (defaults to recent)', () => {
			const sorted = sortCourses(mockCourses, 'popular');
			expect(sorted.map((c) => c.id)).toEqual(['course-3', 'course-4', 'course-2', 'course-1']);
		});

		it('should not mutate original array', () => {
			const original = [...mockCourses];
			sortCourses(mockCourses, 'title-asc');
			expect(mockCourses).toEqual(original);
		});
	});

	describe('applyAllFilters', () => {
		it('should apply search filter', () => {
			const filters: CatalogFilters = { searchTerm: 'python' };
			const filtered = applyAllFilters(mockCourses, filters);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].id).toBe('course-3');
		});

		it('should apply category filter', () => {
			const filters: CatalogFilters = { categoryIds: ['cat-1'] };
			const filtered = applyAllFilters(mockCourses, filters);
			expect(filtered).toHaveLength(2);
		});

		it('should apply tag filter', () => {
			const filters: CatalogFilters = { tagIds: ['tag-1'] };
			const filtered = applyAllFilters(mockCourses, filters);
			expect(filtered).toHaveLength(2);
		});

		it('should apply multiple filters together', () => {
			const filters: CatalogFilters = {
				searchTerm: 'script',
				categoryIds: ['cat-2']
			};
			const filtered = applyAllFilters(mockCourses, filters);
			expect(filtered).toHaveLength(2);
			expect(filtered.map((c) => c.id)).toEqual(['course-1', 'course-2']);
		});

		it('should apply all filters together', () => {
			const filters: CatalogFilters = {
				searchTerm: 'type',
				categoryIds: ['cat-2'],
				tagIds: ['tag-2']
			};
			const filtered = applyAllFilters(mockCourses, filters);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].id).toBe('course-2');
		});

		it('should return all courses when no filters applied', () => {
			const filters: CatalogFilters = {};
			const filtered = applyAllFilters(mockCourses, filters);
			expect(filtered).toHaveLength(4);
		});

		it('should return empty array when filters match nothing', () => {
			const filters: CatalogFilters = {
				searchTerm: 'nonexistent',
				categoryIds: ['cat-999']
			};
			const filtered = applyAllFilters(mockCourses, filters);
			expect(filtered).toHaveLength(0);
		});

		it('should not mutate original array', () => {
			const original = [...mockCourses];
			const filters: CatalogFilters = { searchTerm: 'python' };
			applyAllFilters(mockCourses, filters);
			expect(mockCourses).toEqual(original);
		});
	});

	describe('buildQueryParams', () => {
		const pagination: PaginationState = {
			page: 1,
			pageSize: 10,
			totalItems: 100,
			totalPages: 10
		};

		it('should build query with pagination and sort', () => {
			const filters: CatalogFilters = {};
			const query = buildQueryParams(filters, pagination, 'title-asc');

			expect(query).toEqual({
				page: 1,
				limit: 10,
				sort: 'title-asc'
			});
		});

		it('should include search term when provided', () => {
			const filters: CatalogFilters = { searchTerm: 'javascript' };
			const query = buildQueryParams(filters, pagination, 'title-asc');

			expect(query.search).toBe('javascript');
		});

		it('should include categories as comma-separated string', () => {
			const filters: CatalogFilters = { categoryIds: ['cat-1', 'cat-2'] };
			const query = buildQueryParams(filters, pagination, 'title-asc');

			expect(query.categories).toBe('cat-1,cat-2');
		});

		it('should include tags as comma-separated string', () => {
			const filters: CatalogFilters = { tagIds: ['tag-1', 'tag-2', 'tag-3'] };
			const query = buildQueryParams(filters, pagination, 'title-asc');

			expect(query.tags).toBe('tag-1,tag-2,tag-3');
		});

		it('should include all parameters when all filters are set', () => {
			const filters: CatalogFilters = {
				searchTerm: 'test',
				categoryIds: ['cat-1'],
				tagIds: ['tag-1']
			};
			const query = buildQueryParams(filters, pagination, 'recent');

			expect(query).toEqual({
				page: 1,
				limit: 10,
				sort: 'recent',
				search: 'test',
				categories: 'cat-1',
				tags: 'tag-1'
			});
		});

		it('should trim search term', () => {
			const filters: CatalogFilters = { searchTerm: '  test  ' };
			const query = buildQueryParams(filters, pagination, 'title-asc');

			expect(query.search).toBe('test');
		});

		it('should omit empty search term', () => {
			const filters: CatalogFilters = { searchTerm: '   ' };
			const query = buildQueryParams(filters, pagination, 'title-asc');

			expect(query.search).toBeUndefined();
		});
	});

	describe('calculatePagination', () => {
		it('should calculate pagination correctly', () => {
			const result = calculatePagination(1, 10, 45);

			expect(result).toEqual({
				page: 1,
				pageSize: 10,
				totalItems: 45,
				totalPages: 5
			});
		});

		it('should handle exact division', () => {
			const result = calculatePagination(2, 10, 100);

			expect(result.totalPages).toBe(10);
		});

		it('should round up total pages', () => {
			const result = calculatePagination(1, 10, 95);

			expect(result.totalPages).toBe(10);
		});

		it('should clamp page to valid range (too high)', () => {
			const result = calculatePagination(20, 10, 45);

			expect(result.page).toBe(5); // Clamped to max page
		});

		it('should clamp page to valid range (too low)', () => {
			const result = calculatePagination(0, 10, 45);

			expect(result.page).toBe(1); // Clamped to min page
		});

		it('should handle zero items', () => {
			const result = calculatePagination(1, 10, 0);

			expect(result).toEqual({
				page: 1,
				pageSize: 10,
				totalItems: 0,
				totalPages: 0
			});
		});
	});

	describe('paginateItems', () => {
		const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		it('should return correct page of items', () => {
			const page1 = paginateItems(items, 1, 3);
			expect(page1).toEqual([1, 2, 3]);

			const page2 = paginateItems(items, 2, 3);
			expect(page2).toEqual([4, 5, 6]);

			const page3 = paginateItems(items, 3, 3);
			expect(page3).toEqual([7, 8, 9]);
		});

		it('should handle last page with fewer items', () => {
			const lastPage = paginateItems(items, 4, 3);
			expect(lastPage).toEqual([10]);
		});

		it('should return empty array for page beyond range', () => {
			const beyondPage = paginateItems(items, 10, 3);
			expect(beyondPage).toEqual([]);
		});

		it('should handle page size larger than total items', () => {
			const allItems = paginateItems(items, 1, 20);
			expect(allItems).toEqual(items);
		});

		it('should handle empty array', () => {
			const emptyPage = paginateItems([], 1, 10);
			expect(emptyPage).toEqual([]);
		});
	});

	describe('hasActiveFilters', () => {
		it('should return true when search term is set', () => {
			const filters: CatalogFilters = { searchTerm: 'test' };
			expect(hasActiveFilters(filters)).toBe(true);
		});

		it('should return true when categories are set', () => {
			const filters: CatalogFilters = { categoryIds: ['cat-1'] };
			expect(hasActiveFilters(filters)).toBe(true);
		});

		it('should return true when tags are set', () => {
			const filters: CatalogFilters = { tagIds: ['tag-1'] };
			expect(hasActiveFilters(filters)).toBe(true);
		});

		it('should return true when enrollment status is not "all"', () => {
			const filters: CatalogFilters = { enrollmentStatus: 'enrolled' };
			expect(hasActiveFilters(filters)).toBe(true);
		});

		it('should return false when all filters are empty or default', () => {
			const filters: CatalogFilters = {
				searchTerm: '',
				categoryIds: [],
				tagIds: [],
				enrollmentStatus: 'all'
			};
			expect(hasActiveFilters(filters)).toBe(false);
		});

		it('should return false for empty filters object', () => {
			const filters: CatalogFilters = {};
			expect(hasActiveFilters(filters)).toBe(false);
		});

		it('should ignore whitespace-only search term', () => {
			const filters: CatalogFilters = { searchTerm: '   ' };
			expect(hasActiveFilters(filters)).toBe(false);
		});
	});

	describe('resetFilters', () => {
		it('should return default filter state', () => {
			const reset = resetFilters();

			expect(reset).toEqual({
				searchTerm: '',
				categoryIds: [],
				tagIds: [],
				enrollmentStatus: 'all'
			});
		});
	});

	describe('countActiveFilters', () => {
		it('should count zero when no filters active', () => {
			const filters: CatalogFilters = {};
			expect(countActiveFilters(filters)).toBe(0);
		});

		it('should count one when only search is active', () => {
			const filters: CatalogFilters = { searchTerm: 'test' };
			expect(countActiveFilters(filters)).toBe(1);
		});

		it('should count one when only categories are active', () => {
			const filters: CatalogFilters = { categoryIds: ['cat-1'] };
			expect(countActiveFilters(filters)).toBe(1);
		});

		it('should count one when only tags are active', () => {
			const filters: CatalogFilters = { tagIds: ['tag-1'] };
			expect(countActiveFilters(filters)).toBe(1);
		});

		it('should count one when only enrollment status is active', () => {
			const filters: CatalogFilters = { enrollmentStatus: 'enrolled' };
			expect(countActiveFilters(filters)).toBe(1);
		});

		it('should count all active filters', () => {
			const filters: CatalogFilters = {
				searchTerm: 'test',
				categoryIds: ['cat-1'],
				tagIds: ['tag-1'],
				enrollmentStatus: 'enrolled'
			};
			expect(countActiveFilters(filters)).toBe(4);
		});

		it('should not count empty arrays or default values', () => {
			const filters: CatalogFilters = {
				searchTerm: '',
				categoryIds: [],
				tagIds: [],
				enrollmentStatus: 'all'
			};
			expect(countActiveFilters(filters)).toBe(0);
		});
	});
});
