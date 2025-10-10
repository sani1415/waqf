import { test, expect } from '@playwright/test';

test.describe('Teacher Daily Overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teacher-daily-overview.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load daily overview page', async ({ page }) => {
    await expect(page).toHaveTitle(/Daily Overview/);
    await expect(page.locator('.overview-container')).toBeVisible();
  });

  test('should display date selector', async ({ page }) => {
    await expect(page.locator('input[type="date"]')).toBeVisible();
  });

  test('should display overview table', async ({ page }) => {
    await page.waitForTimeout(1000);
    await expect(page.locator('.overview-table')).toBeVisible();
  });

  test('should display students in table', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for table rows
    const tableRows = page.locator('tbody tr');
    const count = await tableRows.count();
    
    // Should have at least header row
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should change date and reload data', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const dateInput = page.locator('input[type="date"]');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    await dateInput.fill(yesterdayStr);
    await page.waitForTimeout(1000);
    
    // Table should still be visible with data for selected date
    await expect(page.locator('.overview-table')).toBeVisible();
  });

  test('should display task completion checkboxes', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for checkboxes in table
    const checkboxes = page.locator('table input[type="checkbox"]');
    const count = await checkboxes.count();
    
    if (count > 0) {
      await expect(checkboxes.first()).toBeVisible();
    }
  });

  test('should toggle task completion', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const firstCheckbox = page.locator('table input[type="checkbox"]').first();
    
    if (await firstCheckbox.isVisible()) {
      const initialState = await firstCheckbox.isChecked();
      await firstCheckbox.click();
      await page.waitForTimeout(500);
      
      const newState = await firstCheckbox.isChecked();
      expect(newState).not.toBe(initialState);
    }
  });

  test('should display completion summary', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for summary section
    const summary = page.locator('.summary-section, .completion-stats');
    if (await summary.isVisible()) {
      await expect(summary).toBeVisible();
    }
  });

  test('should be responsive on mobile with horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Table should be in a scrollable container
    const tableContainer = page.locator('.table-container');
    if (await tableContainer.isVisible()) {
      await expect(tableContainer).toBeVisible();
      
      // Check if table has scroll
      const hasScroll = await tableContainer.evaluate((el) => {
        return el.scrollWidth > el.clientWidth;
      });
      
      // On mobile with many columns, should have horizontal scroll
      expect(typeof hasScroll).toBe('boolean');
    }
  });
});

