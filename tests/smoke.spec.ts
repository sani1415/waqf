import { test, expect } from '@playwright/test';

// Helper to append storage override
function withStorage(base: string, storage = process.env.STORAGE || 'firebase') {
  const hasQuery = base.includes('?');
  const suffix = `storage=${storage}`;
  return hasQuery ? `${base}&${suffix}` : `${base}?${suffix}`;
}

test.describe('Smoke - Teacher dashboard', () => {
  test('loads dashboard and sections', async ({ page }) => {
    await page.goto(withStorage('/teacher-dashboard.html'));
    await expect(page.getByText('Teacher Dashboard')).toBeVisible();
    // Dashboard tiles
    await expect(page.locator('#totalStudents')).toBeVisible();
    await expect(page.locator('#totalTasks')).toBeVisible();

    // Switch sections
    await page.getByRole('link', { name: 'Students' }).click();
    await expect(page.locator('#studentsList')).toBeVisible();
    await page.getByRole('link', { name: 'Manage Tasks' }).click();
    await expect(page.locator('#viewTasksTab')).toBeVisible();
    await page.getByRole('link', { name: 'Analytics' }).click();
    await expect(page.locator('#overallCompletion')).toBeVisible();
  });
});

test.describe('Smoke - Student list and dashboard', () => {
  test('loads student list and selects first student', async ({ page }) => {
    await page.goto(withStorage('/student-list.html'));
    await expect(page.locator('#studentCards')).toBeVisible();
    const firstCard = page.locator('.student-select-card').first();
    if (await firstCard.count()) {
      await firstCard.click();
      await expect(page.getByText('Welcome,')).toBeVisible();
    }
  });
});


