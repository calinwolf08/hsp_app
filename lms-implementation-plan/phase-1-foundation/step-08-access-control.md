# Step 8: Access Control Utils

## Objective
Implement pure functions for access control logic.

## Files to Create
- `src/lib/features/lms/shared/utils/access-control.ts`

## Functions to Implement
- `hasActiveEnrollment(enrollments)` - Check if any enrollment is active
- `canAccessCourse(enrollments, courseId)` - Determine course access
- `canAccessBundle(enrollments, bundleId)` - Determine bundle access
- `filterAccessibleCourses(courses, enrollments)` - Filter by access
- `getEnrollmentSource(enrollments, itemId)` - Get enrollment source

## Test File
- `src/lib/features/lms/shared/utils/access-control.test.ts` (pure function unit tests)

## Dependencies
- Step 1 (types)
