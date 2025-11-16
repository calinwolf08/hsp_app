# Step 2: Course Loader Utils

## Objective
Implement pure functions for loading course with progress.

## Files to Create
- `src/lib/features/lms/course-player/utils/course-loader.ts`

## Functions to Implement
- `attachProgressToCourse(course, progressRecords)` - Merge progress
- `getActivityIds(course)` - Extract all activity IDs
- `getSectionIds(course)` - Extract all section IDs
- `organizeProgress(activityProgress)` - Group by section
- `buildCourseWithProgress(course, progress)` - Build final object

## Test File
- `src/lib/features/lms/course-player/utils/course-loader.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (course player types)
- Phase 1 (shared types)
