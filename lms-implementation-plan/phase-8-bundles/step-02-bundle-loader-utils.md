# Step 2: Bundle Loader Utils

## Objective
Implement pure functions for loading bundles with progress.

## Files to Create
- `src/lib/features/lms/bundles/utils/bundle-loader.ts`

## Functions to Implement
- `extractCourseIds(bundle)` - Get all course IDs from modules
- `attachProgressToBundle(bundle, courseProgress)` - Merge progress
- `calculateBundleProgress(bundle, courseProgress)` - Overall progress
- `buildBundleWithProgress(bundle, progress)` - Build final object

## Test File
- `src/lib/features/lms/bundles/utils/bundle-loader.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (bundles types)
- Phase 1 (shared utils)
