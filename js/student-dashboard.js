// Student Dashboard JavaScript

let currentStudent = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeStudentDashboard();
    setupMobileMenu();
    updateUnreadBadge();
    
    // Update unread badge every 5 seconds
    setInterval(updateUnreadBadge, 5000);
});

// Update Unread Badge
function updateUnreadBadge() {
    if (!currentStudent) return;
    
    const unreadCount = dataManager.getUnreadCount(currentStudent.id, 'student');
    const badge = document.getElementById('unreadBadge');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Initialize Student Dashboard
function initializeStudentDashboard() {
    // Get current student ID from sessionStorage
    const studentId = sessionStorage.getItem('currentStudentId');

    if (!studentId) {
        // Redirect to student list if no student selected
        window.location.href = 'student-list.html';
        return;
    }

    currentStudent = dataManager.getStudentById(parseInt(studentId));

    if (!currentStudent) {
        alert('Student not found!');
        window.location.href = 'student-list.html';
        return;
    }

    // Load student data
    loadStudentProfile();
    loadStudentStats();
    loadStudentTasks();
}

// Load Student Profile
function loadStudentProfile() {
    const initial = currentStudent.name.charAt(0).toUpperCase();
    
    // Update profile in sidebar
    document.querySelector('.student-profile-avatar').textContent = initial;
    const sidebarName = document.getElementById('studentNameSidebar');
    const sidebarRole = document.getElementById('studentRole');
    const headerName = document.getElementById('studentNameHeader');
    
    if (sidebarName) sidebarName.textContent = currentStudent.name;
    if (sidebarRole) sidebarRole.textContent = currentStudent.email || 'Student';
    if (headerName) headerName.textContent = `Welcome, ${currentStudent.name.split(' ')[0]}!`;
}

// Load Student Stats
function loadStudentStats() {
    const stats = dataManager.getStudentStats(currentStudent.id);

    // Update daily progress bar
    updateDailyProgressBar(stats);
    
    // Update one-time progress bar
    updateOneTimeProgressBar(stats);
    
    // Update quiz stats
    updateQuizStats(currentStudent.id);
}

// Update Daily Progress Bar
function updateDailyProgressBar(stats) {
    const dailyTotal = stats.dailyTotal || 0;
    const dailyCompleted = stats.dailyCompletedToday || 0;
    const dailyPending = stats.dailyPendingToday || 0;
    const dailyPercentage = dailyTotal > 0 ? Math.round((dailyCompleted / dailyTotal) * 100) : 0;
    
    // Update progress bar
    const progressBar = document.getElementById('dailyProgressBar');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = dailyPercentage + '%';
        }, 100);
    }
    
    // Update percentage text
    const percentText = document.getElementById('dailyProgressPercent');
    if (percentText) {
        percentText.textContent = dailyPercentage + '%';
    }
    
    // Update stats
    const totalStat = document.getElementById('dailyTotalStat');
    const completedStat = document.getElementById('dailyCompletedStat');
    const pendingStat = document.getElementById('dailyPendingStat');
    
    if (totalStat) totalStat.textContent = dailyTotal;
    if (completedStat) completedStat.textContent = dailyCompleted;
    if (pendingStat) pendingStat.textContent = dailyPending;
}

// Update One-time Progress Bar
function updateOneTimeProgressBar(stats) {
    const total = stats.total || 0;
    const completed = stats.completed || 0;
    const pending = stats.pending || 0;
    const percentage = stats.percentage || 0;
    
    // Update progress bar
    const progressBar = document.getElementById('onetimeProgressBar');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = percentage + '%';
        }, 100);
    }
    
    // Update percentage text
    const percentText = document.getElementById('onetimeProgressPercent');
    if (percentText) {
        percentText.textContent = percentage + '%';
    }
    
    // Update stats
    const totalStat = document.getElementById('onetimeTotalStat');
    const completedStat = document.getElementById('onetimeCompletedStat');
    const pendingStat = document.getElementById('onetimePendingStat');
    
    if (totalStat) totalStat.textContent = total;
    if (completedStat) completedStat.textContent = completed;
    if (pendingStat) pendingStat.textContent = pending;
}

// Load Student Tasks
function loadStudentTasks() {
    // Set today's date
    const today = new Date();
    const todayDateElement = document.getElementById('todayDate');
    if (todayDateElement) {
        todayDateElement.textContent = today.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Load daily tasks
    const dailyTasks = dataManager.getDailyTasksForStudent(currentStudent.id);
    loadDailyTaskSection('dailyTasksList', dailyTasks);

    // Load regular tasks
    const regularTasks = dataManager.getRegularTasksForStudent(currentStudent.id);
    const pendingTasks = regularTasks.filter(task => 
        !task.completedBy.includes(currentStudent.id)
    );
    const completedTasks = regularTasks.filter(task => 
        task.completedBy.includes(currentStudent.id)
    );

    loadTaskSection('pendingTasksList', pendingTasks, false);
    loadTaskSection('completedTasksList', completedTasks, true);
}

// Load Task Section
function loadTaskSection(containerId, tasks, isCompleted) {
    const container = document.getElementById(containerId);

    if (tasks.length === 0) {
        const message = isCompleted ? 
            'No completed tasks yet. Complete tasks to see them here!' :
            'Great job! You have no pending tasks!';
        
        container.innerHTML = `
            <div class="no-tasks">
                <i class="fas fa-check-circle"></i>
                <p>${message}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => {
        const isTaskCompleted = task.completedBy.includes(currentStudent.id);
        const deadlineDate = task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline';
        const daysLeft = task.deadline ? calculateDaysLeft(task.deadline) : null;

        return `
            <div class="task-item ${isTaskCompleted ? 'completed' : ''} fade-in">
                <div class="task-header">
                    <div class="task-checkbox">
                        <input type="checkbox" 
                               id="task-${task.id}" 
                               ${isTaskCompleted ? 'checked' : ''}
                               onchange="toggleTask(${task.id})">
                    </div>
                    <div class="task-content">
                        <div class="task-title">${task.title}</div>
                        ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                        <div class="task-meta">
                            <span class="task-badge ${task.type}">One-time Task</span>
                            ${task.deadline ? `
                                <div class="task-meta-item">
                                    <i class="fas fa-calendar"></i>
                                    <span>Due: ${deadlineDate}</span>
                                </div>
                            ` : ''}
                            ${daysLeft !== null && !isTaskCompleted ? `
                                <div class="task-meta-item" style="color: ${daysLeft < 0 ? '#C62828' : daysLeft <= 2 ? '#E65100' : 'inherit'};">
                                    <i class="fas fa-clock"></i>
                                    <span>${getDaysLeftText(daysLeft)}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Load Daily Task Section
function loadDailyTaskSection(containerId, tasks) {
    const container = document.getElementById(containerId);

    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="no-tasks">
                <i class="fas fa-calendar-check"></i>
                <p>No daily tasks assigned yet!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => {
        const isCompletedToday = dataManager.isDailyTaskCompletedToday(task.id, currentStudent.id);
        const streak = dataManager.getDailyTaskStreak(task.id, currentStudent.id);

        return `
            <div class="task-item daily-task ${isCompletedToday ? 'completed' : ''} fade-in">
                <div class="task-header">
                    <div class="task-checkbox">
                        <input type="checkbox" 
                               id="daily-task-${task.id}" 
                               ${isCompletedToday ? 'checked' : ''}
                               onchange="toggleDailyTask(${task.id})">
                    </div>
                    <div class="task-content">
                        <div class="task-title">
                            ${task.title}
                            ${streak > 0 ? `<span class="streak-badge">🔥 ${streak} day${streak > 1 ? 's' : ''}</span>` : ''}
                        </div>
                        ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                        <div class="task-meta">
                            <span class="task-badge daily">Daily Routine</span>
                            <div class="task-meta-item">
                                <i class="fas fa-sync-alt"></i>
                                <span>Repeats every day</span>
                            </div>
                            ${isCompletedToday ? `
                                <div class="task-meta-item" style="color: var(--success-soft);">
                                    <i class="fas fa-check"></i>
                                    <span>Completed today!</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle Daily Task Completion
function toggleDailyTask(taskId) {
    dataManager.toggleDailyTaskCompletion(taskId, currentStudent.id);
    
    // Reload everything with animation
    setTimeout(() => {
        loadStudentStats();
        loadStudentTasks();
    }, 200);
}

// Toggle Task Completion
function toggleTask(taskId) {
    dataManager.toggleTaskCompletion(taskId, currentStudent.id);
    
    // Reload everything with animation
    setTimeout(() => {
        loadStudentStats();
        loadStudentTasks();
    }, 200);
}

// Calculate Days Left
function calculateDaysLeft(deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Get Days Left Text
function getDaysLeftText(days) {
    if (days < 0) {
        return `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`;
    } else if (days === 0) {
        return 'Due today';
    } else if (days === 1) {
        return 'Due tomorrow';
    } else {
        return `${days} days left`;
    }
}

// Setup Mobile Menu
function setupMobileMenu() {
    const backBtn = document.querySelector('.back-btn');
    const sidebar = document.querySelector('.student-sidebar');

    if (window.innerWidth <= 1024) {
        // Add menu toggle button for mobile
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.style.cssText = 'position: fixed; top: 1rem; left: 1rem; z-index: 101; background: white; border: none; padding: 0.75rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; font-size: 1.25rem; color: var(--text-primary);';
        
        document.body.appendChild(menuToggle);

        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// Switch Tabs
function switchTab(tabName) {
    // Remove active class from all tabs and tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    if (tabName === 'today') {
        document.getElementById('todayTab').classList.add('active');
        document.getElementById('todayTabContent').classList.add('active');
    } else if (tabName === 'allTasks') {
        document.getElementById('allTasksTab').classList.add('active');
        document.getElementById('allTasksTabContent').classList.add('active');
    } else if (tabName === 'quizzes') {
        document.getElementById('quizzesTab').classList.add('active');
        document.getElementById('quizzesTabContent').classList.add('active');
        loadStudentQuizzes(); // Load quizzes when tab is activated
    }
}

// Logout / Go Back
function goBackToList() {
    sessionStorage.removeItem('currentStudentId');
    window.location.href = 'student-list.html';
}

/* ===================================
   QUIZ FUNCTIONS
   =================================== */

// Load student quizzes
function loadStudentQuizzes() {
    const studentId = getStudentId();
    if (!studentId) return;
    
    const quizzes = dataManager.getQuizzesForStudent(studentId);
    const availableQuizzes = [];
    const completedQuizzes = [];
    
    quizzes.forEach(quiz => {
        const hasTaken = dataManager.hasStudentTakenQuiz(quiz.id, studentId);
        if (hasTaken) {
            completedQuizzes.push(quiz);
        } else {
            availableQuizzes.push(quiz);
        }
    });
    
    loadAvailableQuizzes(availableQuizzes);
    loadCompletedQuizzes(completedQuizzes, studentId);
    updateQuizStats(studentId);
}

// Load available quizzes
function loadAvailableQuizzes(quizzes) {
    const container = document.getElementById('availableQuizzesList');
    
    if (quizzes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No quizzes available at the moment.</p>';
        return;
    }
    
    container.innerHTML = quizzes.map(quiz => {
        const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
        const now = new Date();
        const deadline = quiz.deadline ? new Date(quiz.deadline) : null;
        const isOverdue = deadline && now > deadline;
        
        return `
            <div class="quiz-card-student">
                <h3 class="quiz-card-title-student">${quiz.title}</h3>
                ${quiz.subject ? `<span class="quiz-subject-badge">${quiz.subject}</span>` : ''}
                ${quiz.description ? `<p class="quiz-description-student">${quiz.description}</p>` : ''}
                
                <div class="quiz-info-student">
                    <div class="quiz-info-item">
                        <i class="fas fa-question-circle"></i>
                        <span>${quiz.questions.length} Questions</span>
                    </div>
                    <div class="quiz-info-item">
                        <i class="fas fa-star"></i>
                        <span>${totalMarks} Marks</span>
                    </div>
                    <div class="quiz-info-item">
                        <i class="fas fa-clock"></i>
                        <span>${quiz.timeLimit} Minutes</span>
                    </div>
                    <div class="quiz-info-item">
                        <i class="fas fa-percent"></i>
                        <span>${quiz.passingPercentage}% to Pass</span>
                    </div>
                </div>
                
                ${deadline ? `
                    <div class="quiz-deadline-warning">
                        <i class="fas fa-calendar-alt"></i>
                        ${isOverdue ? 
                            `<span>⚠️ Deadline passed: ${deadline.toLocaleDateString()}</span>` : 
                            `<span>Due: ${deadline.toLocaleDateString()}</span>`
                        }
                    </div>
                ` : ''}
                
                <a href="student-exam-take.html?quizId=${quiz.id}" class="btn-take-quiz">
                    <i class="fas fa-play"></i> Start Exam
                </a>
            </div>
        `;
    }).join('');
}

// Load completed quizzes
function loadCompletedQuizzes(quizzes, studentId) {
    const container = document.getElementById('completedQuizzesList');
    
    if (quizzes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">You haven\'t completed any quizzes yet.</p>';
        return;
    }
    
    container.innerHTML = quizzes.map(quiz => {
        const result = dataManager.getQuizResult(quiz.id, studentId);
        if (!result) return '';
        
        const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
        const minutes = Math.floor(result.timeTaken / 60);
        const seconds = result.timeTaken % 60;
        
        const isPending = result.status === 'pending_review';
        
        return `
            <div class="quiz-card-student completed ${isPending ? 'pending-review' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 class="quiz-card-title-student">${quiz.title}</h3>
                    ${isPending ? `
                        <span style="background: #FEF3C7; color: #92400E; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">
                            ⏳ Pending Review
                        </span>
                    ` : ''}
                </div>
                ${quiz.subject ? `<span class="quiz-subject-badge">${quiz.subject}</span>` : ''}
                
                ${isPending ? `
                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                        <p style="color: #92400E; margin: 0; font-size: 0.95rem;">
                            <i class="fas fa-hourglass-half"></i> This exam is pending teacher review. 
                            ${result.score > 0 ? 'Partial score shown below (auto-graded questions only).' : 'All questions require manual grading.'}
                        </p>
                    </div>
                ` : ''}
                
                <div class="quiz-result-display">
                    <div class="quiz-score">
                        <span class="quiz-score-value">${result.percentage}%</span>
                        <span class="quiz-score-label">
                            ${isPending && result.score > 0 ? 'Partial: ' : ''}
                            ${result.score} / ${result.totalMarks} marks
                        </span>
                    </div>
                    
                    ${!isPending ? `
                        <div class="quiz-result-status ${result.passed ? 'passed' : 'failed'}">
                            ${result.passed ? '✅ Passed' : '❌ Failed'}
                        </div>
                    ` : ''}
                    
                    <div class="quiz-result-details">
                        <div class="quiz-result-item">
                            <span>Questions:</span>
                            <strong>${quiz.questions.length}</strong>
                        </div>
                        <div class="quiz-result-item">
                            <span>Time Taken:</span>
                            <strong>${minutes}m ${seconds}s</strong>
                        </div>
                        <div class="quiz-result-item">
                            <span>Submitted:</span>
                            <strong>${new Date(result.submittedAt).toLocaleDateString()}</strong>
                        </div>
                        ${!isPending ? `
                            <div class="quiz-result-item">
                                <span>Passing %:</span>
                                <strong>${quiz.passingPercentage}%</strong>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${result.answers.some(a => a.teacherFeedback) ? `
                        <div style="background: #E0F2FE; border-left: 4px solid #0284C7; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                            <div style="font-weight: 600; color: #075985; margin-bottom: 0.5rem;">
                                <i class="fas fa-comment-dots"></i> Teacher Feedback:
                            </div>
                            ${result.answers.filter(a => a.teacherFeedback).map((a, idx) => `
                                <div style="margin-bottom: 0.5rem;">
                                    <strong style="color: #0369A1;">Q${idx + 1}:</strong> 
                                    <span style="color: #0C4A6E;">${a.teacherFeedback}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Update quiz statistics in sidebar
function updateQuizStats(studentId) {
    const stats = dataManager.getStudentQuizStats(studentId);
    const quizzes = dataManager.getQuizzesForStudent(studentId);
    const pending = quizzes.length - stats.totalQuizzes;
    
    document.getElementById('quizProgressPercent').textContent = 
        stats.averagePercentage ? `${stats.averagePercentage}%` : '0%';
    document.getElementById('quizTakenStat').textContent = stats.totalQuizzes;
    document.getElementById('quizPassedStat').textContent = stats.passedCount;
    document.getElementById('quizPendingStat').textContent = pending;
}

