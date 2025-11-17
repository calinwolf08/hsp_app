# Phase 6: Bundles - E2E Tests

## Test File
`e2e/bundles.spec.ts`

## Key Test Scenarios

### Bundle Navigation
- Browse bundles list
- View bundle details
- See module hierarchy
- Expand/collapse modules
- Enroll in bundle
- Start first course in bundle

### Module Organization
- View modules in bundle
- Expand module to see courses
- Collapse module
- Navigate to course from module
- All modules display correctly

### Progress Tracking
- Complete course updates module progress
- Module progress updates bundle progress
- Module completion indicator shows
- Bundle completion indicator shows
- All courses completed marks bundle complete

### Enrollment
- Enroll in bundle
- Auto-enroll in all courses (if applicable)
- Unenroll from bundle
- Unenroll from all courses (if applicable)

## Test Example

```typescript
test('bundle progress updates as courses completed', async ({ page }) => {
  await enrollInBundle(page, 'bundle-1');

  // Initially 0% complete
  await expect(page.getByText('0% Complete')).toBeVisible();

  // Expand first module
  await page.getByText('Module 1').click();

  // Complete first course
  await page.getByText('Course 1').click();
  await completeCourse(page);

  // Navigate back to bundle
  await page.goto('/bundles/bundle-1');

  // Module progress should update
  await expect(page.getByText('Module 1: 1/3 courses')).toBeVisible();

  // Bundle progress should update
  await expect(page.getByText(/\d+% Complete/)).toHaveText('33% Complete');
});
```

## Additional Tests

- Bundle enrollment flow
- Module expansion/collapse
- Navigation to courses
- Progress persistence
- Bundle completion celebration
- Error handling
