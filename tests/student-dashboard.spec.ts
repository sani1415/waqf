import { test, expect } from '@playwright/test';

test.describe('Student Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student-dashboard.html?studentId=student1');
    await page.waitForLoadState('networkidle');
  });

  test('should load student dashboard', async ({ page }) => {
    await expect(page).toHaveTitle(/Student Dashboard/);
    await expect(page.locator('.dashboard-container')).toBeVisible();
  });

  test('should display student stats', async ({ page }) => {
    await expect(page.locator('.stats-section')).toBeVisible();
    
    // Check for stat cards
    await expect(page.locator('.stat-card')).toHaveCount(3);
  });

  test('should switch between tabs', async ({ page }) => {
    // Switch to Tasks tab
    await page.click('button:has-text("Tasks")');
    await expect(page.locator('#tasksTab')).toBeVisible();
    
    // Switch to Quizzes tab
    await page.click('button:has-text("Quizzes")');
    await expect(page.locator('#quizzesTab')).toBeVisible();
    
    // Switch back to Overview tab
    await page.click('button:has-text("Overview")');
    await expect(page.locator('#overviewTab')).toBeVisible();
  });

  test('should display and toggle daily tasks', async ({ page }) => {
    await page.click('button:has-text("Tasks")');
    await page.waitForSelector('#tasksTab', { state: 'visible' });
    
    // Wait for tasks to load
    await page.waitForTimeout(1000);
    
    // Check for daily tasks section
    await expect(page.locator('.daily-tasks-section')).toBeVisible();
    
    // Try to toggle a daily task
    const dailyTaskCheckbox = page.locator('.daily-task-item input[type="checkbox"]').first();
    if (await dailyTaskCheckbox.isVisible()) {
      const initialState = await dailyTaskCheckbox.isChecked();
      await dailyTaskCheckbox.click();
      await page.waitForTimeout(500);
      
      const newState = await dailyTaskCheckbox.isChecked();
      expect(newState).not.toBe(initialState);
    }
  });

  test('should display and complete pending tasks', async ({ page }) => {
    await page.click('button:has-text("Tasks")');
    await page.waitForSelector('#tasksTab', { state: 'visible' });
    
    // Wait for tasks to load
    await page.waitForTimeout(1000);
    
    // Check for pending tasks section
    await expect(page.locator('.pending-tasks-section')).toBeVisible();
    
    // Try to complete a pending task
    const pendingTaskCheckbox = page.locator('.pending-task-item input[type="checkbox"]').first();
    if (await pendingTaskCheckbox.isVisible()) {
      await pendingTaskCheckbox.click();
      await page.waitForTimeout(500);
      
      // Task should move to completed
      expect(await pendingTaskCheckbox.isChecked()).toBe(true);
    }
  });

  test('should display available quizzes', async ({ page }) => {
    await page.click('button:has-text("Quizzes")');
    await page.waitForSelector('#quizzesTab', { state: 'visible' });
    
    // Wait for quizzes to load
    await page.waitForTimeout(1000);
    
    // Check for available quizzes section
    await expect(page.locator('#availableQuizzesList')).toBeVisible();
  });

  test('should display completed quizzes with scores', async ({ page }) => {
    await page.click('button:has-text("Quizzes")');
    await page.waitForSelector('#quizzesTab', { state: 'visible' });
    
    // Wait for quizzes to load
    await page.waitForTimeout(1000);
    
    // Check for completed quizzes section
    await expect(page.locator('#completedQuizzesList')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if layout adapts to mobile
    await expect(page.locator('.dashboard-container')).toBeVisible();
    
    // Check if hamburger menu is visible
    const hamburgerMenu = page.locator('.hamburger-menu');
    if (await hamburgerMenu.isVisible()) {
      await hamburgerMenu.click();
      await expect(page.locator('.sidebar')).toHaveClass(/active/);
    }
  });
});

