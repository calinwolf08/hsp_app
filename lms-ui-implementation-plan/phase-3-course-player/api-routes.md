# Phase 3: Course Player - API Routes

## Routes to Implement

### 1. Course Content Endpoint
**File**: `src/routes/api/courses/[courseId]/content/+server.ts`
- **Method**: GET
- **Purpose**: Get full course structure with sections and activities
- **Business Logic**: `getCourseById()`, `buildCourseWithProgress()`, `getActivityIds()`

### 2. Section Progress Update
**File**: `src/routes/api/sections/[sectionId]/progress/+server.ts`
- **Method**: POST
- **Purpose**: Update section progress status
- **Business Logic**: `updateSectionProgress()`, `shouldUpdateCourseProgress()`

### 3. Activity Progress Update
**File**: `src/routes/api/activities/[activityId]/progress/+server.ts`
- **Method**: POST
- **Purpose**: Update activity progress with completion data
- **Business Logic**: `updateActivityProgress()`, `shouldUpdateSectionProgress()`, completion cascade

### 4. Course Navigation Data
**File**: `src/routes/api/courses/[courseId]/navigation/+server.ts`
- **Method**: GET
- **Purpose**: Get navigation state and tree for course
- **Business Logic**: `buildNavigationTree()`, `getSequentialState()`, `markCoursesAccessibility()`

### 5. Activity Content Endpoint
**File**: `src/routes/api/activities/[activityId]/+server.ts`
- **Method**: GET
- **Purpose**: Get specific activity content and config
- **Business Logic**: `getActivityById()`, activity-specific configs (SCORM, video, etc.)

## Implementation Notes

- All endpoints require authentication
- Verify enrollment before returning content
- Return 403 for locked content in sequential paths
- Include navigation hints (next/previous) in responses
- Cache course structure (invalidate on updates)
