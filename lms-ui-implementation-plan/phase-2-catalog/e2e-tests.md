# Phase 2: Catalog - E2E Tests

## Test File
`e2e/catalog.spec.ts`

## Test Scenarios

### 1. Catalog Access & Display
```typescript
test('displays course catalog', async ({ page }) => {
  await page.goto('/catalog');

  // Should see catalog page
  await expect(page.getByRole('heading', { name: 'Course Catalog' })).toBeVisible();

  // Should see course cards
  const courseCards = page.locator('[data-testid="course-card"]');
  await expect(courseCards).toHaveCount.toBeGreaterThan(0);

  // Should see filters
  await expect(page.getByText('Filters')).toBeVisible();
});
```

---

### 2. Search Functionality
```typescript
test('can search for courses', async ({ page }) => {
  await page.goto('/catalog');

  // Type in search box
  const searchInput = page.getByPlaceholder('Search courses');
  await searchInput.fill('javascript');

  // Wait for debounce and results
  await page.waitForTimeout(500);

  // URL should update
  await expect(page).toHaveURL(/search=javascript/);

  // Results should match search
  const courseTitles = await page.locator('[data-testid="course-title"]').allTextContents();
  courseTitles.forEach(title => {
    expect(title.toLowerCase()).toContain('javascript');
  });
});

test('shows no results message when search has no matches', async ({ page }) => {
  await page.goto('/catalog');

  await page.getByPlaceholder('Search courses').fill('xyznonexistent');
  await page.waitForTimeout(500);

  await expect(page.getByText('No courses found')).toBeVisible();
});

test('can clear search', async ({ page }) => {
  await page.goto('/catalog?search=javascript');

  // Click clear button
  await page.getByRole('button', { name: 'Clear search' }).click();

  // URL should update
  await expect(page).toHaveURL('/catalog');

  // Should show all courses
  const courseCards = page.locator('[data-testid="course-card"]');
  await expect(courseCards).toHaveCount.toBeGreaterThan(5);
});
```

---

### 3. Category Filtering
```typescript
test('can filter by category', async ({ page }) => {
  await page.goto('/catalog');

  // Click a category checkbox
  await page.getByLabel('Programming').check();

  // URL should update
  await expect(page).toHaveURL(/categories=cat-programming/);

  // All visible courses should have Programming category
  const categoryBadges = await page.locator('[data-testid="category-badge"]').allTextContents();
  expect(categoryBadges.some(badge => badge === 'Programming')).toBe(true);
});

test('can filter by multiple categories', async ({ page }) => {
  await page.goto('/catalog');

  await page.getByLabel('Programming').check();
  await page.getByLabel('Design').check();

  await expect(page).toHaveURL(/categories=/);

  // Should show courses from either category
  const courseCards = page.locator('[data-testid="course-card"]');
  await expect(courseCards).toHaveCount.toBeGreaterThan(0);
});

test('shows active filter count', async ({ page }) => {
  await page.goto('/catalog');

  await page.getByLabel('Programming').check();
  await page.getByLabel('Design').check();

  await expect(page.getByText('2 active filters')).toBeVisible();
});

test('can clear all filters', async ({ page }) => {
  await page.goto('/catalog?categories=cat-1,cat-2&tags=tag-1');

  await page.getByRole('button', { name: 'Clear All Filters' }).click();

  await expect(page).toHaveURL('/catalog');
  await expect(page.getByText('active filters')).not.toBeVisible();
});
```

---

### 4. Sorting
```typescript
test('can sort courses by title ascending', async ({ page }) => {
  await page.goto('/catalog');

  await page.getByRole('button', { name: 'Sort by' }).click();
  await page.getByRole('menuitem', { name: 'Title (A-Z)' }).click();

  const titles = await page.locator('[data-testid="course-title"]').allTextContents();
  const sorted = [...titles].sort();
  expect(titles).toEqual(sorted);
});

test('can sort courses by recent', async ({ page }) => {
  await page.goto('/catalog');

  await page.getByRole('button', { name: 'Sort by' }).click();
  await page.getByRole('menuitem', { name: 'Most Recent' }).click();

  await expect(page).toHaveURL(/sort=recent/);
});
```

---

### 5. Pagination
```typescript
test('can navigate between pages', async ({ page }) => {
  await page.goto('/catalog');

  // Should see pagination
  await expect(page.getByText(/Showing .+ of .+ courses/)).toBeVisible();

  // Click page 2
  await page.getByRole('button', { name: 'Page 2' }).click();

  // URL should update
  await expect(page).toHaveURL(/page=2/);

  // Should scroll to top
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBe(0);

  // Different courses should be visible
  const courseTitles = await page.locator('[data-testid="course-title"]').allTextContents();
  expect(courseTitles).toBeDefined();
});

test('previous button disabled on first page', async ({ page }) => {
  await page.goto('/catalog');

  const prevButton = page.getByRole('button', { name: 'Previous' });
  await expect(prevButton).toBeDisabled();
});

test('next button disabled on last page', async ({ page }) => {
  // Calculate last page or navigate to it
  await page.goto('/catalog');

  const lastPageButton = page.getByRole('button', { name: /Page \d+/ }).last();
  await lastPageButton.click();

  const nextButton = page.getByRole('button', { name: 'Next' });
  await expect(nextButton).toBeDisabled();
});
```

---

### 6. Enrollment Actions
```typescript
test('can enroll in a course', async ({ page }) => {
  await login(page, 'student@example.com', 'password');
  await page.goto('/catalog');

  // Find a course not enrolled in
  const enrollButton = page.getByRole('button', { name: 'Enroll' }).first();
  await enrollButton.click();

  // Should show loading state
  await expect(enrollButton).toHaveAttribute('aria-busy', 'true');

  // Should update to "Enrolled"
  await expect(page.getByText('Enrolled').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue' }).first()).toBeVisible();

  // Should show success message
  await expect(page.getByText('Successfully enrolled')).toBeVisible();
});

test('enrolled courses show Continue button', async ({ page }) => {
  await login(page, 'student@example.com', 'password');
  await page.goto('/catalog');

  // Filter to show only enrolled
  await page.getByRole('button', { name: 'Enrolled' }).click();

  const courseCards = page.locator('[data-testid="course-card"]');
  const count = await courseCards.count();

  // All should show Continue button
  await expect(page.getByRole('button', { name: 'Continue' })).toHaveCount(count);
});

test('can unenroll from a course with confirmation', async ({ page }) => {
  await login(page, 'student@example.com', 'password');
  await page.goto('/catalog?enrollmentStatus=enrolled');

  // Click unenroll on a course
  const courseCard = page.locator('[data-testid="course-card"]').first();
  await courseCard.hover();
  await courseCard.getByRole('button', { name: 'Unenroll' }).click();

  // Should show confirmation modal
  await expect(page.getByText('Are you sure you want to unenroll')).toBeVisible();

  // Confirm unenrollment
  await page.getByRole('button', { name: 'Confirm' }).click();

  // Should update to show Enroll button
  await expect(courseCard.getByRole('button', { name: 'Enroll' })).toBeVisible();
});

test('unauthenticated user sees Enroll button but redirects to login', async ({ page }) => {
  await page.goto('/catalog');

  const enrollButton = page.getByRole('button', { name: 'Enroll' }).first();
  await enrollButton.click();

  // Should redirect to login
  await expect(page).toHaveURL(/\/login/);
});
```

---

### 7. Enrollment Status Filter
```typescript
test('can filter to show only enrolled courses', async ({ page }) => {
  await login(page, 'student@example.com', 'password');
  await page.goto('/catalog');

  await page.getByRole('button', { name: 'Enrolled' }).click();

  await expect(page).toHaveURL(/enrollmentStatus=enrolled/);

  // All visible courses should have "Enrolled" badge
  const courseCards = page.locator('[data-testid="course-card"]');
  const count = await courseCards.count();
  await expect(page.getByText('Enrolled')).toHaveCount(count);
});

test('can filter to show only not enrolled courses', async ({ page }) => {
  await login(page, 'student@example.com', 'password');
  await page.goto('/catalog');

  await page.getByRole('button', { name: 'Not Enrolled' }).click();

  // All visible courses should have "Enroll" button
  const courseCards = page.locator('[data-testid="course-card"]');
  const count = await courseCards.count();
  await expect(page.getByRole('button', { name: 'Enroll' })).toHaveCount(count);
});
```

---

### 8. Course Details Navigation
```typescript
test('clicking course card navigates to course details', async ({ page }) => {
  await page.goto('/catalog');

  const firstCard = page.locator('[data-testid="course-card"]').first();
  const courseTitle = await firstCard.locator('[data-testid="course-title"]').textContent();

  await firstCard.click();

  // Should navigate to course page
  await expect(page).toHaveURL(/\/courses\/[^/]+/);
  await expect(page.getByRole('heading', { name: courseTitle as string })).toBeVisible();
});

test('clicking Continue button on enrolled course goes to course player', async ({ page }) => {
  await login(page, 'student@example.com', 'password');
  await page.goto('/catalog?enrollmentStatus=enrolled');

  await page.getByRole('button', { name: 'Continue' }).first().click();

  await expect(page).toHaveURL(/\/courses\/[^/]+/);
});
```

---

## Test Fixtures

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedCatalog: async ({ page }, use) => {
    await login(page, 'student@example.com', 'password');
    await page.goto('/catalog');
    await use(page);
  }
});
```

---

## Running Tests

```bash
# Run all catalog tests
npm run test:e2e -- catalog

# Run specific test group
npm run test:e2e -- catalog -g "Enrollment Actions"

# Run with UI mode
npm run test:e2e -- catalog --ui
```

---

## Assertions

- Search functionality works correctly
- Filters apply and URL updates
- Sorting changes order
- Pagination navigates correctly
- Enrollment/unenrollment works
- Loading states display
- Error messages show on failures
- Accessibility attributes present
