# Step 8: Learning Path View Component

## Objective
Main learning path detail view.

## Files to Create
- `src/lib/features/lms/learning-paths/components/LearningPathView.svelte`

## Component Props
- `learningPath: LearningPathWithProgress` - Path with progress
- `userId: string` - Current user ID

## Component State
- Manages sequential state
- Handles bundle navigation

## Test File
- `src/lib/features/lms/learning-paths/components/LearningPathView.test.ts` (component integration)

## Dependencies
- Step 5, 6 (SequentialProgress, BundlesList)
- Step 2, 3 (learning path utils)
