# Step 6: Enrolled Courses List Component

## Objective
Display list of user's enrolled courses with filtering.

## Files to Create
- `src/lib/features/lms/dashboard/components/EnrolledCoursesList.svelte`

## Component Props
- `courses: DashboardCourse[]` - Course list
- `filters: FilterOptions` - Active filters
- `onFilterChange: (filters) => void` - Filter change handler

## Test File
- `src/lib/features/lms/dashboard/components/EnrolledCoursesList.test.ts` (component rendering, filtering)

## Dependencies
- Step 1 (dashboard types)
- Step 3 (dashboard copy)
- Phase 2 (UI components)
