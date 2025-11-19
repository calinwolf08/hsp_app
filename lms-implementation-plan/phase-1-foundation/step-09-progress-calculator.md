# Step 9: Progress Calculator Utils

## Objective
Implement pure functions for calculating progress percentages.

## Files to Create
- `src/lib/features/lms/shared/utils/progress-calculator.ts`

## Functions to Implement
- `calculateCompletionPercentage(total, completed)` - Calculate percentage
- `calculateCourseProgress(sections, sectionProgress)` - Course completion %
- `calculateBundleProgress(courses, courseProgress)` - Bundle completion %
- `isItemCompleted(progressStatus)` - Check if status is completed
- `getProgressStats(items, progressRecords)` - Get stats object
- `aggregateProgress(progressRecords)` - Aggregate multiple progress

## Test File
- `src/lib/features/lms/shared/utils/progress-calculator.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (types)
