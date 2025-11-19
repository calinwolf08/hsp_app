# Step 8: Course Navigation Component

## Objective
Create course sidebar navigation.

## Files to Create
- `src/lib/features/lms/course-player/components/CourseNavigation.svelte`

## Component Props
- `course: CourseWithProgress` - Course with progress
- `currentActivityId?: string` - Active activity
- `onNavigate: (activityId) => void` - Navigation handler

## Test File
- `src/lib/features/lms/course-player/components/CourseNavigation.test.ts` (component integration)

## Dependencies
- Step 7 (SectionList)
- Step 2 (course loader utils)
