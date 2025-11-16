# Step 3: Enrollment Actions Utils

## Objective
Implement functions for enrollment actions.

## Files to Create
- `src/lib/features/lms/catalog/utils/enrollment-actions.ts`

## Functions to Implement
- `enrollInCourse(userId, courseId)` - Enroll user in course
- `unenrollFromCourse(enrollmentId)` - Cancel enrollment
- `checkEnrollmentStatus(userId, courseId, enrollments)` - Get status
- `attachEnrollmentStatus(courses, enrollments)` - Add status to courses

## Test File
- `src/lib/features/lms/catalog/utils/enrollment-actions.test.ts` (mocked API calls)

## Dependencies
- Phase 1 (enrollment API)
