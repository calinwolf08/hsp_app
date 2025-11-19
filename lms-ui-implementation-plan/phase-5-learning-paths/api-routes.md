# Phase 5: Learning Paths - API Routes

## Routes to Implement

### 1. Learning Paths List
**File**: `src/routes/api/learning-paths/+server.ts`
- **Method**: GET
- **Purpose**: Get all learning paths with progress
- **Business Logic**: `buildPathWithProgress()`, `calculatePathProgress()`

### 2. Learning Path Details
**File**: `src/routes/api/learning-paths/[pathId]/+server.ts`
- **Method**: GET
- **Purpose**: Get learning path structure with bundles/modules/courses
- **Business Logic**: `extractAllCourses()`, `getSequentialState()`, `buildPathWithProgress()`

### 3. Learning Path Enrollment
**File**: `src/routes/api/learning-paths/[pathId]/enroll/+server.ts`
- **Method**: POST/DELETE
- **Purpose**: Enroll/unenroll in learning path
- **Note**: May auto-enroll in all courses depending on requirements

### 4. Sequential Access Check
**File**: `src/routes/api/learning-paths/[pathId]/access/[courseId]/+server.ts`
- **Method**: GET
- **Purpose**: Check if course is accessible in sequential path
- **Business Logic**: `isAccessibleInSequence()`, `markCoursesAccessibility()`

## Implementation Notes

- Sequential paths enforce course order
- Automatic paths allow any course access
- Return lock status for all courses
- Include next available course in response
