# Phase 3: Course Player - UI Components

## Components to Implement

### 1. Course Player Layout
**File**: `src/routes/courses/[courseId]/+layout.svelte`
- Fixed sidebar with navigation tree
- Main content area for activities
- Top bar with progress and navigation buttons
- Responsive: sidebar collapses to drawer on mobile

### 2. Course Navigation Sidebar
**File**: `src/lib/features/lms/course-player/components/CourseNavigation.svelte`
- Hierarchical tree: sections → activities
- Current activity highlighted
- Completed items with checkmarks
- Locked items with lock icon (sequential mode)
- Collapsible sections
- Progress bar for overall course

### 3. Activity Container
**File**: `src/lib/features/lms/course-player/components/ActivityContainer.svelte`
- Activity player wrapper
- Activity-specific player component (SCORM, video, etc.)
- Completion tracking
- Next/Previous navigation buttons
- Breadcrumb navigation

### 4. Section List
**File**: `src/lib/features/lms/course-player/components/SectionList.svelte`
- List of sections with expand/collapse
- Activity list within each section
- Progress indicators per section
- Click to navigate to activity

### 5. Navigation Controls
**File**: `src/lib/features/lms/course-player/components/NavigationControls.svelte`
- Previous/Next buttons
- Back to course overview
- Progress indicator (Activity X of Y)
- Mark complete button (if manual completion)

### 6. Course Progress Bar
**File**: `src/lib/features/lms/course-player/components/CourseProgressBar.svelte`
- Visual progress indicator
- Percentage and fraction (5/12 activities)
- Completion animation

## Layout Structure

```
┌──────────┬──────────────────────────────────────┐
│  Sidebar │ Course Player Top Bar                │
│          │ [◀ Back] Progress: 60% [Next ▶]     │
│ Nav Tree ├──────────────────────────────────────┤
│          │                                       │
│ §Section1│ Activity Player Area                 │
│  √Act 1  │                                       │
│  ▶Act 2  │ [Activity Component]                 │
│  🔒Act 3 │                                       │
│          │                                       │
│ §Section2│                                       │
│  🔒Act 4 │                                       │
│          │                                       │
│          ├──────────────────────────────────────┤
│ Progress │ Navigation Controls                  │
│ [====60%]│ [◀ Previous] [Mark Complete] [Next ▶]│
└──────────┴──────────────────────────────────────┘
```

## Key Features

- Real-time progress updates
- Keyboard shortcuts (←/→ for navigation)
- Auto-save progress on activity completion
- Locked content display for sequential courses
- Breadcrumb navigation
- Completion celebration modal
