# Phase 5: Learning Paths - E2E Tests

## Test File
`e2e/learning-paths.spec.ts`

## Key Test Scenarios

### Sequential Access Tests
- Cannot access locked course
- Lock icon shows for future courses
- Complete course unlocks next
- Cannot skip ahead
- Progress indicator shows current position
- Next recommended course highlighted

### Automatic Access Tests
- All courses accessible immediately
- No lock icons
- Can access any course
- Progress tracked but not enforced

### Learning Path Navigation
- Browse learning paths list
- View learning path details
- See bundle/module hierarchy
- Enroll in learning path
- Start first course
- Navigate between courses in path

### Progress Tracking Tests
- Complete course advances position
- Overall path progress updates
- Completion percentage accurate
- Path completed when all courses done

## Test Example

```typescript
test('sequential learning path enforces order', async ({ page }) => {
  await enrollInLearningPath(page, 'sequential-path-1');

  // Can access first course
  await page.getByText('Course 1').click();
  await expect(page).toHaveURL(/courses/);

  // Cannot access second course (locked)
  await page.goto('/learning-paths/sequential-path-1');
  const course2 = page.getByText('Course 2');
  await expect(course2.locator('[data-testid="lock-icon"]')).toBeVisible();

  await course2.click();
  await expect(page.getByText('Complete previous course')).toBeVisible();

  // Complete first course
  await completeCourse(page, 'course-1');

  // Now can access second course
  await page.goto('/learning-paths/sequential-path-1');
  await expect(course2.locator('[data-testid="lock-icon"]')).not.toBeVisible();
  await course2.click();
  await expect(page).toHaveURL(/courses/);
});
```
