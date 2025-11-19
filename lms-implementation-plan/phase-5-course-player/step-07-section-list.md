# Step 7: Section List Component

## Objective
Display list of sections with expandable activities.

## Files to Create
- `src/lib/features/lms/course-player/components/SectionList.svelte`

## Component Props
- `sections: Section[]` - Sections with activities and progress
- `currentSectionId?: string` - Active section
- `currentActivityId?: string` - Active activity
- `onActivityClick: (activityId) => void` - Activity click handler

## Test File
- `src/lib/features/lms/course-player/components/SectionList.test.ts` (component rendering, expansion)

## Dependencies
- Step 6 (ActivityList)
- Phase 2 (UI components)
