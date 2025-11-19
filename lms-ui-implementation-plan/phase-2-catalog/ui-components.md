# Phase 2: Catalog - UI Components

## Overview
Course catalog browsing interface with search, filters, and enrollment.

## Components to Implement

### 1. Catalog Page
**File**: `src/routes/catalog/+page.svelte`

**Purpose**: Main catalog browsing page

**Features**:
- Search bar
- Category and tag filters
- Sort dropdown
- Course grid with pagination
- Enrollment status filter
- Loading and error states

**State**:
```typescript
let searchTerm = $state('');
let selectedCategories = $state<string[]>([]);
let selectedTags = $state<string[]>([]);
let sortBy = $state<SortOption>('title-asc');
let enrollmentFilter = $state<'all' | 'enrolled' | 'not-enrolled'>('all');
let currentPage = $state(1);
```

**Layout**:
- Sidebar: Filters
- Main: Search, sort, course grid, pagination

---

### 2. Search Bar Component
**File**: `src/lib/features/lms/catalog/components/SearchBar.svelte`

**Purpose**: Search input with live search

**Props**:
```typescript
interface Props {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}
```

**Features**:
- Debounced search (300ms)
- Clear button when has value
- Search icon
- Loading indicator during search

---

### 3. Filter Panel Component
**File**: `src/lib/features/lms/catalog/components/FilterPanel.svelte`

**Purpose**: Sidebar with all filters

**Props**:
```typescript
interface Props {
  categories: Category[];
  tags: Tag[];
  selectedCategories: string[];
  selectedTags: string[];
  enrollmentStatus: 'all' | 'enrolled' | 'not-enrolled';
  onCategoriesChange: (ids: string[]) => void;
  onTagsChange: (ids: string[]) => void;
  onEnrollmentChange: (status: string) => void;
  onClearAll: () => void;
}
```

**Features**:
- Collapsible sections (Categories, Tags, Enrollment)
- Checkbox groups
- Active filter count badge
- Clear all button

---

### 4. Course Card Component
**File**: `src/lib/features/lms/catalog/components/CatalogCourseCard.svelte`

**Purpose**: Display single course in catalog

**Props**:
```typescript
interface Props {
  course: Course;
  isEnrolled: boolean;
  enrollmentId?: string;
  onEnroll?: (courseId: string) => Promise<void>;
  onUnenroll?: (courseId: string) => Promise<void>;
}
```

**Features**:
- Course thumbnail/image
- Course title and description (truncated)
- Category badges
- Enroll/Enrolled/Continue button
- View details link
- Hover effects

**Button States**:
- Not enrolled: "Enroll" button (primary)
- Enrolled: "Enrolled" badge + "Continue" button
- Loading: Spinner during enrollment action

---

### 5. Course Grid Component
**File**: `src/lib/features/lms/catalog/components/CourseGrid.svelte`

**Purpose**: Responsive grid of course cards

**Props**:
```typescript
interface Props {
  courses: CatalogCourse[];
  onEnroll: (courseId: string) => Promise<void>;
  onUnenroll: (courseId: string) => Promise<void>;
}
```

**Features**:
- Responsive grid (1-2-3 cols)
- Empty state when no courses
- Skeleton loaders during loading

---

### 6. Pagination Component
**File**: `src/lib/features/lms/catalog/components/Pagination.svelte`

**Purpose**: Page navigation controls

**Props**:
```typescript
interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}
```

**Features**:
- Previous/Next buttons
- Page numbers (with ellipsis for many pages)
- Current page highlight
- Showing "X-Y of Z courses" text
- Disable buttons at boundaries

---

### 7. Sort Controls Component
**File**: `src/lib/features/lms/catalog/components/SortControls.svelte`

**Purpose**: Dropdown for sorting options

**Props**:
```typescript
interface Props {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
}
```

**Features**:
- Dropdown with sort options
- Current selection indicator
- Icons for sort direction

---

### 8. Catalog Header Component
**File**: `src/lib/features/lms/catalog/components/CatalogHeader.svelte`

**Purpose**: Page header with title and count

**Props**:
```typescript
interface Props {
  totalCourses: number;
  activeFilterCount: number;
}
```

**Features**:
- Page title
- Course count
- Active filter count badge

---

### 9. Enrollment Modal Component
**File**: `src/lib/features/lms/catalog/components/EnrollmentModal.svelte`

**Purpose**: Confirmation modal for enrollment/unenrollment

**Props**:
```typescript
interface Props {
  isOpen: boolean;
  course: Course | null;
  action: 'enroll' | 'unenroll';
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}
```

**Features**:
- Course name display
- Action confirmation message
- Confirm/Cancel buttons
- Loading state during action

---

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ Catalog Header                                       │
│ - Title, Course Count, Filter Badge                 │
├───────────┬─────────────────────────────────────────┤
│ Filters   │ Search Bar + Sort Controls              │
│ Panel     ├─────────────────────────────────────────┤
│           │ Course Grid                              │
│ - Search  │ ┌──────┐ ┌──────┐ ┌──────┐             │
│ - Cats    │ │ Card │ │ Card │ │ Card │             │
│ - Tags    │ └──────┘ └──────┘ └──────┘             │
│ - Status  │ ┌──────┐ ┌──────┐ ┌──────┐             │
│           │ │ Card │ │ Card │ │ Card │             │
│ Clear All │ └──────┘ └──────┘ └──────┘             │
│           ├─────────────────────────────────────────┤
│           │ Pagination                               │
│           │ [Prev] 1 2 3 ... 10 [Next]              │
└───────────┴─────────────────────────────────────────┘
```

## Implementation Order

1. Create CatalogCourseCard component (most reusable)
2. Create SearchBar component
3. Create FilterPanel component
4. Create SortControls component
5. Create CourseGrid component
6. Create Pagination component
7. Create CatalogHeader component
8. Create EnrollmentModal component
9. Update +page.svelte to orchestrate all components
10. Add enrollment action handlers
11. Implement URL param syncing for filters
12. Add loading/error states

## State Management

### URL-based State
Sync filter state with URL params for:
- Search term
- Selected categories/tags
- Sort option
- Current page
- Enrollment filter

Example: `/catalog?search=javascript&categories=cat-1,cat-2&sort=title-asc&page=2`

### Component State
- Loading states (searching, enrolling, etc.)
- Error states
- Modal open/close

---

## Styling Guidelines

- Use existing UI color palette
- Filter panel: light grey background (#B6CFCD)
- Course cards: white with hover shadow
- Active filters: blue accent (#304461)
- Enrollment button: light-orange (#EB966E)
- Responsive: sidebar collapses to drawer on mobile

## Copy

Use `catalogCopy` from `src/lib/features/lms/catalog/catalog-copy.ts`

## Interactions

### Search
1. User types in search bar
2. Debounce 300ms
3. Update URL param
4. Fetch new results
5. Update grid

### Filter
1. User clicks category/tag checkbox
2. Update URL param
3. Fetch new results
4. Update grid
5. Update filter count badge

### Enrollment
1. User clicks "Enroll" button
2. Show confirmation modal (optional)
3. Call enrollment API
4. Show loading state on button
5. Update button to "Enrolled" + "Continue"
6. Show success toast

### Pagination
1. User clicks page number
2. Scroll to top
3. Update URL param
4. Fetch new results
5. Update grid

## Accessibility

- Semantic HTML
- ARIA labels for filters
- Keyboard navigation
- Screen reader announcements for:
  - Search results count
  - Filter changes
  - Page changes
  - Enrollment actions
- Focus management (return focus after modal)
