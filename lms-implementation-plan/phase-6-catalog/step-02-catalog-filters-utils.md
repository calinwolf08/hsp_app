# Step 2: Catalog Filters Utils

## Objective
Implement pure functions for filtering and searching courses.

## Files to Create
- `src/lib/features/lms/catalog/utils/catalog-filters.ts`

## Functions to Implement
- `filterByCategory(courses, categoryIds)` - Filter by categories
- `filterByTag(courses, tagIds)` - Filter by tags
- `searchCourses(courses, searchTerm)` - Search by name/description
- `sortCourses(courses, sortBy)` - Sort course list
- `applyAllFilters(courses, filters)` - Apply all filters
- `buildQueryParams(filters, pagination)` - Build API query string

## Test File
- `src/lib/features/lms/catalog/utils/catalog-filters.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (catalog types)
- Phase 1 (shared types)
