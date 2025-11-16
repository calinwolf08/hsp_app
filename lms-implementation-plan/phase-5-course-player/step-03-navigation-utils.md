# Step 3: Navigation Utils

## Objective
Implement pure functions for course navigation logic.

## Files to Create
- `src/lib/features/lms/course-player/utils/navigation.ts`

## Functions to Implement
- `getNextActivity(course, currentActivityId)` - Get next activity
- `getPrevActivity(course, currentActivityId)` - Get previous activity
- `buildNavigationTree(course)` - Build nav tree structure
- `findActivityPath(course, activityId)` - Get breadcrumb path
- `isFirstActivity(course, activityId)` - Check if first
- `isLastActivity(course, activityId)` - Check if last

## Test File
- `src/lib/features/lms/course-player/utils/navigation.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (course player types)
- Phase 1 (shared types)
