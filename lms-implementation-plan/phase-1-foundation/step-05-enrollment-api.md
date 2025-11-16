# Step 5: Enrollment API

## Objective
Implement API functions for enrollment collections.

## Files to Create
- `src/lib/features/lms/shared/api/enrollment-api.ts`

## Functions to Implement
- `getOrganizationEnrollments(orgId, filters)` - Fetch org enrollments
- `getBundleEnrollments(userId, filters)` - Fetch user bundle enrollments
- `getCourseEnrollments(userId, filters)` - Fetch user course enrollments
- `checkCourseAccess(userId, courseId)` - Check if user has access
- `checkBundleAccess(userId, bundleId)` - Check if user has access
- `createCourseEnrollment(userId, courseId)` - Enroll in course

## Test File
- `src/lib/features/lms/shared/api/enrollment-api.test.ts` (mocked API responses)

## Dependencies
- Step 3 (API client)
