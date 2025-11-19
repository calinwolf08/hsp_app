# Step 6: SCORM Player Component

## Objective
Create SCORM player with controls and state management.

## Files to Create
- `src/lib/features/lms/activities/components/scorm/ScormPlayer.svelte`

## Component Props
- `activity: Activity` - Activity object with SCORM file
- `userId: string` - Current user ID
- `onComplete: () => void` - Completion callback

## Test File
- `src/lib/features/lms/activities/components/scorm/ScormPlayer.test.ts` (component integration)

## Dependencies
- Step 5 (ScormFrame)
- Step 2 (completion utils)
