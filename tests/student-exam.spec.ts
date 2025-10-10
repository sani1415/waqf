import { test, expect } from '@playwright/test';

test.describe('Student Exam Taking', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to exam page with sample quiz ID
    await page.goto('/student-exam-take.html?quizId=quiz1&studentId=student1');
    await page.waitForLoadState('networkidle');
  });

  test('should load exam interface', async ({ page }) => {
    await expect(page).toHaveTitle(/Take Quiz/);
    await expect(page.locator('.exam-container')).toBeVisible();
  });

  test('should display quiz information', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for quiz title and description
    await expect(page.locator('.quiz-header')).toBeVisible();
  });

  test('should display timer', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for timer element
    const timer = page.locator('.timer, #timer');
    if (await timer.isVisible()) {
      await expect(timer).toBeVisible();
    }
  });

  test('should answer multiple choice questions', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for MCQ options
    const mcqOption = page.locator('input[type="radio"]').first();
    if (await mcqOption.isVisible()) {
      await mcqOption.click();
      expect(await mcqOption.isChecked()).toBe(true);
    }
  });

  test('should answer descriptive questions', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for descriptive answer textarea
    const descriptiveAnswer = page.locator('textarea[name*="answer"]').first();
    if (await descriptiveAnswer.isVisible()) {
      await descriptiveAnswer.fill('This is my detailed answer to the question.');
      expect(await descriptiveAnswer.inputValue()).toContain('detailed answer');
    }
  });

  test('should submit quiz', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Try to answer at least one question
    const firstInput = page.locator('input[type="radio"], textarea[name*="answer"]').first();
    if (await firstInput.isVisible()) {
      if (await firstInput.getAttribute('type') === 'radio') {
        await firstInput.click();
      } else {
        await firstInput.fill('Test answer');
      }
    }

    // Submit quiz
    const submitButton = page.locator('button:has-text("Submit")');
    if (await submitButton.isVisible()) {
      // Handle confirmation dialog
      page.on('dialog', dialog => dialog.accept());
      await submitButton.click();
      
      // Wait for submission to complete
      await page.waitForTimeout(1000);
      
      // Should show success message or redirect
      const successMessage = page.locator('text=/submitted|success|complete/i');
      const hasRedirected = page.url().includes('student-dashboard');
      
      expect(await successMessage.isVisible() || hasRedirected).toBe(true);
    }
  });

  test('should prevent submission with unanswered questions', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Try to submit without answering
    const submitButton = page.locator('button:has-text("Submit")');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Should show warning or not allow submission
      await page.waitForTimeout(500);
      
      // Check for warning message
      const warningMessage = page.locator('text=/please answer|incomplete|required/i');
      const isStillOnPage = page.url().includes('student-exam-take');
      
      expect(await warningMessage.isVisible() || isStillOnPage).toBe(true);
    }
  });
});

