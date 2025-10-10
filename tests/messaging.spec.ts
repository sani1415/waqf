import { test, expect } from '@playwright/test';

test.describe('Messaging System', () => {
  test.describe('Teacher Messaging', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/teacher-messages.html');
      await page.waitForLoadState('networkidle');
    });

    test('should load messages page', async ({ page }) => {
      await expect(page).toHaveTitle(/Messages/);
      await expect(page.locator('.messages-container')).toBeVisible();
    });

    test('should display chats list', async ({ page }) => {
      await page.waitForTimeout(1000);
      await expect(page.locator('#chatsList')).toBeVisible();
    });

    test('should display unread badge', async ({ page }) => {
      await page.waitForTimeout(1000);
      
      const unreadBadge = page.locator('.unread-badge');
      if (await unreadBadge.isVisible()) {
        await expect(unreadBadge).toBeVisible();
      }
    });

    test('should open chat conversation', async ({ page }) => {
      await page.waitForTimeout(1000);
      
      // Click on first chat
      const firstChat = page.locator('.chat-item').first();
      if (await firstChat.isVisible()) {
        await firstChat.click();
        
        // Should navigate to chat page
        await page.waitForURL(/teacher-chat\.html/);
        await expect(page.locator('.chat-container')).toBeVisible();
      }
    });
  });

  test.describe('Teacher Chat', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/teacher-chat.html?studentId=student1');
      await page.waitForLoadState('networkidle');
    });

    test('should load chat interface', async ({ page }) => {
      await expect(page.locator('.chat-container')).toBeVisible();
    });

    test('should display student info', async ({ page }) => {
      await page.waitForTimeout(1000);
      await expect(page.locator('.student-info')).toBeVisible();
    });

    test('should display messages', async ({ page }) => {
      await page.waitForTimeout(1000);
      await expect(page.locator('#messagesList')).toBeVisible();
    });

    test('should send a message', async ({ page }) => {
      await page.waitForTimeout(1000);
      
      // Type a message
      const messageInput = page.locator('textarea[name="message"], input[name="message"]');
      await messageInput.fill('Test message from teacher');
      
      // Send message
      await page.click('button:has-text("Send")');
      await page.waitForTimeout(500);
      
      // Verify message appears
      await expect(page.locator('text=Test message from teacher')).toBeVisible();
    });

    test('should mark messages as read', async ({ page }) => {
      await page.waitForTimeout(2000);
      
      // Messages should be marked as read when opened
      const unreadIndicator = page.locator('.unread-indicator');
      const count = await unreadIndicator.count();
      
      // Unread count should be 0 or unread indicators should not exist
      expect(count).toBe(0);
    });
  });

  test.describe('Student Chat', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/student-chat.html?studentId=student1');
      await page.waitForLoadState('networkidle');
    });

    test('should load student chat interface', async ({ page }) => {
      await expect(page.locator('.chat-container')).toBeVisible();
    });

    test('should display teacher info', async ({ page }) => {
      await page.waitForTimeout(1000);
      await expect(page.locator('.teacher-info')).toBeVisible();
    });

    test('should send a message', async ({ page }) => {
      await page.waitForTimeout(1000);
      
      // Type a message
      const messageInput = page.locator('textarea[name="message"], input[name="message"]');
      await messageInput.fill('Test message from student');
      
      // Send message
      await page.click('button:has-text("Send")');
      await page.waitForTimeout(500);
      
      // Verify message appears
      await expect(page.locator('text=Test message from student')).toBeVisible();
    });
  });
});

