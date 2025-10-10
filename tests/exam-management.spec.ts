import { test, expect } from '@playwright/test';

test.describe('Exam Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teacher-exams.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load exams page', async ({ page }) => {
    await expect(page).toHaveTitle(/Exams/);
    await expect(page.locator('.exams-container')).toBeVisible();
  });

  test('should display exams management tabs', async ({ page }) => {
    await expect(page.locator('.tabs-nav')).toBeVisible();
    
    // Check for tabs
    await expect(page.locator('button:has-text("Manage Quizzes")')).toBeVisible();
    await expect(page.locator('button:has-text("Review Submissions")')).toBeVisible();
    await expect(page.locator('button:has-text("Results")')).toBeVisible();
  });

  test('should create a multiple choice quiz', async ({ page }) => {
    // Click create quiz button
    await page.click('button:has-text("Create Quiz")');
    await expect(page.locator('#createQuizModal')).toBeVisible();

    // Fill quiz details
    const timestamp = Date.now();
    await page.fill('input[name="quizName"]', `MCQ Quiz ${timestamp}`);
    await page.fill('textarea[name="quizDescription"]', 'Multiple choice quiz');
    await page.selectOption('select[name="quizType"]', 'multiple-choice');
    await page.fill('input[name="quizDuration"]', '30');

    // Select students
    const checkboxes = page.locator('input[type="checkbox"][name="quizStudents"]');
    const count = await checkboxes.count();
    if (count > 0) {
      await checkboxes.first().check();
    }

    // Add questions
    await page.click('button:has-text("Add Question")');
    await page.fill('input[name="question1"]', 'What is 2+2?');
    await page.fill('input[name="option1A"]', '3');
    await page.fill('input[name="option1B"]', '4');
    await page.fill('input[name="option1C"]', '5');
    await page.fill('input[name="option1D"]', '6');
    await page.selectOption('select[name="correctOption1"]', 'B');

    // Submit quiz
    await page.click('button[type="submit"]:has-text("Create Quiz")');
    
    // Wait for modal to close
    await page.waitForSelector('#createQuizModal', { state: 'hidden' });
    
    // Verify quiz was created
    await expect(page.locator(`text=MCQ Quiz ${timestamp}`)).toBeVisible();
  });

  test('should create a descriptive quiz', async ({ page }) => {
    // Click create quiz button
    await page.click('button:has-text("Create Quiz")');
    await expect(page.locator('#createQuizModal')).toBeVisible();

    // Fill quiz details
    const timestamp = Date.now();
    await page.fill('input[name="quizName"]', `Descriptive Quiz ${timestamp}`);
    await page.fill('textarea[name="quizDescription"]', 'Essay type quiz');
    await page.selectOption('select[name="quizType"]', 'descriptive');
    await page.fill('input[name="quizDuration"]', '60');

    // Select students
    const checkboxes = page.locator('input[type="checkbox"][name="quizStudents"]');
    const count = await checkboxes.count();
    if (count > 0) {
      await checkboxes.first().check();
    }

    // Add questions
    await page.click('button:has-text("Add Question")');
    await page.fill('input[name="question1"]', 'Explain the water cycle');
    await page.fill('input[name="maxMarks1"]', '10');

    // Submit quiz
    await page.click('button[type="submit"]:has-text("Create Quiz")');
    
    // Wait for modal to close
    await page.waitForSelector('#createQuizModal', { state: 'hidden' });
    
    // Verify quiz was created
    await expect(page.locator(`text=Descriptive Quiz ${timestamp}`)).toBeVisible();
  });

  test('should create a mixed quiz', async ({ page }) => {
    // Click create quiz button
    await page.click('button:has-text("Create Quiz")');
    await expect(page.locator('#createQuizModal')).toBeVisible();

    // Fill quiz details
    const timestamp = Date.now();
    await page.fill('input[name="quizName"]', `Mixed Quiz ${timestamp}`);
    await page.fill('textarea[name="quizDescription"]', 'Mixed type quiz');
    await page.selectOption('select[name="quizType"]', 'mixed');
    await page.fill('input[name="quizDuration"]', '45');

    // Select students
    const checkboxes = page.locator('input[type="checkbox"][name="quizStudents"]');
    const count = await checkboxes.count();
    if (count > 0) {
      await checkboxes.first().check();
    }

    // Add MCQ question
    await page.click('button:has-text("Add MCQ")');
    await page.fill('input[name="question1"]', 'What is 5+5?');
    await page.fill('input[name="option1A"]', '8');
    await page.fill('input[name="option1B"]', '9');
    await page.fill('input[name="option1C"]', '10');
    await page.fill('input[name="option1D"]', '11');
    await page.selectOption('select[name="correctOption1"]', 'C');

    // Add descriptive question
    await page.click('button:has-text("Add Descriptive")');
    await page.fill('input[name="question2"]', 'Describe photosynthesis');
    await page.fill('input[name="maxMarks2"]', '15');

    // Submit quiz
    await page.click('button[type="submit"]:has-text("Create Quiz")');
    
    // Wait for modal to close
    await page.waitForSelector('#createQuizModal', { state: 'hidden' });
    
    // Verify quiz was created
    await expect(page.locator(`text=Mixed Quiz ${timestamp}`)).toBeVisible();
  });

  test('should delete a quiz', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const initialCount = await page.locator('.quiz-card').count();
    
    if (initialCount > 0) {
      // Click delete button on first quiz
      const firstQuiz = page.locator('.quiz-card').first();
      const deleteButton = firstQuiz.locator('button:has-text("Delete")');
      
      if (await deleteButton.isVisible()) {
        // Handle confirmation dialog
        page.on('dialog', dialog => dialog.accept());
        await deleteButton.click();
        
        // Wait for deletion to complete
        await page.waitForTimeout(500);
        
        // Verify quiz count decreased
        const newCount = await page.locator('.quiz-card').count();
        expect(newCount).toBeLessThan(initialCount);
      }
    }
  });

  test('should review pending submissions', async ({ page }) => {
    // Switch to Review tab
    await page.click('button:has-text("Review Submissions")');
    await page.waitForSelector('#reviewTab', { state: 'visible' });
    
    await expect(page.locator('#reviewTab')).toBeVisible();
    
    // Check for pending reviews list
    await expect(page.locator('#pendingReviewsList')).toBeVisible();
  });

  test('should view quiz results', async ({ page }) => {
    // Switch to Results tab
    await page.click('button:has-text("Results")');
    await page.waitForSelector('#resultsTab', { state: 'visible' });
    
    await expect(page.locator('#resultsTab')).toBeVisible();
    
    // Select a quiz to view results
    const quizSelector = page.locator('select[name="quizSelector"]');
    if (await quizSelector.isVisible()) {
      await quizSelector.selectOption({ index: 0 });
      await page.waitForTimeout(500);
      
      // Results should be displayed
      await expect(page.locator('#quizResultsContainer')).toBeVisible();
    }
  });
});

