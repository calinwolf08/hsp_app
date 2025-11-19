# Phase 6: Bundles - API Routes

## Routes to Implement

### 1. Bundles List
**File**: `src/routes/api/bundles/+server.ts`
- **Method**: GET
- **Purpose**: Get all bundles with progress
- **Business Logic**: `buildBundleWithProgress()`, `calculateBundleProgress()`

### 2. Bundle Details
**File**: `src/routes/api/bundles/[bundleId]/+server.ts`
- **Method**: GET
- **Purpose**: Get bundle with modules and courses
- **Business Logic**: `extractAllModules()`, `buildModuleWithProgress()`, `calculateModuleProgress()`

### 3. Bundle Enrollment
**File**: `src/routes/api/bundles/[bundleId]/enroll/+server.ts`
- **Method**: POST/DELETE
- **Purpose**: Enroll/unenroll in bundle
- **Note**: May auto-enroll in all courses in bundle

### 4. Module Progress
**File**: `src/routes/api/modules/[moduleId]/progress/+server.ts`
- **Method**: GET
- **Purpose**: Get module progress details
- **Business Logic**: `calculateModuleProgress()`, `isModuleComplete()`

## Implementation Notes

- Bundles contain multiple modules
- Modules contain multiple courses
- Progress calculated at bundle and module levels
- Completion cascades from courses → modules → bundle
