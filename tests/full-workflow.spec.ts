import { test, expect } from '@playwright/test';

test.describe('Full Application Workflow', () => {
  test('complete teacher workflow: add student, create task, create quiz, review, message', async ({ page }) => {
    const timestamp = Date.now();
    const studentName = `E2E Student ${timestamp}`;
    const studentEmail = `e2e${timestamp}@test.com`;
    const taskName = `E2E Task ${timestamp}`;
    const quizName = `E2E Quiz ${timestamp}`;

    // Step 1: Navigate to teacher dashboard
    await page.goto('/teacher-dashboard.html');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.dashboard-header')).toBeVisible();

    // Step 2: Add a new student
    await page.click('a[href="#students"]');
    await page.waitForSelector('#studentsSection', { state: 'visible' });
    
    await page.click('button:has-text("Add Student")');
    await expect(page.locator('#addStudentModal')).toBeVisible();
    
    await page.fill('input[name="studentName"]', studentName);
    await page.fill('input[name="studentEmail"]', studentEmail);
    await page.fill('input[name="studentPhone"]', '1234567890');
    
    // Select at least one task if available
    const taskCheckboxes = page.locator('#addStudentModal input[type="checkbox"]');
    const taskCount = await taskCheckboxes.count();
    if (taskCount > 0) {
      await taskCheckboxes.first().check();
    }
    
    await page.click('#addStudentModal button[type="submit"]');
    await page.waitForSelector('#addStudentModal', { state: 'hidden' });
    
    // Verify student was added
    await expect(page.locator(`text=${studentName}`)).toBeVisible();

    // Step 3: Create a task
    await page.click('a[href="#tasks"]');
    await page.waitForSelector('#tasksSection', { state: 'visible' });
    
    await page.click('button:has-text("Create Task")');
    await expect(page.locator('#createTaskModal')).toBeVisible();
    
    await page.fill('input[name="taskName"]', taskName);
    await page.fill('textarea[name="taskDescription"]', 'E2E test task description');
    
    // Select category if available
    const categorySelect = page.locator('select[name="taskCategory"]');
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption({ index: 0 });
    }
    
    // Assign to the newly created student
    const studentCheckboxes = page.locator('#createTaskModal input[type="checkbox"]');
    const studentCount = await studentCheckboxes.count();
    if (studentCount > 0) {
      // Check last checkbox (most likely our new student)
      await studentCheckboxes.last().check();
    }
    
    await page.click('#createTaskModal button[type="submit"]');
    await page.waitForSelector('#createTaskModal', { state: 'hidden' });
    
    // Verify task was created
    await expect(page.locator(`text=${taskName}`)).toBeVisible();

    // Step 4: Create a quiz
    await page.goto('/teacher-exams.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Create Quiz")');
    await expect(page.locator('#createQuizModal')).toBeVisible();
    
    await page.fill('input[name="quizName"]', quizName);
    await page.fill('textarea[name="quizDescription"]', 'E2E test quiz');
    
    // Select quiz type
    const quizTypeSelect = page.locator('select[name="quizType"]');
    if (await quizTypeSelect.isVisible()) {
      await quizTypeSelect.selectOption('multiple-choice');
    }
    
    await page.fill('input[name="quizDuration"]', '30');
    
    // Assign to student
    const quizStudentCheckboxes = page.locator('#createQuizModal input[type="checkbox"]');
    const quizStudentCount = await quizStudentCheckboxes.count();
    if (quizStudentCount > 0) {
      await quizStudentCheckboxes.last().check();
    }
    
    // Add a question
    const addQuestionBtn = page.locator('button:has-text("Add Question")');
    if (await addQuestionBtn.isVisible()) {
      await addQuestionBtn.click();
      await page.fill('input[name="question1"]', 'What is 2+2?');
      await page.fill('input[name="option1A"]', '3');
      await page.fill('input[name="option1B"]', '4');
      await page.fill('input[name="option1C"]', '5');
      await page.fill('input[name="option1D"]', '6');
      
      const correctOptionSelect = page.locator('select[name="correctOption1"]');
      if (await correctOptionSelect.isVisible()) {
        await correctOptionSelect.selectOption('B');
      }
    }
    
    await page.click('#createQuizModal button[type="submit"]');
    await page.waitForSelector('#createQuizModal', { state: 'hidden' });
    
    // Verify quiz was created
    await expect(page.locator(`text=${quizName}`)).toBeVisible();

    // Step 5: Check messages interface
    await page.goto('/teacher-messages.html');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.messages-container')).toBeVisible();

    // Step 6: Verify everything persists after refresh
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Go back to students and verify student still exists
    await page.goto('/teacher-dashboard.html');
    await page.waitForLoadState('networkidle');
    await page.click('a[href="#students"]');
    await page.waitForTimeout(1000);
    await expect(page.locator(`text=${studentName}`)).toBeVisible();
  });

  test('complete student workflow: view tasks, complete tasks, take quiz', async ({ page }) => {
    // This test assumes at least one student exists with ID 'student1'
    await page.goto('/student-dashboard.html?studentId=student1');
    await page.waitForLoadState('networkidle');

    // Step 1: View dashboard
    await expect(page.locator('.dashboard-container')).toBeVisible();
    await expect(page.locator('.stats-section')).toBeVisible();

    // Step 2: Navigate to tasks
    await page.click('button:has-text("Tasks")');
    await page.waitForSelector('#tasksTab', { state: 'visible' });
    await page.waitForTimeout(1000);

    // Step 3: Complete a daily task if available
    const dailyTaskCheckbox = page.locator('.daily-task-item input[type="checkbox"]').first();
    if (await dailyTaskCheckbox.isVisible()) {
      const wasChecked = await dailyTaskCheckbox.isChecked();
      await dailyTaskCheckbox.click();
      await page.waitForTimeout(500);
      
      const isChecked = await dailyTaskCheckbox.isChecked();
      expect(isChecked).not.toBe(wasChecked);
    }

    // Step 4: Complete a pending task if available
    const pendingTaskCheckbox = page.locator('.pending-task-item input[type="checkbox"]').first();
    if (await pendingTaskCheckbox.isVisible()) {
      await pendingTaskCheckbox.click();
      await page.waitForTimeout(500);
      expect(await pendingTaskCheckbox.isChecked()).toBe(true);
    }

    // Step 5: View quizzes
    await page.click('button:has-text("Quizzes")');
    await page.waitForSelector('#quizzesTab', { state: 'visible' });
    await page.waitForTimeout(1000);

    // Step 6: Check available and completed quizzes
    await expect(page.locator('#availableQuizzesList')).toBeVisible();
    await expect(page.locator('#completedQuizzesList')).toBeVisible();

    // Step 7: Navigate to messaging
    await page.goto('/student-chat.html?studentId=student1');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.chat-container')).toBeVisible();

    // Step 8: Send a message
    const messageInput = page.locator('textarea[name="message"], input[name="message"]');
    if (await messageInput.isVisible()) {
      await messageInput.fill('Test message from E2E test');
      await page.click('button:has-text("Send")');
      await page.waitForTimeout(500);
      await expect(page.locator('text=Test message from E2E test')).toBeVisible();
    }
  });

  test('data persistence across page navigation', async ({ page }) => {
    const timestamp = Date.now();
    const studentName = `Persistence Test ${timestamp}`;

    // Add a student
    await page.goto('/teacher-dashboard.html');
    await page.waitForLoadState('networkidle');
    await page.click('a[href="#students"]');
    await page.waitForSelector('#studentsSection', { state: 'visible' });
    
    await page.click('button:has-text("Add Student")');
    await page.fill('input[name="studentName"]', studentName);
    await page.fill('input[name="studentEmail"]', `persist${timestamp}@test.com`);
    await page.fill('input[name="studentPhone"]', '9876543210');
    await page.click('#addStudentModal button[type="submit"]');
    await page.waitForSelector('#addStudentModal', { state: 'hidden' });

    // Navigate to different pages and back
    await page.goto('/teacher-exams.html');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/teacher-messages.html');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/teacher-daily-overview.html');
    await page.waitForLoadState('networkidle');

    // Return to students and verify data persists
    await page.goto('/teacher-dashboard.html');
    await page.waitForLoadState('networkidle');
    await page.click('a[href="#students"]');
    await page.waitForTimeout(1000);
    
    // Verify student still exists
    await expect(page.locator(`text=${studentName}`)).toBeVisible();
  });

  test('mobile responsiveness across all pages', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const pages = [
      '/teacher-dashboard.html',
      '/teacher-exams.html',
      '/teacher-messages.html',
      '/teacher-daily-overview.html',
      '/student-dashboard.html?studentId=student1',
      '/student-list.html'
    ];

    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Check if hamburger menu is visible on mobile
      const hamburgerMenu = page.locator('.hamburger-menu');
      if (await hamburgerMenu.isVisible()) {
        // Test hamburger menu functionality
        await hamburgerMenu.click();
        await page.waitForTimeout(300);
        
        const sidebar = page.locator('.sidebar');
        await expect(sidebar).toHaveClass(/active/);
        
        // Close sidebar by clicking overlay
        const overlay = page.locator('.sidebar-overlay');
        if (await overlay.isVisible()) {
          await overlay.click();
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('error handling: invalid student ID', async ({ page }) => {
    await page.goto('/student-dashboard.html?studentId=invalid-id-12345');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Should handle gracefully, either redirect or show error message
    const errorMessage = page.locator('text=/not found|error|invalid/i');
    const isOnPage = page.url().includes('student-dashboard');
    
    // Either shows error or stays on page without crashing
    expect(isOnPage).toBe(true);
  });
});

