# Phase 4: Activities - E2E Tests

## Test File
`e2e/activities.spec.ts`

## Key Test Scenarios

### SCORM Activities
- Launch SCORM package in iframe
- SCORM API communication works
- Track completion via SCORM data
- Save suspend data
- Handle SCORM errors

### Video Activities
- Play video
- Track watch time
- Mark complete at 90%
- Resume from last position
- Handle video load errors

### Document Activities
- Display PDF/document
- Mark as complete manually
- Download document
- Navigate pages
- Handle document load errors

### Survey Activities
- Display questions
- Input answers
- Validate required fields
- Submit survey
- Mark complete on submission
- Handle submission errors

## Test Example

```typescript
test('completes SCORM activity and updates progress', async ({ page }) => {
  await enrollAndStartCourse(page, 'course-with-scorm');

  // Navigate to SCORM activity
  await page.getByText('SCORM Activity').click();

  // Wait for SCORM to initialize
  await expect(page.frameLocator('iframe').locator('body')).toBeVisible();

  // Simulate SCORM completion (mock SCORM API call)
  await page.evaluate(() => {
    window.API.LMSSetValue('cmi.core.lesson_status', 'completed');
    window.API.LMSFinish('');
  });

  // Should mark activity as complete
  await expect(page.getByTestId('activity-complete-badge')).toBeVisible();

  // Progress should update
  await expect(page.getByText(/\d+ of \d+ activities/)).toHaveText('1 of 5 activities');
});
```
