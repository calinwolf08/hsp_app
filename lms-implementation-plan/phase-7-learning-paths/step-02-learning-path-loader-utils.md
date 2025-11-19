# Step 2: Learning Path Loader Utils

## Objective
Implement pure functions for loading learning paths with progress.

## Files to Create
- `src/lib/features/lms/learning-paths/utils/learning-path-loader.ts`

## Functions to Implement
- `extractAllCourseIds(learningPath)` - Get all course IDs
- `attachProgressToPath(learningPath, courseProgress)` - Merge progress
- `calculatePathProgress(learningPath, courseProgress)` - Overall progress
- `buildPathWithProgress(learningPath, progress)` - Build final object

## Test File
- `src/lib/features/lms/learning-paths/utils/learning-path-loader.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (learning paths types)
- Phase 1 (shared utils)
