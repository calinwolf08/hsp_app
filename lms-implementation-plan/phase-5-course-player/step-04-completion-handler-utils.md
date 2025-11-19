# Step 4: Completion Handler Utils

## Objective
Implement pure functions for handling activity completion cascade.

## Files to Create
- `src/lib/features/lms/course-player/utils/completion-handler.ts`

## Functions to Implement
- `checkSectionComplete(section, activityProgress)` - Check if section done
- `checkCourseComplete(course, sectionProgress)` - Check if course done
- `buildProgressUpdateChain(activityId, sectionId, courseId)` - Build update sequence
- `shouldUpdateSectionProgress(sectionId, activities, progress)` - Check if should update
- `shouldUpdateCourseProgress(courseId, sections, progress)` - Check if should update

## Test File
- `src/lib/features/lms/course-player/utils/completion-handler.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (course player types)
- Phase 1 (shared utils)
