# Step 9: Survey Viewer Component

## Objective
Create survey viewer for survey activities.

## Files to Create
- `src/lib/features/lms/activities/components/survey/SurveyViewer.svelte`
- `src/lib/features/lms/activities/components/survey/survey-submission.ts`

## Component Props
- `activity: Activity` - Activity with survey ID
- `userId: string` - Current user ID
- `onComplete: () => void` - Completion callback

## Functions to Implement
- `validateSurveyResponse(responses)` - Validate submission
- `buildSurveyPayload(surveyId, responses)` - Build API payload
- `submitSurvey(payload)` - Submit survey responses

## Test File
- `src/lib/features/lms/activities/components/survey/SurveyViewer.test.ts` (component rendering, form submission)
- `src/lib/features/lms/activities/components/survey/survey-submission.test.ts` (pure function tests)

## Dependencies
- Step 1 (activities types)
- Step 2 (completion utils)
