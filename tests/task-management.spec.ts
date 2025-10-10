import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teacher-dashboard.html');
    await page.waitForLoadState('networkidle');
    await page.click('a[href="#tasks"]');
    await page.waitForSelector('#tasksSection', { state: 'visible' });
  });

  test('should display tasks management interface', async ({ page }) => {
    await expect(page.locator('#tasksSection')).toBeVisible();
    await expect(page.locator('#manageTaskTabs')).toBeVisible();
  });

  test('should switch between task tabs', async ({ page }) => {
    // Switch to One-Time Tasks
    await page.click('button[onclick="switchManageTaskTab(\'oneTime\')"]');
    await expect(page.locator('#oneTimeTasksList')).toBeVisible();
    
    // Switch to Daily Tasks
    await page.click('button[onclick="switchManageTaskTab(\'daily\')"]');
    await expect(page.locator('#dailyTasksList')).toBeVisible();
  });

  test('should create a one-time task', async ({ page }) => {
    await page.click('button[onclick="switchManageTaskTab(\'oneTime\')"]');
    
    // Click create task button
    await page.click('button:has-text("Create Task")');
    await expect(page.locator('#createTaskModal')).toBeVisible();

    // Fill task form
    const timestamp = Date.now();
    await page.fill('input[name="taskName"]', `Test Task ${timestamp}`);
    await page.fill('textarea[name="taskDescription"]', 'Test task description');
    
    // Select task category
    await page.selectOption('select[name="taskCategory"]', { index: 0 });
    
    // Select students
    const checkboxes = page.locator('input[type="checkbox"][name="taskStudents"]');
    const count = await checkboxes.count();
    if (count > 0) {
      await checkboxes.first().check();
    }

    // Submit form
    await page.click('button[type="submit"]:has-text("Create")');
    
    // Wait for modal to close
    await page.waitForSelector('#createTaskModal', { state: 'hidden' });
    
    // Verify task was created
    await expect(page.locator(`text=Test Task ${timestamp}`)).toBeVisible();
  });

  test('should create a daily task', async ({ page }) => {
    await page.click('button[onclick="switchManageTaskTab(\'daily\')"]');
    
    // Click create task button
    await page.click('button:has-text("Create Task")');
    await expect(page.locator('#createTaskModal')).toBeVisible();

    // Fill task form
    const timestamp = Date.now();
    await page.fill('input[name="taskName"]', `Daily Task ${timestamp}`);
    await page.fill('textarea[name="taskDescription"]', 'Daily task description');
    
    // Select daily task type
    await page.check('input[name="isDaily"]');
    
    // Select students
    const checkboxes = page.locator('input[type="checkbox"][name="taskStudents"]');
    const count = await checkboxes.count();
    if (count > 0) {
      await checkboxes.first().check();
    }

    // Submit form
    await page.click('button[type="submit"]:has-text("Create")');
    
    // Wait for modal to close
    await page.waitForSelector('#createTaskModal', { state: 'hidden' });
    
    // Verify task was created
    await expect(page.locator(`text=Daily Task ${timestamp}`)).toBeVisible();
  });

  test('should edit a task', async ({ page }) => {
    await page.click('button[onclick="switchManageTaskTab(\'oneTime\')"]');
    await page.waitForTimeout(1000);
    
    // Click edit button on first task
    const firstTask = page.locator('.task-card').first();
    if (await firstTask.isVisible()) {
      const editButton = firstTask.locator('button:has-text("Edit")');
      if (await editButton.isVisible()) {
        await editButton.click();
        await expect(page.locator('#editTaskModal')).toBeVisible();

        // Modify task name
        const nameInput = page.locator('#editTaskModal input[name="taskName"]');
        await nameInput.fill(await nameInput.inputValue() + ' - Edited');

        // Submit changes
        await page.click('#editTaskModal button[type="submit"]:has-text("Update")');
        
        // Wait for modal to close
        await page.waitForSelector('#editTaskModal', { state: 'hidden' });
        
        // Verify task was updated
        await expect(page.locator('text=- Edited')).toBeVisible();
      }
    }
  });

  test('should delete a task', async ({ page }) => {
    await page.click('button[onclick="switchManageTaskTab(\'oneTime\')"]');
    await page.waitForTimeout(1000);
    
    const initialCount = await page.locator('.task-card').count();
    
    if (initialCount > 0) {
      // Click delete button on first task
      const firstTask = page.locator('.task-card').first();
      const deleteButton = firstTask.locator('button:has-text("Delete")');
      
      if (await deleteButton.isVisible()) {
        // Handle confirmation dialog
        page.on('dialog', dialog => dialog.accept());
        await deleteButton.click();
        
        // Wait for deletion to complete
        await page.waitForTimeout(500);
        
        // Verify task count decreased
        const newCount = await page.locator('.task-card').count();
        expect(newCount).toBeLessThan(initialCount);
      }
    }
  });

  test('should filter tasks by category', async ({ page }) => {
    await page.click('button[onclick="switchManageTaskTab(\'oneTime\')"]');
    await page.waitForTimeout(1000);
    
    // Check if filter buttons exist
    const filterButton = page.locator('button[onclick*="applyTaskFilter"]').first();
    
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // Verify filtered results
      await expect(page.locator('#oneTimeTasksList')).toBeVisible();
    }
  });
});

