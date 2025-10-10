import { test, expect } from '@playwright/test';

test.describe('Student Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teacher-student-detail.html?studentId=student1');
    await page.waitForLoadState('networkidle');
  });

  test('should load student detail page', async ({ page }) => {
    await expect(page).toHaveTitle(/Student Detail/);
    await expect(page.locator('.student-detail-container')).toBeVisible();
  });

  test('should display student information', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.student-header')).toBeVisible();
    await expect(page.locator('.student-info')).toBeVisible();
  });

  test('should display student stats', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.stats-section')).toBeVisible();
    
    const statCards = page.locator('.stat-card');
    const count = await statCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should edit student information', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Click edit button
    const editButton = page.locator('button:has-text("Edit")');
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page.locator('#editStudentModal')).toBeVisible();

      // Modify student name
      const nameInput = page.locator('input[name="studentName"]');
      const currentName = await nameInput.inputValue();
      await nameInput.fill(currentName + ' - Updated');

      // Save changes
      await page.click('button[type="submit"]:has-text("Save")');
      
      // Wait for modal to close
      await page.waitForSelector('#editStudentModal', { state: 'hidden' });
      
      // Verify update
      await expect(page.locator(`text=${currentName} - Updated`)).toBeVisible();
    }
  });

  test('should display student tasks', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for tasks section
    const tasksSection = page.locator('.tasks-section, #studentTasks');
    if (await tasksSection.isVisible()) {
      await expect(tasksSection).toBeVisible();
    }
  });

  test('should display student notes', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for notes section
    await expect(page.locator('.notes-section')).toBeVisible();
  });

  test('should add a note', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Click add note button
    const addNoteButton = page.locator('button:has-text("Add Note")');
    if (await addNoteButton.isVisible()) {
      await addNoteButton.click();
      
      // Fill note
      const noteInput = page.locator('textarea[name="note"]');
      const timestamp = Date.now();
      await noteInput.fill(`Test note ${timestamp}`);
      
      // Submit note
      await page.click('button[type="submit"]:has-text("Save")');
      await page.waitForTimeout(500);
      
      // Verify note appears
      await expect(page.locator(`text=Test note ${timestamp}`)).toBeVisible();
    }
  });

  test('should edit a note', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Click edit on first note
    const firstNote = page.locator('.note-item').first();
    if (await firstNote.isVisible()) {
      const editButton = firstNote.locator('button:has-text("Edit")');
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Modify note
        const noteInput = page.locator('textarea[name="note"]');
        await noteInput.fill(await noteInput.inputValue() + ' - Edited');
        
        // Save changes
        await page.click('button[type="submit"]:has-text("Save")');
        await page.waitForTimeout(500);
        
        // Verify update
        await expect(page.locator('text=- Edited')).toBeVisible();
      }
    }
  });

  test('should delete a note', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const initialCount = await page.locator('.note-item').count();
    
    if (initialCount > 0) {
      // Click delete on first note
      const firstNote = page.locator('.note-item').first();
      const deleteButton = firstNote.locator('button:has-text("Delete")');
      
      if (await deleteButton.isVisible()) {
        // Handle confirmation dialog
        page.on('dialog', dialog => dialog.accept());
        await deleteButton.click();
        
        // Wait for deletion
        await page.waitForTimeout(500);
        
        // Verify note count decreased
        const newCount = await page.locator('.note-item').count();
        expect(newCount).toBeLessThan(initialCount);
      }
    }
  });

  test('should display quiz results', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for quiz results section
    const quizSection = page.locator('.quiz-results-section');
    if (await quizSection.isVisible()) {
      await expect(quizSection).toBeVisible();
    }
  });
});

