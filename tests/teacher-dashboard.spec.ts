import { test, expect } from '@playwright/test';

test.describe('Teacher Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teacher-dashboard.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load teacher dashboard successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Teacher Dashboard/);
    await expect(page.locator('.dashboard-header')).toBeVisible();
  });

  test('should display dashboard overview with stats', async ({ page }) => {
    await expect(page.locator('.stats-grid')).toBeVisible();
    await expect(page.locator('.stat-card')).toHaveCount(4);
    
    // Check for stat cards
    await expect(page.locator('.stat-card').nth(0)).toContainText('Total Students');
    await expect(page.locator('.stat-card').nth(1)).toContainText('Active Tasks');
    await expect(page.locator('.stat-card').nth(2)).toContainText('Pending Reviews');
    await expect(page.locator('.stat-card').nth(3)).toContainText('Unread Messages');
  });

  test('should navigate between sections', async ({ page }) => {
    // Test navigation to Students section
    await page.click('a[href="#students"]');
    await expect(page.locator('#studentsSection')).toBeVisible();
    await expect(page.locator('#dashboardSection')).not.toBeVisible();

    // Test navigation to Tasks section
    await page.click('a[href="#tasks"]');
    await expect(page.locator('#tasksSection')).toBeVisible();
    await expect(page.locator('#studentsSection')).not.toBeVisible();

    // Test navigation to Messages section
    await page.click('a[href="#messages"]');
    await expect(page.locator('#messagesSection')).toBeVisible();
    await expect(page.locator('#tasksSection')).not.toBeVisible();

    // Test navigation back to Dashboard
    await page.click('a[href="#dashboard"]');
    await expect(page.locator('#dashboardSection')).toBeVisible();
    await expect(page.locator('#messagesSection')).not.toBeVisible();
  });

  test('should display students list with progress', async ({ page }) => {
    await page.click('a[href="#students"]');
    await page.waitForSelector('#studentsSection', { state: 'visible' });
    
    // Check if students list is displayed
    await expect(page.locator('#studentsList')).toBeVisible();
    
    // Check for student cards or table
    const studentElements = page.locator('.student-card, .student-row');
    await expect(studentElements.first()).toBeVisible();
  });

  test('should display tasks management interface', async ({ page }) => {
    await page.click('a[href="#tasks"]');
    await page.waitForSelector('#tasksSection', { state: 'visible' });
    
    // Check for task management tabs
    await expect(page.locator('#manageTaskTabs')).toBeVisible();
    
    // Test switching between task tabs
    await page.click('button[onclick="switchManageTaskTab(\'oneTime\')"]');
    await expect(page.locator('#oneTimeTasksList')).toBeVisible();
    
    await page.click('button[onclick="switchManageTaskTab(\'daily\')"]');
    await expect(page.locator('#dailyTasksList')).toBeVisible();
  });

  test('should display messages interface', async ({ page }) => {
    await page.click('a[href="#messages"]');
    await page.waitForSelector('#messagesSection', { state: 'visible' });
    
    // Check for messages interface
    await expect(page.locator('#messagesSection')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if hamburger menu is visible on mobile
    await expect(page.locator('.hamburger-menu')).toBeVisible();
    
    // Test hamburger menu functionality
    await page.click('.hamburger-menu');
    await expect(page.locator('.sidebar')).toHaveClass(/active/);
    
    // Test closing sidebar by clicking overlay
    await page.click('.sidebar-overlay');
    await expect(page.locator('.sidebar')).not.toHaveClass(/active/);
  });
});
