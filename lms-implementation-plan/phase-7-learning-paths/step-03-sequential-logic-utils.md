# Step 3: Sequential Logic Utils

## Objective
Implement pure functions for sequential access logic.

## Files to Create
- `src/lib/features/lms/learning-paths/utils/sequential-logic.ts`

## Functions to Implement
- `getSequentialState(learningPath, progress)` - Calculate sequential state
- `getNextAvailableCourse(learningPath, progress)` - Find next course
- `markCoursesAccessibility(learningPath, progress)` - Mark locked/unlocked
- `isAccessibleInSequence(courseId, learningPath, progress)` - Check access

## Test File
- `src/lib/features/lms/learning-paths/utils/sequential-logic.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (learning paths types)
- Phase 1 (sequential-access utils)
