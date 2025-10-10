# Testing Guide

This document explains how to run automated tests for the Waqf application.

## Overview

The application uses [Playwright](https://playwright.dev/) for end-to-end (E2E) testing. All tests are located in the `tests/` directory and cover every feature of the application.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** (comes with Node.js)

## Installation

Install the testing dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

### Run All Tests

To run all tests in headless mode:

```bash
npx playwright test
```

### Run Tests with UI

To run tests and see them execute in a browser:

```bash
npx playwright test --headed
```

### Run Tests in Debug Mode

To debug tests step by step:

```bash
npx playwright test --debug
```

### Run Specific Test File

To run a specific test suite:

```bash
npx playwright test tests/teacher-dashboard.spec.ts
```

### Run Tests in Interactive Mode

To use Playwright's interactive UI mode:

```bash
npx playwright test --ui
```

## Test Coverage

The test suite covers the following areas:

### 1. Teacher Dashboard (`tests/teacher-dashboard.spec.ts`)
- ✅ Dashboard loading and stats display
- ✅ Navigation between sections
- ✅ Students list display
- ✅ Tasks management interface
- ✅ Messages interface
- ✅ Mobile responsiveness

### 2. Student Management (`tests/student-management.spec.ts`)
- ✅ Display students list
- ✅ Add new student
- ✅ View student details
- ✅ Delete student
- ✅ Filter students

### 3. Task Management (`tests/task-management.spec.ts`)
- ✅ Switch between task tabs (one-time/daily)
- ✅ Create one-time task
- ✅ Create daily task
- ✅ Edit task
- ✅ Delete task
- ✅ Filter tasks by category

### 4. Exam Management (`tests/exam-management.spec.ts`)
- ✅ Create multiple choice quiz
- ✅ Create descriptive quiz
- ✅ Create mixed quiz
- ✅ Delete quiz
- ✅ Review pending submissions
- ✅ View quiz results

### 5. Student Dashboard (`tests/student-dashboard.spec.ts`)
- ✅ Dashboard loading and stats
- ✅ Tab navigation
- ✅ Toggle daily tasks
- ✅ Complete pending tasks
- ✅ View available quizzes
- ✅ View completed quizzes
- ✅ Mobile responsiveness

### 6. Student Exam Taking (`tests/student-exam.spec.ts`)
- ✅ Load exam interface
- ✅ Display quiz information and timer
- ✅ Answer multiple choice questions
- ✅ Answer descriptive questions
- ✅ Submit quiz
- ✅ Prevent submission with unanswered questions

### 7. Messaging System (`tests/messaging.spec.ts`)
- ✅ Teacher: Load messages, view chats, send messages
- ✅ Teacher: Display unread badge, mark as read
- ✅ Student: Load chat, send messages

### 8. Daily Overview (`tests/daily-overview.spec.ts`)
- ✅ Display overview table
- ✅ Change date and reload data
- ✅ Toggle task completion
- ✅ Mobile horizontal scroll

### 9. Student List (`tests/student-list.spec.ts`)
- ✅ Display students with stats
- ✅ Navigate to student detail
- ✅ Search/filter functionality
- ✅ Mobile responsiveness

### 10. Student Detail (`tests/student-detail.spec.ts`)
- ✅ Display student information and stats
- ✅ Edit student information
- ✅ Display tasks and notes
- ✅ Add/edit/delete notes
- ✅ Display quiz results

### 11. Full Workflow (`tests/full-workflow.spec.ts`)
- ✅ Complete teacher workflow (add student → create task → create quiz → message)
- ✅ Complete student workflow (view tasks → complete tasks → take quiz → message)
- ✅ Data persistence across page navigation
- ✅ Mobile responsiveness across all pages
- ✅ Error handling for invalid inputs

## Storage Adapter Testing

The application supports multiple storage backends (localStorage, Firebase). You can test with different backends using URL parameters:

### Test with LocalStorage
```bash
# No parameter needed, localStorage is default
http://localhost:8000/teacher-dashboard.html
```

### Test with Firebase
```bash
# Add storage parameter
http://localhost:8000/teacher-dashboard.html?storage=firebase
```

To run tests against a specific storage backend, modify the `baseURL` in `playwright.config.ts` or use environment variables.

## Continuous Integration

Tests automatically run on every push and pull request via GitHub Actions. See `.github/workflows/e2e.yml` for the CI configuration.

## Writing New Tests

To add a new test:

1. Create a new file in `tests/` directory: `tests/my-feature.spec.ts`
2. Import Playwright test utilities:
   ```typescript
   import { test, expect } from '@playwright/test';
   ```
3. Write your test:
   ```typescript
   test.describe('My Feature', () => {
     test('should do something', async ({ page }) => {
       await page.goto('/my-page.html');
       await expect(page.locator('.my-element')).toBeVisible();
     });
   });
   ```

## Debugging Failed Tests

When a test fails:

1. **View the test report:**
   ```bash
   npx playwright show-report
   ```

2. **Run with trace:**
   ```bash
   npx playwright test --trace on
   ```
   Then view the trace:
   ```bash
   npx playwright show-trace trace.zip
   ```

3. **Take screenshots on failure:**
   Tests automatically capture screenshots on failure. Check the `test-results/` directory.

## Test Configuration

Configuration is in `playwright.config.ts`. Key settings:

- `baseURL`: Base URL for tests (default: http://localhost:8000)
- `timeout`: Test timeout (default: 30s)
- `retries`: Number of retries on failure
- `workers`: Number of parallel workers
- `projects`: Browsers to test (Chromium, Firefox, WebKit)

## Local Development Server

Tests expect the application to be running on `http://localhost:8000`. 

Start the development server:

```bash
python -m http.server 8000
```

Or use any other local server of your choice.

## Best Practices

1. **Wait for Elements**: Always wait for elements before interacting:
   ```typescript
   await page.waitForSelector('#myElement', { state: 'visible' });
   ```

2. **Use `waitForLoadState`**: Wait for page to fully load:
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

3. **Handle Dialogs**: Handle browser dialogs (alerts, confirms):
   ```typescript
   page.on('dialog', dialog => dialog.accept());
   ```

4. **Use Test Data**: Create unique test data using timestamps:
   ```typescript
   const timestamp = Date.now();
   const name = `Test User ${timestamp}`;
   ```

5. **Clean Up**: Tests should be independent and not rely on data from previous tests.

## Troubleshooting

### Tests Failing Locally

1. **Check if server is running**: Ensure `http://localhost:8000` is accessible
2. **Clear browser data**: Run with `--headed` to see what's happening
3. **Update browsers**: `npx playwright install`
4. **Check storage**: Clear localStorage/Firebase data if tests are interfering

### Tests Passing Locally but Failing in CI

1. **Check timing issues**: Add appropriate waits
2. **Check network**: CI might be slower, increase timeouts
3. **Check environment**: Ensure CI has access to required services

## Support

For issues or questions about testing:
1. Check [Playwright documentation](https://playwright.dev/)
2. Review test examples in `tests/` directory
3. Check CI logs in GitHub Actions

## Summary

This comprehensive test suite ensures that every feature of the Waqf application works correctly:
- ✅ All CRUD operations (Create, Read, Update, Delete)
- ✅ Navigation and UI interactions
- ✅ Data persistence
- ✅ Mobile responsiveness
- ✅ Error handling
- ✅ Full user workflows

Run tests regularly during development to catch issues early!

