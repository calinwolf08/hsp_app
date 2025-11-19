# Step 8: Document Viewer Component

## Objective
Create document viewer for document activities.

## Files to Create
- `src/lib/features/lms/activities/components/document/DocumentViewer.svelte`
- `src/lib/features/lms/activities/components/document/document-utils.ts`

## Component Props
- `activity: Activity` - Activity with document URL
- `userId: string` - Current user ID
- `onComplete: () => void` - Completion callback

## Functions to Implement
- `getDocumentType(url)` - Determine document type (PDF, etc.)
- `trackReadProgress()` - Track reading time/scrolling
- `shouldMarkComplete(readTime)` - Completion logic

## Test File
- `src/lib/features/lms/activities/components/document/DocumentViewer.test.ts` (component rendering)
- `src/lib/features/lms/activities/components/document/document-utils.test.ts` (pure function tests)

## Dependencies
- Step 1 (activities types)
- Step 2 (completion utils)
