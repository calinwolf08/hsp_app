# Step 2: Dashboard Data Utils

## Objective
Implement pure functions for dashboard data aggregation.

## Files to Create
- `src/lib/features/lms/dashboard/utils/dashboard-data.ts`

## Functions to Implement
- `combineCourseData(enrollments, progress, courses)` - Merge data
- `calculateDashboardStats(courses)` - Calculate stats
- `sortCourses(courses, sortBy)` - Sort course list
- `filterCourses(courses, filters)` - Filter course list
- `getContinueLearning(courses)` - Get in-progress courses
- `getRecentCourses(courses, limit)` - Get recently accessed

## Test File
- `src/lib/features/lms/dashboard/utils/dashboard-data.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (dashboard types)
- Phase 1 (shared utils)
