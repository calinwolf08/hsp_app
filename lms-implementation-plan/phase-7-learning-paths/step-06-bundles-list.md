# Step 6: Bundles List Component

## Objective
Display list of bundles within learning path.

## Files to Create
- `src/lib/features/lms/learning-paths/components/BundlesList.svelte`

## Component Props
- `bundles: Bundle[]` - Bundles with progress
- `locked: boolean[]` - Locked state per bundle
- `onBundleClick: (bundleId) => void` - Click handler

## Test File
- `src/lib/features/lms/learning-paths/components/BundlesList.test.ts` (component rendering, locked states)

## Dependencies
- Step 4 (learning paths copy)
- Phase 2 (UI components)
