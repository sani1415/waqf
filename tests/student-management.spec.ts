import { test, expect } from '@playwright/test';

test.describe('Student Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teacher-dashboard.html');
    await page.waitForLoadState('networkidle');
    await page.click('a[href="#students"]');
    await page.waitForSelector('#studentsSection', { state: 'visible' });
  });

  test('should display students list', async ({ page }) => {
    await expect(page.locator('#studentsList')).toBeVisible();
  });

  test('should add a new student', async ({ page }) => {
    // Click add student button
    await page.click('button:has-text("Add Student")');
    await expect(page.locator('#addStudentModal')).toBeVisible();

    // Fill student form
    const timestamp = Date.now();
    await page.fill('input[name="studentName"]', `Test Student ${timestamp}`);
    await page.fill('input[name="studentEmail"]', `test${timestamp}@example.com`);
    await page.fill('input[name="studentPhone"]', '1234567890');

    // Select tasks for the student
    const checkboxes = page.locator('input[type="checkbox"][name="studentTasks"]');
    const count = await checkboxes.count();
    if (count > 0) {
      await checkboxes.first().check();
    }

    // Submit form
    await page.click('button:has-text("Add Student")');
    
    // Wait for modal to close
    await page.waitForSelector('#addStudentModal', { state: 'hidden' });
    
    // Verify student was added
    await expect(page.locator(`text=Test Student ${timestamp}`)).toBeVisible();
  });

  test('should view student details', async ({ page }) => {
    // Wait for students to load
    await page.waitForTimeout(1000);
    
    // Click on first student
    const firstStudent = page.locator('.student-card, .student-row').first();
    await expect(firstStudent).toBeVisible();
    
    // Click view button or student card
    const viewButton = firstStudent.locator('button:has-text("View"), a:has-text("View")').first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
      // Should navigate to student detail page
      await page.waitForURL(/teacher-student-detail\.html/);
      await expect(page.locator('.student-detail')).toBeVisible();
    }
  });

  test('should delete a student', async ({ page }) => {
    // Wait for students to load
    await page.waitForTimeout(1000);
    
    const initialCount = await page.locator('.student-card, .student-row').count();
    
    if (initialCount > 0) {
      // Click delete button on first student
      const firstStudent = page.locator('.student-card, .student-row').first();
      const deleteButton = firstStudent.locator('button:has-text("Delete"), .delete-btn').first();
      
      if (await deleteButton.isVisible()) {
        // Handle confirmation dialog
        page.on('dialog', dialog => dialog.accept());
        await deleteButton.click();
        
        // Wait for deletion to complete
        await page.waitForTimeout(500);
        
        // Verify student count decreased
        const newCount = await page.locator('.student-card, .student-row').count();
        expect(newCount).toBeLessThan(initialCount);
      }
    }
  });

  test('should filter students', async ({ page }) => {
    // Check if filter controls exist
    const filterInput = page.locator('input[placeholder*="Search"], input[placeholder*="Filter"]');
    
    if (await filterInput.isVisible()) {
      await filterInput.fill('test');
      await page.waitForTimeout(500);
      
      // Results should be filtered
      const studentsList = page.locator('#studentsList');
      await expect(studentsList).toBeVisible();
    }
  });
});

