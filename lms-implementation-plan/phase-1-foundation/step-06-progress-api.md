# Step 6: Progress API

## Objective
Implement API functions for progress collections.

## Files to Create
- `src/lib/features/lms/shared/api/progress-api.ts`

## Functions to Implement
- `getBundleProgress(userId, bundleId)` - Get bundle progress
- `getCourseProgress(userId, courseId)` - Get course progress
- `getSectionProgress(userId, sectionId)` - Get section progress
- `getActivityProgress(userId, activityId)` - Get activity progress
- `getMultipleProgress(userId, ids, type)` - Batch fetch progress
- `updateActivityProgress(userId, activityId, status)` - Update activity
- `updateSectionProgress(userId, sectionId, status)` - Update section
- `updateCourseProgress(userId, courseId, status)` - Update course

## Test File
- `src/lib/features/lms/shared/api/progress-api.test.ts` (mocked API responses)

## Dependencies
- Step 3 (API client)
