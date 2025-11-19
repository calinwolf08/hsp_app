# LMS UI Implementation Plan

This plan covers the implementation of API routes, UI components, and E2E tests for the LMS features.

## Overview

All business logic (537 tests) is complete. This plan focuses on:
1. **API Routes** - SvelteKit server endpoints
2. **UI Components** - Svelte 5 components with runes
3. **E2E Tests** - Playwright tests for user flows

## Implementation Approach

Each phase completes a full feature (API → UI → E2E) before moving to the next.

## Phases

### Phase 1: Dashboard & Enrollment
**Goal**: User can view their enrolled courses and progress
- API routes for dashboard data
- Dashboard UI components
- E2E tests for dashboard viewing

### Phase 2: Course Catalog
**Goal**: User can browse, search, filter, and enroll in courses
- API routes for catalog, search, filters, enrollment
- Catalog UI components (search, filters, cards, pagination)
- E2E tests for browsing and enrolling

### Phase 3: Course Player
**Goal**: User can navigate and complete courses
- API routes for course content and progress
- Course player UI components (navigation, sections, activities)
- E2E tests for course completion flow

### Phase 4: Activity Players
**Goal**: User can complete different activity types (SCORM priority)
- API routes for activity data and completion
- Activity player components (SCORM, video, document, survey)
- E2E tests for activity completion

### Phase 5: Learning Paths
**Goal**: User can follow structured learning paths with sequential access
- API routes for learning path data and progress
- Learning path UI components (navigation, progress, locks)
- E2E tests for sequential access flow

### Phase 6: Bundles
**Goal**: User can view and complete bundles with modules
- API routes for bundle data and progress
- Bundle UI components (modules, courses, progress)
- E2E tests for bundle completion

## File Structure

```
lms-ui-implementation-plan/
├── README.md (this file)
├── phase-1-dashboard/
│   ├── api-routes.md
│   ├── ui-components.md
│   └── e2e-tests.md
├── phase-2-catalog/
│   ├── api-routes.md
│   ├── ui-components.md
│   └── e2e-tests.md
├── phase-3-course-player/
│   ├── api-routes.md
│   ├── ui-components.md
│   └── e2e-tests.md
├── phase-4-activities/
│   ├── api-routes.md
│   ├── ui-components.md
│   └── e2e-tests.md
├── phase-5-learning-paths/
│   ├── api-routes.md
│   ├── ui-components.md
│   └── e2e-tests.md
└── phase-6-bundles/
    ├── api-routes.md
    ├── ui-components.md
    └── e2e-tests.md
```

## Testing Strategy

### Unit Tests
- Already complete (537 tests for business logic)
- Continue adding tests for new utilities

### E2E Tests
- Focus on critical user journeys
- Test happy paths and error cases
- Use Playwright with fixtures for auth

### Integration Points
- API routes integrate business logic
- UI components consume API routes
- E2E tests verify end-to-end flow

## Key Principles

1. **Complete features fully** - API + UI + E2E per phase
2. **Build on existing work** - Use completed business logic
3. **Test as you go** - E2E tests validate each feature
4. **Progressive enhancement** - Basic functionality first, then enhancements
5. **User-focused** - Implement in order of user value
