# Phase 1: Dashboard - UI Components

## Overview
Dashboard page components for displaying enrolled courses and progress.

## Components to Implement

### 1. Dashboard Page
**File**: `src/routes/dashboard/+page.svelte`

**Purpose**: Main dashboard page

**Features**:
- Display enrolled courses in card grid
- Sort courses by recent, title, progress
- Filter by status (all, in-progress, completed, not-started)
- Show overall stats
- Empty state when no enrollments

**Props**: None (uses page data from +page.server.ts)

**State**:
```typescript
let sortBy = $state<SortOption>('recent');
let statusFilter = $state<StatusFilter>('all');
```

**Dependencies**:
- DashboardCourseCard component
- DashboardHeader component
- DashboardStats component
- EmptyState component (already exists)

---

### 2. Dashboard Course Card
**File**: `src/lib/features/lms/dashboard/components/DashboardCourseCard.svelte`

**Purpose**: Display single course with progress

**Props**:
```typescript
interface Props {
  course: Course;
  enrollment: CourseEnrollment;
  progress: CourseProgress | null;
  completionPercentage: number;
  status: ProgressStatus;
}
```

**Features**:
- Course thumbnail/image
- Course title and description
- Progress bar with percentage
- Status badge
- "Continue" or "Start" button
- Last accessed date

**Click Actions**:
- Card click → Navigate to course player
- Button click → Navigate to course player (or first activity)

---

### 3. Dashboard Header
**File**: `src/lib/features/lms/dashboard/components/DashboardHeader.svelte`

**Purpose**: Page header with title and controls

**Props**:
```typescript
interface Props {
  sortBy: SortOption;
  statusFilter: StatusFilter;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (status: StatusFilter) => void;
}
```

**Features**:
- Page title
- Sort dropdown (Recent, Title A-Z, Progress)
- Status filter pills/tabs
- Course count

---

### 4. Dashboard Stats
**File**: `src/lib/features/lms/dashboard/components/DashboardStats.svelte`

**Purpose**: Display enrollment statistics

**Props**:
```typescript
interface Props {
  totalEnrolled: number;
  inProgress: number;
  completed: number;
  notStarted: number;
}
```

**Features**:
- Stat cards for each metric
- Visual indicators (icons, colors)
- Responsive grid layout

---

### 5. Dashboard Empty State
**File**: `src/lib/features/lms/dashboard/components/DashboardEmptyState.svelte`

**Purpose**: Show when user has no enrollments

**Features**:
- Friendly message
- CTA button to browse catalog
- Illustration or icon

---

## Layout Structure

```
┌─────────────────────────────────────────┐
│ Dashboard Header                         │
│ - Title, Sort, Filter                   │
├─────────────────────────────────────────┤
│ Dashboard Stats                          │
│ - Total | In Progress | Completed       │
├─────────────────────────────────────────┤
│ Course Grid                              │
│ ┌──────┐ ┌──────┐ ┌──────┐             │
│ │ Card │ │ Card │ │ Card │             │
│ └──────┘ └──────┘ └──────┘             │
│ ┌──────┐ ┌──────┐                      │
│ │ Card │ │ Card │                      │
│ └──────┘ └──────┘                      │
└─────────────────────────────────────────┘
```

## Implementation Order

1. Create DashboardCourseCard component (most reusable)
2. Create DashboardStats component
3. Create DashboardHeader component
4. Create DashboardEmptyState component
5. Update +page.svelte to use components
6. Add sorting and filtering logic
7. Style with Tailwind CSS 4
8. Add loading states
9. Add error states

## Styling Guidelines

- Use existing UI color palette (blue, light-orange)
- Use Montserrat for headings, Avenir Light for body
- Use `rounded-xl` for cards
- Use existing Button component with `primary` variant
- Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop

## Copy

Use `dashboardCopy` from `src/lib/features/lms/dashboard/dashboard-copy.ts`

## Accessibility

- Semantic HTML (headings, landmarks)
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader announcements for sort/filter changes
