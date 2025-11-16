# Step 6: Course Filters Component

## Objective
Create filter panel for categories and tags.

## Files to Create
- `src/lib/features/lms/catalog/components/CourseFilters.svelte`

## Component Props
- `filters: CatalogFilters` - Active filters
- `categories: Category[]` - Available categories
- `tags: Tag[]` - Available tags
- `onFilterChange: (filters) => void` - Filter change handler

## Test File
- `src/lib/features/lms/catalog/components/CourseFilters.test.ts` (component rendering, filter selection)

## Dependencies
- Step 1 (catalog types)
- Step 4 (catalog copy)
