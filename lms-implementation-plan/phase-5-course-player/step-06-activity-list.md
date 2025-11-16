# Step 6: Activity List Component

## Objective
Display list of activities within a section.

## Files to Create
- `src/lib/features/lms/course-player/components/ActivityList.svelte`

## Component Props
- `activities: Activity[]` - Activities with progress
- `currentActivityId?: string` - Active activity
- `onActivityClick: (activityId) => void` - Click handler

## Test File
- `src/lib/features/lms/course-player/components/ActivityList.test.ts` (component rendering, click handling)

## Dependencies
- Step 1 (course player types)
- Phase 2 (UI components)
