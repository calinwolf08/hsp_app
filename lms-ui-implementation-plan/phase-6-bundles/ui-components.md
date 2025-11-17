# Phase 6: Bundles - UI Components

## Components to Implement

### 1. Bundles List Page
**File**: `src/routes/bundles/+page.svelte`
- Grid of bundle cards
- Module and course counts
- Progress indicators
- Enroll/Continue buttons

### 2. Bundle Card
**File**: `src/lib/features/lms/bundles/components/BundleCard.svelte`
- Bundle name and description
- Module count, course count
- Progress bar
- Enroll/Continue button

### 3. Bundle Detail Page
**File**: `src/routes/bundles/[bundleId]/+page.svelte`
- Bundle overview
- Module list with courses
- Overall progress
- Start/Continue button

### 4. Module List
**File**: `src/lib/features/lms/bundles/components/ModuleList.svelte`
- Expandable module cards
- Course list within each module
- Module progress indicator
- Click to expand/collapse

### 5. Module Card
**File**: `src/lib/features/lms/bundles/components/ModuleCard.svelte`
- Module name
- Course count
- Progress bar
- Expand/collapse control
- Course list (when expanded)

### 6. Bundle Progress
**File**: `src/lib/features/lms/bundles/components/BundleProgress.svelte`
- Overall bundle completion
- Per-module completion
- Visual progress indicators

## Layout Structure

```
Bundle Detail Page
├─ Bundle Header
│  ├─ Name, description
│  ├─ Overall progress bar
│  └─ Start/Continue button
├─ Module List
│  ├─ Module 1 (expanded)
│  │  ├─ Progress: 2/3 courses
│  │  └─ Course 1, Course 2, Course 3
│  └─ Module 2 (collapsed)
│     └─ Progress: 0/2 courses
└─ Bundle Stats
   └─ X modules, Y courses
```

## Key Features

- Hierarchical module organization
- Progress at bundle and module levels
- Expandable/collapsible modules
- Quick access to any course in bundle
