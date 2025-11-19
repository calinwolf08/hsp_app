# Phase 1: Dashboard - E2E Tests

## Overview
End-to-end tests for dashboard functionality using Playwright.

## Test File
`e2e/dashboard.spec.ts`

## Test Scenarios

### 1. Dashboard Access
```typescript
test('authenticated user can access dashboard', async ({ page }) => {
  // Login as user with enrollments
  await login(page, 'test@example.com', 'password');

  // Navigate to dashboard
  await page.goto('/dashboard');

  // Should see dashboard content
  await expect(page.getByRole('heading', { name: 'My Courses' })).toBeVisible();
});

test('unauthenticated user redirects to login', async ({ page }) => {
  // Try to access dashboard
  await page.goto('/dashboard');

  // Should redirect to login with redirectTo param
  await expect(page).toHaveURL(/\/login\?redirectTo=%2Fdashboard/);
});
```

---

### 2. Course Display
```typescript
test('displays enrolled courses with progress', async ({ page }) => {
  await loginAndGoToDashboard(page);

  // Should see course cards
  const courseCards = page.locator('[data-testid="course-card"]');
  await expect(courseCards).toHaveCount(3); // User has 3 enrollments

  // Check first course card content
  const firstCard = courseCards.first();
  await expect(firstCard.getByRole('heading')).toHaveText('Introduction to JavaScript');
  await expect(firstCard.locator('[data-testid="progress-bar"]')).toBeVisible();
  await expect(firstCard.getByText('75% Complete')).toBeVisible();
  await expect(firstCard.getByRole('button', { name: 'Continue' })).toBeVisible();
});

test('shows empty state when no enrollments', async ({ page }) => {
  await login(page, 'newuser@example.com', 'password');
  await page.goto('/dashboard');

  // Should see empty state
  await expect(page.getByText('No courses yet')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Browse Catalog' })).toBeVisible();
});
```

---

### 3. Sorting
```typescript
test('can sort courses by title', async ({ page }) => {
  await loginAndGoToDashboard(page);

  // Click sort dropdown
  await page.getByRole('button', { name: 'Sort by' }).click();
  await page.getByRole('menuitem', { name: 'Title (A-Z)' }).click();

  // Verify courses are sorted alphabetically
  const courseTitles = await page.locator('[data-testid="course-title"]').allTextContents();
  expect(courseTitles).toEqual([
    'Advanced TypeScript',
    'Introduction to JavaScript',
    'React Best Practices'
  ]);
});

test('can sort courses by progress', async ({ page }) => {
  await loginAndGoToDashboard(page);

  await page.getByRole('button', { name: 'Sort by' }).click();
  await page.getByRole('menuitem', { name: 'Progress' }).click();

  // Verify courses are sorted by completion percentage
  const progressValues = await page.locator('[data-testid="progress-percentage"]').allTextContents();
  const percentages = progressValues.map(v => parseInt(v));
  expect(percentages).toEqual([100, 75, 25]); // Descending order
});
```

---

### 4. Filtering
```typescript
test('can filter courses by status', async ({ page }) => {
  await loginAndGoToDashboard(page);

  // Click "In Progress" filter
  await page.getByRole('button', { name: 'In Progress' }).click();

  // Should only show in-progress courses
  const courseCards = page.locator('[data-testid="course-card"]');
  await expect(courseCards).toHaveCount(2);

  // All visible cards should have "In Progress" badge
  await expect(page.locator('[data-testid="status-badge"]', { hasText: 'In Progress' })).toHaveCount(2);
});

test('can filter to show completed courses', async ({ page }) => {
  await loginAndGoToDashboard(page);

  await page.getByRole('button', { name: 'Completed' }).click();

  const courseCards = page.locator('[data-testid="course-card"]');
  await expect(courseCards).toHaveCount(1);
  await expect(page.locator('[data-testid="status-badge"]', { hasText: 'Completed' })).toBeVisible();
});
```

---

### 5. Navigation
```typescript
test('clicking course card navigates to course player', async ({ page }) => {
  await loginAndGoToDashboard(page);

  // Click first course card
  await page.locator('[data-testid="course-card"]').first().click();

  // Should navigate to course player
  await expect(page).toHaveURL(/\/courses\/[^/]+/);
});

test('clicking continue button starts/resumes course', async ({ page }) => {
  await loginAndGoToDashboard(page);

  // Click continue button on in-progress course
  await page.getByRole('button', { name: 'Continue' }).first().click();

  // Should navigate to course player or activity
  await expect(page).toHaveURL(/\/courses\/[^/]+/);
});

test('clicking browse catalog navigates to catalog page', async ({ page }) => {
  await login(page, 'newuser@example.com', 'password');
  await page.goto('/dashboard');

  // Click browse catalog from empty state
  await page.getByRole('link', { name: 'Browse Catalog' }).click();

  await expect(page).toHaveURL('/catalog');
});
```

---

### 6. Statistics Display
```typescript
test('displays enrollment statistics', async ({ page }) => {
  await loginAndGoToDashboard(page);

  // Verify stats are displayed
  await expect(page.getByText('5 Total Courses')).toBeVisible();
  await expect(page.getByText('2 In Progress')).toBeVisible();
  await expect(page.getByText('3 Completed')).toBeVisible();
});
```

---

## Test Fixtures

### Setup Fixtures
`e2e/fixtures/dashboard.ts`

```typescript
import { test as base } from '@playwright/test';

type DashboardFixtures = {
  loginAndGoToDashboard: () => Promise<void>;
  userWithEnrollments: { email: string; password: string };
  userWithoutEnrollments: { email: string; password: string };
};

export const test = base.extend<DashboardFixtures>({
  userWithEnrollments: async ({}, use) => {
    await use({
      email: 'student@example.com',
      password: 'password123'
    });
  },

  userWithoutEnrollments: async ({}, use) => {
    await use({
      email: 'newuser@example.com',
      password: 'password123'
    });
  },

  loginAndGoToDashboard: async ({ page, userWithEnrollments }, use) => {
    await use(async () => {
      await login(page, userWithEnrollments.email, userWithEnrollments.password);
      await page.goto('/dashboard');
    });
  }
});
```

---

## Test Data Setup

### Database Seeding
Create test data before tests run:
- 2 users: one with enrollments, one without
- 5 courses
- 5 enrollments for first user
- 3 progress records (1 completed, 2 in-progress)

### Cleanup
Clean up test data after tests complete

---

## Implementation Order

1. Create test fixtures
2. Implement authentication tests
3. Implement course display tests
4. Implement sorting tests
5. Implement filtering tests
6. Implement navigation tests
7. Implement statistics tests
8. Add visual regression tests (optional)

---

## Running Tests

```bash
# Run all dashboard tests
npm run test:e2e -- dashboard

# Run in headed mode
npm run test:e2e -- dashboard --headed

# Run specific test
npm run test:e2e -- dashboard -g "can sort courses"

# Generate test report
npm run test:e2e -- dashboard --reporter=html
```

---

## Assertions to Include

- Visual elements are visible
- Correct data is displayed
- Interactions work as expected
- URLs are correct after navigation
- Error states display properly
- Loading states display properly
- Accessibility attributes are present
