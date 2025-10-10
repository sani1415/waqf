import { test, expect } from '@playwright/test';

test.describe('Student List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student-list.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load student list page', async ({ page }) => {
    await expect(page).toHaveTitle(/Students/);
    await expect(page.locator('.students-container')).toBeVisible();
  });

  test('should display students list', async ({ page }) => {
    await page.waitForTimeout(1000);
    await expect(page.locator('#studentsList')).toBeVisible();
  });

  test('should display student cards with stats', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const studentCards = page.locator('.student-card');
    const count = await studentCards.count();
    
    if (count > 0) {
      await expect(studentCards.first()).toBeVisible();
      
      // Check for stats in student card
      await expect(studentCards.first().locator('.stat, .progress')).toBeVisible();
    }
  });

  test('should navigate to student detail page', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const firstStudent = page.locator('.student-card').first();
    if (await firstStudent.isVisible()) {
      await firstStudent.click();
      
      // Should navigate to student detail page
      await page.waitForURL(/teacher-student-detail\.html/);
      await expect(page.locator('.student-detail')).toBeVisible();
    }
  });

  test('should display search/filter functionality', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(500);
      
      // List should update based on search
      await expect(page.locator('#studentsList')).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Student cards should stack vertically
    await expect(page.locator('#studentsList')).toBeVisible();
    
    // Check if hamburger menu exists
    const hamburgerMenu = page.locator('.hamburger-menu');
    if (await hamburgerMenu.isVisible()) {
      await hamburgerMenu.click();
      await expect(page.locator('.sidebar')).toHaveClass(/active/);
    }
  });
});

