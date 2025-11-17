# Phase 1: Dashboard - API Routes

## Overview
API endpoints for retrieving user's enrolled courses and progress data.

## Routes to Implement

### 1. Dashboard Data Endpoint
**File**: `src/routes/api/dashboard/+server.ts`

**Method**: GET

**Purpose**: Get user's dashboard data (enrolled courses with progress)

**Request**:
- Headers: Authentication (from Better Auth)
- Query params:
  - `sort?: 'recent' | 'title' | 'progress'`
  - `status?: 'all' | 'in-progress' | 'completed' | 'not-started'`

**Response**:
```json
{
  "courses": [
    {
      "course": { ... },
      "enrollment": { ... },
      "progress": { ... },
      "completionPercentage": 75,
      "status": "in-progress"
    }
  ],
  "stats": {
    "totalEnrolled": 5,
    "inProgress": 2,
    "completed": 3
  }
}
```

**Business Logic Used**:
- `getCourseEnrollments()` from enrollment-api
- `getCourseProgress()` from progress-api
- `combineCourseData()` from dashboard-data utils
- `sortCourses()` from dashboard-data utils
- `filterCoursesByStatus()` from dashboard-data utils

**Error Handling**:
- 401: Not authenticated
- 500: Failed to load dashboard data

---

### 2. Course Progress Update
**File**: `src/routes/api/courses/[courseId]/progress/+server.ts`

**Method**: POST

**Purpose**: Update course progress (used when starting a course)

**Request**:
```json
{
  "status": "in-progress"
}
```

**Response**:
```json
{
  "progress": { ... },
  "success": true
}
```

**Business Logic Used**:
- `updateCourseProgress()` from progress-api

**Error Handling**:
- 401: Not authenticated
- 404: Course not found
- 500: Failed to update progress

---

## Implementation Order

1. Create `src/routes/api/dashboard/+server.ts`
2. Create `src/routes/api/courses/[courseId]/progress/+server.ts`
3. Add error handling and validation
4. Test with curl/Postman
5. Verify with existing +page.server.ts

## Dependencies

- Better Auth for authentication
- PayloadCMS API clients (already implemented)
- Dashboard business logic utilities (already implemented)

## Testing

**Manual Testing**:
```bash
# Get dashboard data
curl http://localhost:5173/api/dashboard \
  -H "Cookie: session=..."

# Update course progress
curl -X POST http://localhost:5173/api/courses/course-123/progress \
  -H "Cookie: session=..." \
  -H "Content-Type: application/json" \
  -d '{"status":"in-progress"}'
```

**Integration Tests**:
- Test authenticated access
- Test unauthenticated rejection
- Test sorting and filtering
- Test progress updates
