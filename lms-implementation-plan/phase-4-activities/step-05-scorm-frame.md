# Step 5: SCORM Frame Component

## Objective
Create iframe wrapper for SCORM content.

## Files to Create
- `src/lib/features/lms/activities/components/scorm/ScormFrame.svelte`

## Component Props
- `scormUrl: string` - SCORM package URL
- `onComplete: (data) => void` - Completion callback
- `onError: (error) => void` - Error callback

## Test File
- `src/lib/features/lms/activities/components/scorm/ScormFrame.test.ts` (component rendering, iframe communication)

## Dependencies
- Step 4 (SCORM API)
