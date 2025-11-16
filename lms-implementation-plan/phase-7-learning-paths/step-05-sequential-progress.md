# Step 5: Sequential Progress Component

## Objective
Display sequential learning progress indicator.

## Files to Create
- `src/lib/features/lms/learning-paths/components/SequentialProgress.svelte`

## Component Props
- `learningPath: LearningPathWithProgress` - Path with progress
- `currentCourseId?: string` - Active course
- `nextAvailableCourseId?: string` - Next unlocked course

## Test File
- `src/lib/features/lms/learning-paths/components/SequentialProgress.test.ts` (component rendering, progress display)

## Dependencies
- Step 1 (learning paths types)
- Step 4 (learning paths copy)
- Phase 2 (UI components)
