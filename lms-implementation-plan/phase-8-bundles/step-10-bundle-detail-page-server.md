# Step 10: Bundle Detail Page Server

## Objective
Implement server-side loading for bundle detail.

## Files to Create
- `src/routes/bundles/[bundleId]/+page.server.ts`

## Functions to Implement
- `load({ params, locals })` - Check access, load bundle with modules and progress

## Test File
- `src/routes/bundles/[bundleId]/+page.server.test.ts` (load function, access control, mocked API)

## Dependencies
- Phase 1 (API functions)
- Step 2 (bundle loader utils)
