# Step 8: Course Grid Component

## Objective
Display grid of course cards.

## Files to Create
- `src/lib/features/lms/catalog/components/CourseGrid.svelte`

## Component Props
- `courses: CatalogCourse[]` - Courses with enrollment status
- `onEnroll: (courseId) => void` - Enroll handler

## Test File
- `src/lib/features/lms/catalog/components/CourseGrid.test.ts` (component rendering, grid layout)

## Dependencies
- Phase 2 (CourseCard)
- Step 7 (EnrollButton)
