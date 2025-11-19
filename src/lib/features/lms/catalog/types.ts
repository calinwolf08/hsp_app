import type { Course, CourseEnrollment } from '../shared/types';

/**
 * Filter options for catalog
 */
export type CatalogFilters = {
	searchTerm?: string;
	categoryIds?: string[];
	tagIds?: string[];
	enrollmentStatus?: 'all' | 'enrolled' | 'not-enrolled';
};

/**
 * Sort options for catalog
 */
export type SortOption = 'title-asc' | 'title-desc' | 'recent' | 'popular';

/**
 * Course with enrollment status for catalog display
 */
export type CatalogCourse = {
	course: Course;
	isEnrolled: boolean;
	enrollmentId?: string;
	enrolledAt?: string;
};

/**
 * Pagination state
 */
export type PaginationState = {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
};

/**
 * Catalog query parameters
 */
export type CatalogQuery = {
	search?: string;
	categories?: string;
	tags?: string;
	sort?: SortOption;
	page?: number;
	limit?: number;
};

/**
 * Catalog state
 */
export type CatalogState = {
	courses: CatalogCourse[];
	filters: CatalogFilters;
	sortBy: SortOption;
	pagination: PaginationState;
	isLoading: boolean;
};
