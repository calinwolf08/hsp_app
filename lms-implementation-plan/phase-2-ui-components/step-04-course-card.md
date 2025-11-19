# Step 4: Course Card Component

## Objective
Create reusable course card for displaying course info.

## Files to Create
- `src/lib/features/lms/ui/CourseCard.svelte`

## Component Props
- `course: Course` - Course object
- `progress?: number` - Optional progress percentage
- `status?: ProgressStatus` - Optional status
- `href: string` - Link to course
- `showEnrollButton: boolean` - Show enrollment action

## Test File
- `src/lib/features/lms/ui/CourseCard.test.ts` (component rendering, link generation)

## Dependencies
- Phase 1 complete (types)
- Step 1, 3 (ProgressBar, StatusBadge)
