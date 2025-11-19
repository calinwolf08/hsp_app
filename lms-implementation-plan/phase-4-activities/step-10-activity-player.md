# Step 10: Activity Player Component

## Objective
Create main activity player that routes to correct viewer.

## Files to Create
- `src/lib/features/lms/activities/components/ActivityPlayer.svelte`

## Component Props
- `activity: Activity` - Activity object
- `userId: string` - Current user ID
- `onComplete: () => void` - Completion callback

## Component Logic
- Route to correct player based on activity.activityType
- Handle loading states
- Handle errors

## Test File
- `src/lib/features/lms/activities/components/ActivityPlayer.test.ts` (routing logic, component integration)

## Dependencies
- Step 6, 7, 8, 9 (all activity viewers)
