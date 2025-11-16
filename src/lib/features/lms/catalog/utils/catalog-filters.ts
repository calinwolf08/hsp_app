import type { Course } from '../../shared/types';
import type { CatalogFilters, SortOption, CatalogQuery, PaginationState } from '../types';

/**
 * Filter courses by category IDs
 */
export const filterByCategory = (courses: Course[], categoryIds: string[]): Course[] => {
	if (!categoryIds || categoryIds.length === 0) {
		return courses;
	}

	return courses.filter((course) => {
		return course.categories.some((categoryId) => categoryIds.includes(categoryId));
	});
};

/**
 * Filter courses by tag IDs
 */
export const filterByTag = (courses: Course[], tagIds: string[]): Course[] => {
	if (!tagIds || tagIds.length === 0) {
		return courses;
	}

	return courses.filter((course) => {
		return course.tags.some((tagId) => tagIds.includes(tagId));
	});
};

/**
 * Search courses by name or description
 * Searches in: name, internal_name, slug
 */
export const searchCourses = (courses: Course[], searchTerm: string): Course[] => {
	if (!searchTerm || searchTerm.trim() === '') {
		return courses;
	}

	const term = searchTerm.toLowerCase().trim();

	return courses.filter((course) => {
		const nameMatch = course.name.toLowerCase().includes(term);
		const internalNameMatch = course.internal_name.toLowerCase().includes(term);
		const slugMatch = course.slug.toLowerCase().includes(term);

		return nameMatch || internalNameMatch || slugMatch;
	});
};

/**
 * Sort courses by specified option
 */
export const sortCourses = (courses: Course[], sortBy: SortOption): Course[] => {
	const sorted = [...courses];

	switch (sortBy) {
		case 'title-asc':
			return sorted.sort((a, b) => a.name.localeCompare(b.name));

		case 'title-desc':
			return sorted.sort((a, b) => b.name.localeCompare(a.name));

		case 'recent':
			return sorted.sort(
				(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);

		case 'popular':
			// For now, sort by recent as we don't have popularity metrics
			// This can be enhanced later with enrollment counts or ratings
			return sorted.sort(
				(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);

		default:
			return sorted;
	}
};

/**
 * Apply all filters to course list
 */
export const applyAllFilters = (courses: Course[], filters: CatalogFilters): Course[] => {
	let filtered = [...courses];

	// Apply search
	if (filters.searchTerm) {
		filtered = searchCourses(filtered, filters.searchTerm);
	}

	// Apply category filter
	if (filters.categoryIds && filters.categoryIds.length > 0) {
		filtered = filterByCategory(filtered, filters.categoryIds);
	}

	// Apply tag filter
	if (filters.tagIds && filters.tagIds.length > 0) {
		filtered = filterByTag(filtered, filters.tagIds);
	}

	return filtered;
};

/**
 * Build query parameters for API call
 */
export const buildQueryParams = (
	filters: CatalogFilters,
	pagination: PaginationState,
	sortBy: SortOption
): CatalogQuery => {
	const query: CatalogQuery = {
		page: pagination.page,
		limit: pagination.pageSize,
		sort: sortBy
	};

	if (filters.searchTerm && filters.searchTerm.trim() !== '') {
		query.search = filters.searchTerm.trim();
	}

	if (filters.categoryIds && filters.categoryIds.length > 0) {
		query.categories = filters.categoryIds.join(',');
	}

	if (filters.tagIds && filters.tagIds.length > 0) {
		query.tags = filters.tagIds.join(',');
	}

	return query;
};

/**
 * Calculate pagination state from total items
 */
export const calculatePagination = (
	currentPage: number,
	pageSize: number,
	totalItems: number
): PaginationState => {
	const totalPages = Math.ceil(totalItems / pageSize);

	return {
		page: Math.max(1, Math.min(currentPage, totalPages || 1)),
		pageSize,
		totalItems,
		totalPages
	};
};

/**
 * Get paginated slice of items
 */
export const paginateItems = <T>(items: T[], page: number, pageSize: number): T[] => {
	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	return items.slice(startIndex, endIndex);
};

/**
 * Check if filters are active (not default/empty)
 */
export const hasActiveFilters = (filters: CatalogFilters): boolean => {
	if (filters.searchTerm && filters.searchTerm.trim() !== '') return true;
	if (filters.categoryIds && filters.categoryIds.length > 0) return true;
	if (filters.tagIds && filters.tagIds.length > 0) return true;
	if (filters.enrollmentStatus && filters.enrollmentStatus !== 'all') return true;
	return false;
};

/**
 * Reset filters to default state
 */
export const resetFilters = (): CatalogFilters => {
	return {
		searchTerm: '',
		categoryIds: [],
		tagIds: [],
		enrollmentStatus: 'all'
	};
};

/**
 * Count active filter types
 */
export const countActiveFilters = (filters: CatalogFilters): number => {
	let count = 0;
	if (filters.searchTerm && filters.searchTerm.trim() !== '') count++;
	if (filters.categoryIds && filters.categoryIds.length > 0) count++;
	if (filters.tagIds && filters.tagIds.length > 0) count++;
	if (filters.enrollmentStatus && filters.enrollmentStatus !== 'all') count++;
	return count;
};
