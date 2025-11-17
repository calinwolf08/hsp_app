# Phase 5: Learning Paths - UI Components

## Components to Implement

### 1. Learning Paths List Page
**File**: `src/routes/learning-paths/+page.svelte`
- Grid of learning path cards
- Progress indicators
- Sequential/Automatic badges
- Enroll/Continue buttons

### 2. Learning Path Card
**File**: `src/lib/features/lms/learning-paths/components/PathCard.svelte`
- Path name and description
- Course count
- Progress bar
- Access type badge
- Enroll/Continue/Resume button

### 3. Learning Path Detail Page
**File**: `src/routes/learning-paths/[pathId]/+page.svelte`
- Path overview
- Bundle/Module/Course hierarchy
- Sequential progress visualization
- Lock indicators for sequential paths
- Start/Continue button

### 4. Sequential Progress Indicator
**File**: `src/lib/features/lms/learning-paths/components/SequentialProgress.svelte`
- Linear progress visualization
- Current position indicator
- Locked/unlocked course markers
- Next course highlight

### 5. Path Navigation Tree
**File**: `src/lib/features/lms/learning-paths/components/PathNavigationTree.svelte`
- Hierarchical view: Bundles → Modules → Courses
- Expand/collapse
- Completion checkmarks
- Lock icons for sequential
- Click to navigate (if unlocked)

## Key Features

- Clear sequential vs automatic indication
- Visual lock indicators for sequential paths
- Progress across entire path
- Next recommended course
- Locked course tooltips explaining requirements
