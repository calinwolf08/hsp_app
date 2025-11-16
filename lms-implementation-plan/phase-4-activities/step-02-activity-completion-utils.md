# Step 2: Activity Completion Utils

## Objective
Implement pure functions for activity completion tracking.

## Files to Create
- `src/lib/features/lms/activities/utils/activity-completion.ts`

## Functions to Implement
- `shouldMarkComplete(activityType, completionData)` - Determine if complete
- `validateCompletion(activityType, data)` - Validate completion data
- `getCompletionTimestamp()` - Get current timestamp
- `buildCompletionPayload(userId, activityId, data)` - Build API payload

## Test File
- `src/lib/features/lms/activities/utils/activity-completion.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (activities types)
- Phase 1 (shared types)
