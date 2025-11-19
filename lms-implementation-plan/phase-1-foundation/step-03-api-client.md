# Step 3: API Client

## Objective
Create base API client with error handling and request wrapper.

## Files to Create
- `src/lib/features/lms/shared/api/client.ts`

## Functions to Implement
- `apiClient(url, options)` - Base fetch wrapper with error handling
- `buildQueryString(params)` - Build query params from object
- `handleApiError(response)` - Parse and standardize errors
- `withCredentials(options)` - Add auth credentials

## Test File
- `src/lib/features/lms/shared/api/client.test.ts` (error handling, query building, mocked fetch)

## Dependencies
- Step 1 (types)
- Step 2 (constants)
