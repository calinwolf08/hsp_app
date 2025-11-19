# Phase 4: Activities - UI Components

## Components to Implement

### 1. SCORM Player
**File**: `src/lib/features/lms/activities/components/scorm/ScormPlayer.svelte`
- Iframe for SCORM content
- SCORM API bridge (using scorm-api.ts)
- Loading state
- Error handling
- Completion tracking
- Full-screen support

### 2. Video Player
**File**: `src/lib/features/lms/activities/components/video/VideoPlayer.svelte`
- HTML5 video player or embedded (YouTube, Vimeo)
- Play/pause, seek controls
- Watch time tracking
- Completion at 90% watched
- Playback speed control

### 3. Document Viewer
**File**: `src/lib/features/lms/activities/components/document/DocumentViewer.svelte`
- PDF viewer (iframe or PDF.js)
- Download button
- Page navigation for multi-page docs
- Mark as complete button
- Full-screen support

### 4. Survey Viewer
**File**: `src/lib/features/lms/activities/components/survey/SurveyViewer.svelte`
- Question display
- Answer input (multiple choice, text, etc.)
- Submit button
- Validation
- Completion on submission

### 5. Activity Player Wrapper
**File**: `src/lib/features/lms/activities/components/ActivityPlayer.svelte`
- Routes to correct player based on activity type
- Common controls (fullscreen, etc.)
- Completion handling
- Error boundaries

## Activity Type Routing

```typescript
{#if activity.activityType === 'scorm'}
  <ScormPlayer {config} onComplete={handleComplete} />
{:else if activity.activityType === 'video'}
  <VideoPlayer {config} onComplete={handleComplete} />
{:else if activity.activityType === 'document'}
  <DocumentViewer {config} onComplete={handleComplete} />
{:else if activity.activityType === 'survey'}
  <SurveyViewer {config} onComplete={handleComplete} />
{/if}
```

## Implementation Priority

1. **SCORM Player** (highest priority per requirements)
2. Video Player
3. Document Viewer
4. Survey Viewer
