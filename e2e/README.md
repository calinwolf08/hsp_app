# E2E Tests

## Overview

This directory contains end-to-end (e2e) tests for the application using Playwright. The tests cover user flows from dashboard to course player, including navigation, interactions, and progress tracking.

## Test Structure

- `course-player-integration.spec.ts` - Comprehensive integration tests for the complete course player flow
- `course-player.spec.ts` - Individual course player component tests
- `dashboard.spec.ts` - Dashboard page tests
- `catalog.spec.ts` - Course catalog tests
- `helpers/` - Test helper functions and API mocks
- `fixtures/` - Test data fixtures

## Running Tests

### Prerequisites

1. Build the application:
   ```bash
   npm run build
   ```

2. Set required environment variables (optional for mock tests):
   ```bash
   export BETTER_AUTH_SECRET=test-secret-key-at-least-32-characters-long
   export TEST_WITH_DATA=true  # For tests that need real data
   export TEST_WITH_AUTH=true  # For tests that need authentication
   ```

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test File

```bash
npm run test:e2e -- course-player-integration
```

### Run Tests in Headed Mode (Watch Tests Execute)

```bash
npm run test:e2e -- --headed
```

### Run Tests in UI Mode (Interactive)

```bash
npx playwright test --ui
```

## Test Categories

### Integration Tests

The `course-player-integration.spec.ts` file contains comprehensive integration tests covering:

- **Dashboard to Course Player Flow**: Complete user journey from dashboard to course
- **Course Navigation**: Next/previous buttons, sidebar navigation, position indicators
- **Activity Interactions**: Marking activities complete, different activity types
- **Progress Tracking**: Progress bars, completion percentages, updated after actions
- **Error Handling**: Course not found, activity load failures, enrollment requirements
- **Responsive Design**: Mobile and desktop viewports
- **Complete User Journeys**: End-to-end scenarios with multiple steps

### API Mocking

The integration tests use API mocking via `helpers/api-mocks.ts` to:

- Mock dashboard data (enrollments, progress, stats)
- Mock course content and navigation
- Mock activity data and progress updates
- Allow tests to run without a real backend

## Test Data

Test fixtures are defined in `fixtures/courses.json` and include:

- Sample course with multiple sections and activities
- Different activity types (document, video, scorm, survey)
- Enrollment and progress data

## Writing New Tests

### Example Test Structure

```typescript
test('description of what is being tested', async ({ page }) => {
  // Setup mocks
  await mockDashboardAPI(page, { hasEnrollments: true });
  await mockCoursePlayerAPIs(page, 'activity-1');

  // Navigate to page
  await page.goto('/courses/test-course-123');
  await page.waitForLoadState('networkidle');

  // Perform actions
  await page.getByRole('button', { name: /Next/i }).click();

  // Assert expectations
  await expect(page.getByText(/Activity 2/i)).toBeVisible();
});
```

### Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Mock API responses** to avoid backend dependencies
3. **Wait for network idle** after navigation
4. **Use semantic selectors** (role, label) when possible
5. **Test user journeys** not just individual features
6. **Keep tests independent** - each test should set up its own state

## Debugging Tests

### View Test Report

After tests run:
```bash
npx playwright show-report
```

### Debug Specific Test

```bash
npm run test:e2e -- --debug -g "test name"
```

### Generate Trace

```bash
npm run test:e2e -- --trace on
```

## Known Issues

- Tests may fail if BETTER_AUTH_SECRET is not set (warning only, tests should still work with mocks)
- Page crashes indicate the app couldn't load - check that `npm run build && npm run preview` works
- Some tests are skipped without `TEST_WITH_DATA` or `TEST_WITH_AUTH` environment variables

## CI/CD Integration

The tests are configured to run in CI with:

1. Build the app
2. Start preview server on port 4173
3. Run all Playwright tests
4. Generate test report

See `playwright.config.ts` for configuration details.
