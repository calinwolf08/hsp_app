# Step 13: Activity Page Server Load

## Objective
Implement server-side loading for individual activity route.

## Files to Create
- `src/routes/courses/[courseId]/[sectionId]/[activityId]/+page.server.ts`

## Functions to Implement
- `load({ params, locals })` - Check access, load activity and course context

## Test File
- `src/routes/courses/[courseId]/[sectionId]/[activityId]/+page.server.test.ts` (load function, mocked API)

## Dependencies
- Phase 1 (API functions)
