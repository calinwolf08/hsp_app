# Step 9: Activity Container Component

## Objective
Container for activity player with navigation controls.

## Files to Create
- `src/lib/features/lms/course-player/components/ActivityContainer.svelte`

## Component Props
- `activity: Activity` - Current activity
- `userId: string` - User ID
- `navigation: { hasNext, hasPrev, next, prev }` - Navigation state
- `onComplete: () => void` - Completion handler
- `onNext: () => void` - Next activity handler
- `onPrev: () => void` - Previous activity handler

## Test File
- `src/lib/features/lms/course-player/components/ActivityContainer.test.ts` (component rendering, navigation)

## Dependencies
- Phase 4 (ActivityPlayer)
- Step 3 (navigation utils)
