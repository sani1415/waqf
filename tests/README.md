# Automated Test Suite

This directory contains comprehensive end-to-end tests for the entire Waqf application.

## Quick Start

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run all tests
npx playwright test

# Run with UI
npx playwright test --headed

# Run specific test
npx playwright test tests/teacher-dashboard.spec.ts
```

## Test Files

| File | Description | Coverage |
|------|-------------|----------|
| `teacher-dashboard.spec.ts` | Teacher dashboard tests | Stats, navigation, sections, mobile UI |
| `student-management.spec.ts` | Student CRUD operations | Add, view, edit, delete, filter students |
| `task-management.spec.ts` | Task CRUD operations | Create, edit, delete one-time/daily tasks |
| `exam-management.spec.ts` | Quiz CRUD operations | Create MCQ/descriptive/mixed quizzes |
| `student-dashboard.spec.ts` | Student dashboard tests | Tasks, quizzes, stats, navigation |
| `student-exam.spec.ts` | Quiz taking tests | Answer questions, submit, validation |
| `messaging.spec.ts` | Messaging system tests | Teacher/student chat, send messages |
| `daily-overview.spec.ts` | Daily overview tests | View tasks, toggle completion, date selection |
| `student-list.spec.ts` | Student list tests | Display, search, navigation |
| `student-detail.spec.ts` | Student detail tests | View, edit, notes, quiz results |
| `full-workflow.spec.ts` | End-to-end workflows | Complete teacher/student workflows |

## What's Tested

### ✅ Data Operations
- Creating data (students, tasks, quizzes, messages, notes)
- Reading/viewing data
- Updating/editing data
- Deleting data
- Filtering and searching

### ✅ User Interactions
- Button clicks
- Form submissions
- Checkbox toggles
- Tab switching
- Modal open/close
- Navigation between pages

### ✅ Data Persistence
- Data survives page refresh
- Data survives navigation
- Storage adapter functionality

### ✅ Responsive Design
- Mobile viewport (375x667)
- Hamburger menu functionality
- Sidebar open/close
- Horizontal scrolling for tables
- Touch interactions

### ✅ Error Handling
- Invalid inputs
- Missing data
- Network issues
- Empty states

### ✅ User Workflows
- Complete teacher workflow: Add student → Create task → Create quiz → Message
- Complete student workflow: View tasks → Complete tasks → Take quiz → Message
- Cross-page interactions
- Multi-step processes

## Test Results

Tests automatically run on:
- Every push to GitHub
- Every pull request
- Can be triggered manually

View results in GitHub Actions tab.

## For Developers

See [TESTING.md](../TESTING.md) for detailed documentation on:
- Running specific tests
- Debugging failed tests
- Writing new tests
- Configuration options
- Best practices

## Coverage Summary

**Total Tests**: 80+
**Total Test Suites**: 11
**Pages Covered**: 10+
**Features Tested**: 50+

Every user-facing feature is tested automatically!

