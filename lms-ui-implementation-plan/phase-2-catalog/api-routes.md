# Phase 2: Catalog - API Routes

## Overview
API endpoints for browsing, searching, filtering courses and managing enrollments.

## Routes to Implement

### 1. Catalog Data Endpoint
**File**: `src/routes/api/catalog/+server.ts`

**Method**: GET

**Purpose**: Get catalog courses with filtering, searching, and pagination

**Request**:
- Query params:
  - `search?: string` - Search term
  - `categories?: string` - Comma-separated category IDs
  - `tags?: string` - Comma-separated tag IDs
  - `sort?: 'title-asc' | 'title-desc' | 'recent' | 'popular'`
  - `page?: number` - Page number (default: 1)
  - `limit?: number` - Items per page (default: 12)
  - `enrollmentStatus?: 'all' | 'enrolled' | 'not-enrolled'`

**Response**:
```json
{
  "courses": [
    {
      "course": { ... },
      "isEnrolled": false,
      "enrollmentId": null
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "totalItems": 45,
    "totalPages": 4
  },
  "filters": {
    "categories": [...],
    "tags": [...]
  }
}
```

**Business Logic Used**:
- `getAllCourses()` from content-api
- `getCourseEnrollments()` from enrollment-api
- `applyAllFilters()` from catalog-filters
- `sortCourses()` from catalog-filters
- `attachEnrollmentStatus()` from enrollment-actions
- `filterByEnrollmentStatus()` from enrollment-actions
- `buildQueryParams()` from catalog-filters
- `calculatePagination()` from catalog-filters
- `paginateItems()` from catalog-filters

**Error Handling**:
- 500: Failed to load catalog

---

### 2. Categories Endpoint
**File**: `src/routes/api/catalog/categories/+server.ts`

**Method**: GET

**Purpose**: Get all available categories

**Response**:
```json
{
  "categories": [
    { "id": "cat-1", "name": "Programming", "slug": "programming" }
  ]
}
```

**Business Logic Used**:
- `getAllCategories()` from content-api

---

### 3. Tags Endpoint
**File**: `src/routes/api/catalog/tags/+server.ts`

**Method**: GET

**Purpose**: Get all available tags

**Response**:
```json
{
  "tags": [
    { "id": "tag-1", "name": "JavaScript", "slug": "javascript" }
  ]
}
```

**Business Logic Used**:
- `getAllTags()` from content-api

---

### 4. Course Enrollment Endpoint
**File**: `src/routes/api/courses/[courseId]/enroll/+server.ts`

**Method**: POST

**Purpose**: Enroll user in a course

**Request**:
```json
{
  "source": "direct"
}
```

**Response**:
```json
{
  "enrollment": { ... },
  "success": true
}
```

**Business Logic Used**:
- `enrollInCourse()` from enrollment-actions
- `checkEnrollmentStatus()` from enrollment-actions

**Error Handling**:
- 401: Not authenticated
- 404: Course not found
- 409: Already enrolled
- 500: Enrollment failed

---

### 5. Course Unenrollment Endpoint
**File**: `src/routes/api/courses/[courseId]/enroll/+server.ts`

**Method**: DELETE

**Purpose**: Unenroll user from a course

**Response**:
```json
{
  "success": true
}
```

**Business Logic Used**:
- `unenrollFromCourse()` from enrollment-actions

**Error Handling**:
- 401: Not authenticated
- 404: Enrollment not found
- 500: Unenrollment failed

---

### 6. Course Details Endpoint
**File**: `src/routes/api/courses/[courseId]/+server.ts`

**Method**: GET

**Purpose**: Get detailed course information with enrollment status

**Response**:
```json
{
  "course": { ... },
  "isEnrolled": false,
  "enrollmentId": null,
  "enrolledAt": null,
  "sections": [...],
  "totalActivities": 12
}
```

**Business Logic Used**:
- `getCourseById()` from content-api
- `checkEnrollmentStatus()` from enrollment-actions

**Error Handling**:
- 404: Course not found
- 500: Failed to load course

---

## Implementation Order

1. Create `/api/catalog` endpoint with filters and pagination
2. Create `/api/catalog/categories` endpoint
3. Create `/api/catalog/tags` endpoint
4. Create `/api/courses/[courseId]` endpoint
5. Create `/api/courses/[courseId]/enroll` endpoint (POST & DELETE)
6. Add validation and error handling
7. Test with curl/Postman
8. Add rate limiting (optional)

## Dependencies

- Better Auth for authentication
- PayloadCMS API clients (already implemented)
- Catalog business logic utilities (already implemented)

## Testing

**Manual Testing**:
```bash
# Get catalog with filters
curl "http://localhost:5173/api/catalog?search=javascript&sort=title-asc&page=1"

# Get categories
curl http://localhost:5173/api/catalog/categories

# Enroll in course
curl -X POST http://localhost:5173/api/courses/course-123/enroll \
  -H "Cookie: session=..." \
  -H "Content-Type: application/json" \
  -d '{"source":"direct"}'

# Unenroll from course
curl -X DELETE http://localhost:5173/api/courses/course-123/enroll \
  -H "Cookie: session=..."
```

## Performance Considerations

- Cache categories and tags (rarely change)
- Add database indexes for search fields
- Consider implementing server-side pagination in PayloadCMS API
- Add ETag headers for caching

## Security

- Validate all query parameters
- Sanitize search input
- Rate limit enrollment/unenrollment actions
- Verify user permissions for enrollments
