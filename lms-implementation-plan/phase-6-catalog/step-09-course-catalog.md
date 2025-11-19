# Step 9: Course Catalog Component

## Objective
Main catalog layout combining search, filters, and grid.

## Files to Create
- `src/lib/features/lms/catalog/components/CourseCatalog.svelte`

## Component Props
- `courses: Course[]` - All courses
- `enrollments: CourseEnrollment[]` - User's enrollments
- `categories: Category[]` - Available categories
- `tags: Tag[]` - Available tags

## Component State
- Manages filter state
- Handles search
- Handles enrollment actions

## Test File
- `src/lib/features/lms/catalog/components/CourseCatalog.test.ts` (component integration, filtering, search)

## Dependencies
- Step 5, 6, 8 (SearchBar, CourseFilters, CourseGrid)
- Step 2, 3 (catalog utils)
