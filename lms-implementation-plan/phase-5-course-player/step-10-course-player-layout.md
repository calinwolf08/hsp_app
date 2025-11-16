# Step 10: Course Player Layout Component

## Objective
Main course player layout combining navigation and content.

## Files to Create
- `src/lib/features/lms/course-player/components/CoursePlayerLayout.svelte`

## Component Props
- `course: CourseWithProgress` - Course with progress
- `currentActivityId: string` - Active activity
- `userId: string` - User ID

## Component State
- Manages navigation state
- Handles activity completion
- Updates progress

## Test File
- `src/lib/features/lms/course-player/components/CoursePlayerLayout.test.ts` (component integration)

## Dependencies
- Step 8 (CourseNavigation)
- Step 9 (ActivityContainer)
- Step 4 (completion handler)
