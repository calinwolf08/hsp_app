# Step 1: Type Definitions

## Objective
Define TypeScript types for all PayloadCMS collections.

## Files to Create
- `src/lib/features/lms/shared/types/index.ts`
- `src/lib/features/lms/shared/types/content.ts`
- `src/lib/features/lms/shared/types/enrollment.ts`
- `src/lib/features/lms/shared/types/progress.ts`
- `src/lib/features/lms/shared/types/api.ts`

## Types to Define
- Content: LearningPath, Bundle, Module, Course, Section, Activity
- Enrollment: OrganizationEnrollment, BundleEnrollment, CourseEnrollment
- Progress: BundleProgress, CourseProgress, SectionProgress, ActivityProgress
- API: PaginatedResponse, ApiError, QueryParams

## Test File
- `src/lib/features/lms/shared/types/types.test.ts` (type guards, validators)

## Dependencies
None
