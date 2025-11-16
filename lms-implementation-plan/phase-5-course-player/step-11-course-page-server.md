# Step 11: Course Page Server Load

## Objective
Implement server-side data loading and access control for course.

## Files to Create
- `src/routes/courses/[courseId]/+page.server.ts`

## Functions to Implement
- `load({ params, locals })` - Check access, load course with progress

## Test File
- `src/routes/courses/[courseId]/+page.server.test.ts` (load function, access control, mocked API)

## Dependencies
- Phase 1 (API functions)
- Step 2 (course loader utils)
