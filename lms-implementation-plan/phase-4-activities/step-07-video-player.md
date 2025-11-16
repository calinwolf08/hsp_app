# Step 7: Video Player Component

## Objective
Create video player for video activities.

## Files to Create
- `src/lib/features/lms/activities/components/video/VideoPlayer.svelte`
- `src/lib/features/lms/activities/components/video/video-controls.ts`

## Component Props
- `activity: Activity` - Activity with video URL
- `userId: string` - Current user ID
- `onComplete: () => void` - Completion callback

## Functions to Implement
- `trackWatchProgress(currentTime, duration)` - Track viewing
- `shouldMarkComplete(watchedPercentage)` - Completion logic (e.g., 90% watched)

## Test File
- `src/lib/features/lms/activities/components/video/VideoPlayer.test.ts` (component rendering, completion tracking)
- `src/lib/features/lms/activities/components/video/video-controls.test.ts` (pure function tests)

## Dependencies
- Step 1 (activities types)
- Step 2 (completion utils)
