# Step 10: Sequential Access Utils

## Objective
Implement pure functions for sequential learning path logic.

## Files to Create
- `src/lib/features/lms/shared/utils/sequential-access.ts`

## Functions to Implement
- `getNextAccessibleCourse(learningPath, progressRecords)` - Find next course
- `isSequentialMode(learningPath)` - Check if sequential
- `canAccessInSequence(courseId, learningPath, progressRecords)` - Check access
- `getLockedCourses(learningPath, progressRecords)` - Get locked courses
- `getUnlockedCourses(learningPath, progressRecords)` - Get unlocked courses

## Test File
- `src/lib/features/lms/shared/utils/sequential-access.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (types)
- Step 9 (progress calculator)
