# Phase 3: Course Player - E2E Tests

## Test File
`e2e/course-player.spec.ts`

## Key Test Scenarios

### Navigation Tests
- Open course and see first activity
- Navigate to next activity
- Navigate to previous activity
- Click activity in sidebar navigation
- Navigation buttons disabled at boundaries

### Progress Tracking Tests
- Mark activity as complete
- Progress bar updates
- Activity checkmark appears
- Section progress updates
- Course progress updates
- Completion cascades (activity → section → course)

### Sequential Access Tests (if applicable)
- Locked activities cannot be accessed
- Lock icon shows for future activities
- Completing activity unlocks next
- Cannot skip ahead

### Course Completion Tests
- Complete all activities
- Completion modal/celebration shows
- Course marked as completed
- Certificate available (if implemented)

### State Persistence Tests
- Refresh page maintains position
- Progress persists across sessions
- Can resume from where left off

### Error Handling Tests
- Handles activity load failure
- Handles progress save failure
- Shows appropriate error messages
- Can retry failed operations

## Test Example

```typescript
test('can navigate through course activities', async ({ page }) => {
  await enrollAndStartCourse(page, 'course-1');

  // Should start at first activity
  await expect(page.getByText('Activity 1')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();

  // Navigate to next
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Activity 2')).toBeVisible();

  // Progress should update
  await expect(page.getByText('2 of 10 activities')).toBeVisible();
});
```
