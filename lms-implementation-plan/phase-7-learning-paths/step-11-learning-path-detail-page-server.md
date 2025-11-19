# Step 11: Learning Path Detail Page Server

## Objective
Implement server-side loading for learning path detail.

## Files to Create
- `src/routes/learning-paths/[pathId]/+page.server.ts`

## Functions to Implement
- `load({ params, locals })` - Load learning path with bundles and progress

## Test File
- `src/routes/learning-paths/[pathId]/+page.server.test.ts` (load function, mocked API)

## Dependencies
- Phase 1 (API functions)
- Step 2 (learning path loader utils)
