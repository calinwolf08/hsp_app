# Phase 4: Activities - API Routes

## Routes to Implement

### 1. SCORM Package Upload
**File**: `src/routes/api/activities/scorm/upload/+server.ts`
- **Method**: POST
- **Purpose**: Upload and extract SCORM package
- **Returns**: Package URL and manifest data

### 2. SCORM Tracking
**File**: `src/routes/api/activities/scorm/tracking/+server.ts`
- **Method**: POST
- **Purpose**: Store SCORM tracking data (CMI values)
- **Business Logic**: SCORM data validation and storage

### 3. Video Activity Completion
**File**: `src/routes/api/activities/video/[activityId]/complete/+server.ts`
- **Method**: POST
- **Purpose**: Mark video as watched with completion data
- **Business Logic**: `shouldMarkComplete()`, `validateCompletion()`

### 4. Document Activity Completion
**File**: `src/routes/api/activities/document/[activityId]/complete/+server.ts`
- **Method**: POST
- **Purpose**: Mark document as viewed
- **Business Logic**: `shouldMarkComplete()`

### 5. Survey Activity Submission
**File**: `src/routes/api/activities/survey/[activityId]/submit/+server.ts`
- **Method**: POST
- **Purpose**: Submit survey responses
- **Business Logic**: Survey validation and storage, `shouldMarkComplete()`

## Implementation Notes

- SCORM packages need file upload handling
- Video tracking needs periodic heartbeat
- All completions trigger progress cascade
- Store completion data for reporting
