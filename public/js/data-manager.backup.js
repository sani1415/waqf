// Data Manager - Handles all localStorage operations

class DataManager {
    constructor() {
        this.initializeData();
    }

    // Initialize default data structure
    initializeData() {
        if (!localStorage.getItem('students')) {
            localStorage.setItem('students', JSON.stringify([]));
        }
        if (!localStorage.getItem('tasks')) {
            localStorage.setItem('tasks', JSON.stringify([]));
        }
        if (!localStorage.getItem('messages')) {
            localStorage.setItem('messages', JSON.stringify([]));
        }
        if (!localStorage.getItem('quizzes')) {
            localStorage.setItem('quizzes', JSON.stringify([]));
        }
        if (!localStorage.getItem('quizResults')) {
            localStorage.setItem('quizResults', JSON.stringify([]));
        }
        
        // Add sample data if empty
        const students = this.getStudents();
        if (students.length === 0) {
            this.addSampleData();
        }
    }

    // Add sample data for demonstration
    addSampleData() {
        const sampleStudents = [
            { 
                id: 1, 
                name: 'Ahmed Ali',
                email: 'ahmed@example.com',
                phone: '+1234567890',
                dateOfBirth: '2010-05-15',
                grade: '8th Grade',
                section: 'A',
                studentId: 'STU-2024-001',
                parentName: 'Ali Hassan',
                parentPhone: '+1234567899',
                parentEmail: 'ali.hassan@example.com',
                enrollmentDate: '2024-09-01',
                notes: [],
                createdAt: '2024-09-01T10:00:00.000Z',
                updatedAt: '2024-09-01T10:00:00.000Z'
            },
            { 
                id: 2, 
                name: 'Fatima Hassan',
                email: 'fatima@example.com',
                phone: '+1234567891',
                dateOfBirth: '2011-03-22',
                grade: '7th Grade',
                section: 'B',
                studentId: 'STU-2024-002',
                parentName: 'Hassan Ibrahim',
                parentPhone: '+1234567898',
                parentEmail: 'hassan@example.com',
                enrollmentDate: '2024-09-01',
                notes: [],
                createdAt: '2024-09-01T10:00:00.000Z',
                updatedAt: '2024-09-01T10:00:00.000Z'
            },
            { 
                id: 3, 
                name: 'Omar Ibrahim',
                email: 'omar@example.com',
                phone: '+1234567892',
                dateOfBirth: '2009-08-10',
                grade: '9th Grade',
                section: 'A',
                studentId: 'STU-2024-003',
                parentName: 'Ibrahim Mahmoud',
                parentPhone: '+1234567897',
                parentEmail: 'ibrahim@example.com',
                enrollmentDate: '2024-09-01',
                notes: [],
                createdAt: '2024-09-01T10:00:00.000Z',
                updatedAt: '2024-09-01T10:00:00.000Z'
            },
            { 
                id: 4, 
                name: 'Aisha Mohammed',
                email: 'aisha@example.com',
                phone: '+1234567893',
                dateOfBirth: '2010-11-30',
                grade: '8th Grade',
                section: 'B',
                studentId: 'STU-2024-004',
                parentName: 'Mohammed Khalid',
                parentPhone: '+1234567896',
                parentEmail: 'mohammed@example.com',
                enrollmentDate: '2024-09-01',
                notes: [],
                createdAt: '2024-09-01T10:00:00.000Z',
                updatedAt: '2024-09-01T10:00:00.000Z'
            },
            { 
                id: 5, 
                name: 'Yusuf Abdullah',
                email: 'yusuf@example.com',
                phone: '+1234567894',
                dateOfBirth: '2011-01-18',
                grade: '7th Grade',
                section: 'A',
                studentId: 'STU-2024-005',
                parentName: 'Abdullah Rahman',
                parentPhone: '+1234567895',
                parentEmail: 'abdullah@example.com',
                enrollmentDate: '2024-09-01',
                notes: [],
                createdAt: '2024-09-01T10:00:00.000Z',
                updatedAt: '2024-09-01T10:00:00.000Z'
            }
        ];

        const sampleTasks = [
            {
                id: 1,
                title: 'Complete Mathematics Assignment',
                description: 'Solve problems 1-20 from Chapter 5',
                type: 'one-time',
                assignedTo: [1, 2, 3, 4, 5],
                deadline: '2025-10-15',
                completedBy: [1],
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Science Project Report',
                description: 'Write a detailed report on your science experiment',
                type: 'one-time',
                assignedTo: [1, 2, 3, 4, 5],
                deadline: '2025-10-20',
                completedBy: [1, 2],
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Group Presentation on Climate Change',
                description: 'Prepare a 15-minute presentation with your group',
                type: 'one-time',
                assignedTo: [1, 2, 3],
                deadline: '2025-10-25',
                completedBy: [1],
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                title: 'English Essay Writing',
                description: 'Write a 500-word essay on your favorite book',
                type: 'one-time',
                assignedTo: [4, 5],
                deadline: '2025-10-18',
                completedBy: [],
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                title: 'Morning Quran Reading',
                description: 'Read and memorize 1 page from the Quran',
                type: 'daily',
                assignedTo: [1, 2, 3, 4, 5],
                dailyCompletions: {
                    1: ['2025-10-09', '2025-10-08', '2025-10-07'],
                    2: ['2025-10-09', '2025-10-08'],
                    3: ['2025-10-09'],
                    4: ['2025-10-08'],
                    5: ['2025-10-09', '2025-10-08', '2025-10-07', '2025-10-06']
                },
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                title: 'Daily Prayer Times',
                description: 'Complete all 5 daily prayers on time',
                type: 'daily',
                assignedTo: [1, 2, 3, 4, 5],
                dailyCompletions: {
                    1: ['2025-10-09', '2025-10-08'],
                    2: ['2025-10-09'],
                    3: ['2025-10-09', '2025-10-08', '2025-10-07'],
                    4: ['2025-10-09', '2025-10-08'],
                    5: ['2025-10-08']
                },
                createdAt: new Date().toISOString()
            },
            {
                id: 7,
                title: 'Homework Review',
                description: 'Review and complete daily homework assignments',
                type: 'daily',
                assignedTo: [1, 2, 3, 4, 5],
                dailyCompletions: {
                    1: ['2025-10-08'],
                    2: ['2025-10-09', '2025-10-08'],
                    3: ['2025-10-09', '2025-10-08'],
                    4: ['2025-10-09'],
                    5: ['2025-10-09', '2025-10-08']
                },
                createdAt: new Date().toISOString()
            },
            {
                id: 8,
                title: 'Islamic Studies Reading',
                description: 'Read 15 minutes of Islamic studies material',
                type: 'daily',
                assignedTo: [1, 2, 3, 4, 5],
                dailyCompletions: {
                    1: ['2025-10-09', '2025-10-08', '2025-10-07'],
                    2: ['2025-10-09', '2025-10-08'],
                    3: ['2025-10-08'],
                    4: ['2025-10-09', '2025-10-08', '2025-10-07'],
                    5: ['2025-10-09']
                },
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('students', JSON.stringify(sampleStudents));
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        
        // Sample Quizzes
        const sampleQuizzes = [
            {
                id: 1001,
                title: "Islamic Studies - Quiz 1",
                description: "Test your knowledge on the basics of Islam",
                subject: "Islamic Studies",
                questions: [
                    {
                        id: 1,
                        question: "How many pillars of Islam are there?",
                        options: ["3", "4", "5", "6"],
                        correctAnswer: 2, // index 2 = "5"
                        marks: 2
                    },
                    {
                        id: 2,
                        question: "What is the first pillar of Islam?",
                        options: ["Salah", "Shahada", "Zakat", "Hajj"],
                        correctAnswer: 1, // index 1 = "Shahada"
                        marks: 2
                    },
                    {
                        id: 3,
                        question: "How many times Muslims pray daily?",
                        options: ["3 times", "4 times", "5 times", "6 times"],
                        correctAnswer: 2, // index 2 = "5 times"
                        marks: 2
                    },
                    {
                        id: 4,
                        question: "Which month is the month of fasting?",
                        options: ["Rajab", "Shaban", "Ramadan", "Shawwal"],
                        correctAnswer: 2, // index 2 = "Ramadan"
                        marks: 2
                    },
                    {
                        id: 5,
                        question: "What is Zakat?",
                        options: ["Prayer", "Charity", "Fasting", "Pilgrimage"],
                        correctAnswer: 1, // index 1 = "Charity"
                        marks: 2
                    }
                ],
                timeLimit: 10, // 10 minutes
                passingPercentage: 60,
                assignedTo: [1, 2, 3, 4],
                deadline: "2025-10-20",
                createdAt: new Date().toISOString(),
                createdBy: 'teacher'
            },
            {
                id: 1002,
                title: "Arabic Language - Basics",
                description: "Test on basic Arabic vocabulary and grammar",
                subject: "Arabic",
                questions: [
                    {
                        id: 1,
                        question: "What is the Arabic word for 'Peace'?",
                        options: ["Sabah", "Salaam", "Shukran", "Marhaba"],
                        correctAnswer: 1,
                        marks: 3
                    },
                    {
                        id: 2,
                        question: "How do you say 'Thank you' in Arabic?",
                        options: ["Shukran", "Afwan", "Marhaba", "Ma'assalama"],
                        correctAnswer: 0,
                        marks: 3
                    },
                    {
                        id: 3,
                        question: "What does 'Bismillah' mean?",
                        options: ["Thank God", "In the name of Allah", "Peace be upon you", "Goodbye"],
                        correctAnswer: 1,
                        marks: 4
                    }
                ],
                timeLimit: 5,
                passingPercentage: 50,
                assignedTo: [1, 2, 3],
                deadline: "2025-10-18",
                createdAt: new Date().toISOString(),
                createdBy: 'teacher'
            },
            {
                id: 1003,
                title: "Comprehensive Exam - All Question Types",
                description: "This exam demonstrates all available question types including auto-graded and manually-graded questions",
                subject: "Mixed Assessment",
                questions: [
                    {
                        id: 1,
                        type: "mcq",
                        question: "What is the capital city of Saudi Arabia?",
                        options: ["Jeddah", "Riyadh", "Mecca", "Medina"],
                        correctAnswer: 1,
                        marks: 2
                    },
                    {
                        id: 2,
                        type: "true_false",
                        question: "The Quran was revealed over a period of 23 years.",
                        options: ["True", "False"],
                        correctAnswer: 0, // True
                        marks: 2
                    },
                    {
                        id: 3,
                        type: "fill_blank",
                        question: "The first Surah in the Quran is called Surah ______.",
                        acceptedAnswers: ["Al-Fatiha", "Fatiha", "al fatiha"],
                        correctAnswer: "Al-Fatiha",
                        marks: 2
                    },
                    {
                        id: 4,
                        type: "short_answer",
                        question: "Explain the meaning of 'Tawheed' in one or two sentences.",
                        expectedAnswer: "Tawheed means the oneness of Allah. It is the fundamental concept that Allah is one, unique, and has no partners.",
                        marks: 3
                    },
                    {
                        id: 5,
                        type: "essay",
                        question: "Write an essay about the importance of seeking knowledge in Islam. Discuss the role of education in a Muslim's life and provide examples from Islamic history.",
                        wordLimit: 300,
                        gradingRubric: "1. Clear introduction (1 mark), 2. Discussion of Islamic perspective (2 marks), 3. Historical examples (2 marks), 4. Conclusion (1 mark)",
                        marks: 6
                    },
                    {
                        id: 6,
                        type: "file_upload",
                        question: "Upload a document showing your Arabic homework assignment (any format: PDF, image, Word document)",
                        uploadInstructions: "Please upload a clear, readable document. Accepted formats: PDF, JPG, PNG, DOC, DOCX",
                        marks: 5
                    }
                ],
                timeLimit: 30,
                passingPercentage: 60,
                assignedTo: [1, 2, 3, 4],
                deadline: "2025-10-20",
                createdAt: new Date().toISOString(),
                createdBy: 'teacher'
            }
        ];
        
        localStorage.setItem('quizzes', JSON.stringify(sampleQuizzes));
        
        // Sample Quiz Results (some students already took quizzes)
        const sampleResults = [
            {
                id: 2001,
                quizId: 1001,
                studentId: 1, // Ahmed Ali
                answers: [
                    {questionId: 0, selectedAnswer: 2, correctAnswer: 2, isCorrect: true, marks: 2},
                    {questionId: 1, selectedAnswer: 1, correctAnswer: 1, isCorrect: true, marks: 2},
                    {questionId: 2, selectedAnswer: 2, correctAnswer: 2, isCorrect: true, marks: 2},
                    {questionId: 3, selectedAnswer: 2, correctAnswer: 2, isCorrect: true, marks: 2},
                    {questionId: 4, selectedAnswer: 0, correctAnswer: 1, isCorrect: false, marks: 0}
                ],
                score: 8,
                totalMarks: 10,
                percentage: 80,
                passed: true,
                timeTaken: 420, // 7 minutes in seconds
                submittedAt: "2025-10-08T10:30:00.000Z",
                autoGraded: true,
                status: 'graded'
            },
            {
                id: 2002,
                quizId: 1002,
                studentId: 2, // Fatima Hassan
                answers: [
                    {questionId: 0, selectedAnswer: 1, correctAnswer: 1, isCorrect: true, marks: 3},
                    {questionId: 1, selectedAnswer: 0, correctAnswer: 0, isCorrect: true, marks: 3},
                    {questionId: 2, selectedAnswer: 1, correctAnswer: 1, isCorrect: true, marks: 4}
                ],
                score: 10,
                totalMarks: 10,
                percentage: 100,
                passed: true,
                timeTaken: 180, // 3 minutes
                submittedAt: "2025-10-07T14:15:00.000Z",
                autoGraded: true,
                status: 'graded'
            },
            {
                id: 2003,
                quizId: 1003,
                studentId: 1, // Ahmed Ali
                answers: [
                    // MCQ - Auto-graded
                    {
                        questionId: 0, 
                        answer: 1, 
                        correctAnswer: 1, 
                        isCorrect: true, 
                        marks: 2,
                        autoGraded: true
                    },
                    // True/False - Auto-graded
                    {
                        questionId: 1, 
                        answer: 0, 
                        correctAnswer: 0, 
                        isCorrect: true, 
                        marks: 2,
                        autoGraded: true
                    },
                    // Fill in Blank - Auto-graded
                    {
                        questionId: 2, 
                        answer: "Al-Fatiha", 
                        correctAnswer: "Al-Fatiha", 
                        isCorrect: true, 
                        marks: 2,
                        autoGraded: true
                    },
                    // Short Answer - Pending manual grading
                    {
                        questionId: 3, 
                        answer: "Tawheed is the belief in the oneness of Allah. It means that Allah is one and has no partners.", 
                        marks: null, // Pending grading
                        autoGraded: false
                    },
                    // Essay - Pending manual grading
                    {
                        questionId: 4, 
                        answer: "Knowledge is highly valued in Islam. The first revelation to Prophet Muhammad (PBUH) was 'Read'. This shows the importance of learning. Throughout Islamic history, scholars like Imam Bukhari and Ibn Sina contributed greatly to various fields. Education helps Muslims understand their faith better and contribute to society. The Prophet said 'Seeking knowledge is an obligation upon every Muslim', which emphasizes its importance.",
                        marks: null, // Pending grading
                        autoGraded: false
                    },
                    // File Upload - Pending manual grading
                    {
                        questionId: 5, 
                        answer: {
                            fileName: "Arabic_Homework_Ahmed.pdf",
                            fileType: "application/pdf",
                            fileSize: 245760,
                            fileData: "data:application/pdf;base64,..." // Simulated
                        },
                        marks: null, // Pending grading
                        autoGraded: false
                    }
                ],
                score: 6, // Auto-graded score only
                autoGradedScore: 6,
                manualGradedScore: 0,
                totalMarks: 20,
                percentage: 30, // Partial percentage (auto-graded only)
                passed: false, // May change after manual grading
                timeTaken: 1200, // 20 minutes
                submittedAt: "2025-10-09T09:30:00.000Z",
                status: 'pending_review'
            }
        ];
        
        localStorage.setItem('quizResults', JSON.stringify(sampleResults));
    }

    // Students Management
    getStudents() {
        return JSON.parse(localStorage.getItem('students')) || [];
    }

    getStudentById(id) {
        const students = this.getStudents();
        return students.find(s => s.id === parseInt(id));
    }

    addStudent(student) {
        const students = this.getStudents();
        const newStudent = {
            id: Date.now(),
            ...student,
            notes: student.notes || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));
        return newStudent;
    }

    updateStudentProfile(studentId, updatedData) {
        const students = this.getStudents();
        const studentIndex = students.findIndex(s => s.id === parseInt(studentId));
        
        if (studentIndex !== -1) {
            students[studentIndex] = {
                ...students[studentIndex],
                ...updatedData,
                id: students[studentIndex].id, // Preserve ID
                notes: students[studentIndex].notes, // Preserve notes
                createdAt: students[studentIndex].createdAt, // Preserve creation date
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('students', JSON.stringify(students));
            return students[studentIndex];
        }
        return null;
    }

    // Student Notes Management
    addStudentNote(studentId, noteData) {
        const students = this.getStudents();
        const student = students.find(s => s.id === parseInt(studentId));
        
        if (student) {
            if (!student.notes) {
                student.notes = [];
            }
            
            const newNote = {
                id: Date.now(),
                date: new Date().toISOString(),
                category: noteData.category || 'General',
                note: noteData.note,
                addedBy: 'Teacher'
            };
            
            student.notes.unshift(newNote); // Add to beginning (newest first)
            student.updatedAt = new Date().toISOString();
            localStorage.setItem('students', JSON.stringify(students));
            return newNote;
        }
        return null;
    }

    updateStudentNote(studentId, noteId, updatedNote) {
        const students = this.getStudents();
        const student = students.find(s => s.id === parseInt(studentId));
        
        if (student && student.notes) {
            const noteIndex = student.notes.findIndex(n => n.id === parseInt(noteId));
            if (noteIndex !== -1) {
                student.notes[noteIndex] = {
                    ...student.notes[noteIndex],
                    note: updatedNote.note,
                    category: updatedNote.category,
                    edited: true,
                    editedAt: new Date().toISOString()
                };
                student.updatedAt = new Date().toISOString();
                localStorage.setItem('students', JSON.stringify(students));
                return student.notes[noteIndex];
            }
        }
        return null;
    }

    deleteStudentNote(studentId, noteId) {
        const students = this.getStudents();
        const student = students.find(s => s.id === parseInt(studentId));
        
        if (student && student.notes) {
            student.notes = student.notes.filter(n => n.id !== parseInt(noteId));
            student.updatedAt = new Date().toISOString();
            localStorage.setItem('students', JSON.stringify(students));
            return true;
        }
        return false;
    }

    deleteStudent(id) {
        let students = this.getStudents();
        students = students.filter(s => s.id !== parseInt(id));
        localStorage.setItem('students', JSON.stringify(students));
        
        // Also remove student from all tasks
        let tasks = this.getTasks();
        tasks = tasks.map(task => ({
            ...task,
            assignedTo: task.assignedTo.filter(sid => sid !== parseInt(id)),
            completedBy: task.completedBy.filter(sid => sid !== parseInt(id))
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Tasks Management
    getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    getTaskById(id) {
        const tasks = this.getTasks();
        return tasks.find(t => t.id === parseInt(id));
    }

    getTasksForStudent(studentId) {
        const tasks = this.getTasks();
        return tasks.filter(task => 
            task.assignedTo.includes(parseInt(studentId))
        );
    }

    addTask(task) {
        const tasks = this.getTasks();
        const newTask = {
            id: Date.now(),
            ...task,
            completedBy: task.type === 'daily' ? undefined : [],
            dailyCompletions: task.type === 'daily' ? {} : undefined,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return newTask;
    }

    updateTask(taskId, updatedData) {
        const tasks = this.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
        
        if (taskIndex !== -1) {
            const existingTask = tasks[taskIndex];
            
            // If task type changed, reset completion data
            if (updatedData.type && updatedData.type !== existingTask.type) {
                if (updatedData.type === 'daily') {
                    updatedData.completedBy = undefined;
                    updatedData.dailyCompletions = {};
                    updatedData.deadline = undefined;
                } else {
                    updatedData.completedBy = [];
                    updatedData.dailyCompletions = undefined;
                }
            } else {
                // Keep existing completion data if type didn't change
                updatedData.completedBy = existingTask.completedBy;
                updatedData.dailyCompletions = existingTask.dailyCompletions;
            }
            
            tasks[taskIndex] = {
                ...existingTask,
                ...updatedData,
                id: existingTask.id, // Preserve ID
                createdAt: existingTask.createdAt, // Preserve creation date
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('tasks', JSON.stringify(tasks));
            return tasks[taskIndex];
        }
        return null;
    }

    deleteTask(id) {
        let tasks = this.getTasks();
        tasks = tasks.filter(t => t.id !== parseInt(id));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    toggleTaskCompletion(taskId, studentId) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === parseInt(taskId));
        
        if (task) {
            const studentIdNum = parseInt(studentId);
            const index = task.completedBy.indexOf(studentIdNum);
            
            if (index > -1) {
                // Remove from completed
                task.completedBy.splice(index, 1);
            } else {
                // Add to completed
                task.completedBy.push(studentIdNum);
            }
            
            localStorage.setItem('tasks', JSON.stringify(tasks));
            return task;
        }
        return null;
    }

    isTaskCompletedByStudent(taskId, studentId) {
        const task = this.getTaskById(taskId);
        return task ? task.completedBy.includes(parseInt(studentId)) : false;
    }

    // Daily Tasks Management
    getTodayDateString() {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    }

    getDailyTasksForStudent(studentId) {
        const tasks = this.getTasks();
        return tasks.filter(task => 
            task.type === 'daily' && task.assignedTo.includes(parseInt(studentId))
        );
    }

    getRegularTasksForStudent(studentId) {
        const tasks = this.getTasks();
        return tasks.filter(task => 
            task.type !== 'daily' && task.assignedTo.includes(parseInt(studentId))
        );
    }

    isDailyTaskCompletedToday(taskId, studentId) {
        const task = this.getTaskById(taskId);
        if (!task || task.type !== 'daily') return false;
        
        const today = this.getTodayDateString();
        const studentIdStr = studentId.toString();
        
        // Use array format
        return task.dailyCompletions && 
               task.dailyCompletions[studentIdStr] && 
               Array.isArray(task.dailyCompletions[studentIdStr]) &&
               task.dailyCompletions[studentIdStr].includes(today);
    }

    toggleDailyTaskCompletion(taskId, studentId) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === parseInt(taskId));
        
        if (task && task.type === 'daily') {
            const today = this.getTodayDateString();
            const studentIdStr = studentId.toString();
            
            // Initialize if needed (use ARRAY format)
            if (!task.dailyCompletions) {
                task.dailyCompletions = {};
            }
            if (!task.dailyCompletions[studentIdStr]) {
                task.dailyCompletions[studentIdStr] = [];
            }
            
            // Toggle today's completion using ARRAY format
            const completionArray = task.dailyCompletions[studentIdStr];
            const index = completionArray.indexOf(today);
            
            if (index > -1) {
                // Already completed - remove it
                completionArray.splice(index, 1);
            } else {
                // Not completed - add it
                completionArray.push(today);
            }
            
            localStorage.setItem('tasks', JSON.stringify(tasks));
            return task;
        }
        return null;
    }

    getDailyTaskStreak(taskId, studentId) {
        const task = this.getTaskById(taskId);
        if (!task || task.type !== 'daily') return 0;
        
        const studentIdStr = studentId.toString();
        // Use ARRAY format
        const completions = task.dailyCompletions && task.dailyCompletions[studentIdStr] 
            ? task.dailyCompletions[studentIdStr] 
            : [];
        
        let streak = 0;
        let currentDate = new Date();
        
        // Check backwards from today
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (completions.includes(dateStr)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    }

    getDailyTaskCompletionHistory(taskId, studentId, days = 7) {
        const task = this.getTaskById(taskId);
        if (!task || task.type !== 'daily') return [];
        
        const studentIdStr = studentId.toString();
        // Use ARRAY format
        const completions = task.dailyCompletions && task.dailyCompletions[studentIdStr] 
            ? task.dailyCompletions[studentIdStr] 
            : [];
        
        const history = [];
        const currentDate = new Date();
        
        for (let i = 0; i < days; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            history.push({
                date: dateStr,
                completed: completions.includes(dateStr)
            });
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        return history.reverse(); // Oldest first
    }

    // Statistics
    getStudentStats(studentId) {
        const regularTasks = this.getRegularTasksForStudent(studentId);
        const dailyTasks = this.getDailyTasksForStudent(studentId);
        
        const regularCompleted = regularTasks.filter(task => 
            task.completedBy && task.completedBy.includes(parseInt(studentId))
        ).length;
        
        const dailyCompletedToday = dailyTasks.filter(task => 
            this.isDailyTaskCompletedToday(task.id, studentId)
        ).length;
        
        return {
            total: regularTasks.length,
            completed: regularCompleted,
            pending: regularTasks.length - regularCompleted,
            percentage: regularTasks.length > 0 ? Math.round((regularCompleted / regularTasks.length) * 100) : 0,
            dailyTotal: dailyTasks.length,
            dailyCompletedToday: dailyCompletedToday,
            dailyPendingToday: dailyTasks.length - dailyCompletedToday
        };
    }

    getOverallStats() {
        const students = this.getStudents();
        const tasks = this.getTasks();
        
        // Filter out daily tasks for overall stats (they're tracked separately)
        const oneTimeTasks = tasks.filter(t => t.type === 'one-time');
        const dailyTasks = tasks.filter(t => t.type === 'daily');
        
        const totalTasks = oneTimeTasks.length;
        const totalAssignments = oneTimeTasks.reduce((sum, task) => 
            sum + task.assignedTo.length, 0
        );
        const completedAssignments = oneTimeTasks.reduce((sum, task) => 
            sum + (task.completedBy ? task.completedBy.length : 0), 0
        );
        
        return {
            totalStudents: students.length,
            totalTasks: totalTasks,
            totalAssignments: totalAssignments,
            completedAssignments: completedAssignments,
            pendingAssignments: totalAssignments - completedAssignments,
            overallCompletion: totalAssignments > 0 ? 
                Math.round((completedAssignments / totalAssignments) * 100) : 0,
            oneTimeTasks: oneTimeTasks.length,
            dailyTasks: dailyTasks.length
        };
    }

    getStudentProgress() {
        const students = this.getStudents();
        return students.map(student => {
            const stats = this.getStudentStats(student.id);
            return {
                student: student,
                stats: stats
            };
        });
    }

    // Messages Management
    getMessages() {
        return JSON.parse(localStorage.getItem('messages')) || [];
    }

    getMessagesForStudent(studentId) {
        const messages = this.getMessages();
        return messages.filter(msg => msg.studentId === parseInt(studentId))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    sendMessage(studentId, message, sender) {
        const messages = this.getMessages();
        const newMessage = {
            id: Date.now(),
            studentId: parseInt(studentId),
            message: message,
            sender: sender, // 'teacher' or 'student'
            timestamp: new Date().toISOString(),
            read: false
        };
        messages.push(newMessage);
        localStorage.setItem('messages', JSON.stringify(messages));
        return newMessage;
    }

    markMessagesAsRead(studentId, sender) {
        // Mark all messages from the opposite sender as read
        const messages = this.getMessages();
        const readBy = sender === 'teacher' ? 'student' : 'teacher';
        messages.forEach(msg => {
            if (msg.studentId === parseInt(studentId) && msg.sender === readBy) {
                msg.read = true;
            }
        });
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    getUnreadCount(studentId, forUser) {
        // forUser: 'teacher' or 'student'
        const messages = this.getMessages();
        return messages.filter(msg => 
            msg.studentId === parseInt(studentId) && 
            msg.sender !== forUser && 
            !msg.read
        ).length;
    }

    getLastMessage(studentId) {
        const messages = this.getMessagesForStudent(studentId);
        return messages.length > 0 ? messages[messages.length - 1] : null;
    }

    getAllChatsForTeacher() {
        const students = this.getStudents();
        return students.map(student => {
            const lastMessage = this.getLastMessage(student.id);
            const unreadCount = this.getUnreadCount(student.id, 'teacher');
            return {
                student: student,
                lastMessage: lastMessage,
                unreadCount: unreadCount
            };
        }).sort((a, b) => {
            // Sort by last message time, most recent first
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
        });
    }

    /* ===================================
       QUIZ MANAGEMENT METHODS
       =================================== */

    // Get all quizzes
    getQuizzes() {
        return JSON.parse(localStorage.getItem('quizzes') || '[]');
    }

    // Get quiz by ID
    getQuizById(quizId) {
        const quizzes = this.getQuizzes();
        return quizzes.find(q => q.id === parseInt(quizId));
    }

    // Get quizzes for a specific student
    getQuizzesForStudent(studentId) {
        const quizzes = this.getQuizzes();
        return quizzes.filter(quiz => 
            quiz.assignedTo.includes(parseInt(studentId))
        );
    }

    // Add new quiz
    addQuiz(quiz) {
        const quizzes = this.getQuizzes();
        const newQuiz = {
            id: Date.now(),
            ...quiz,
            createdAt: new Date().toISOString(),
            createdBy: 'teacher'
        };
        quizzes.push(newQuiz);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        return newQuiz;
    }

    // Update quiz
    updateQuiz(quizId, updatedData) {
        const quizzes = this.getQuizzes();
        const quizIndex = quizzes.findIndex(q => q.id === parseInt(quizId));
        
        if (quizIndex !== -1) {
            quizzes[quizIndex] = {
                ...quizzes[quizIndex],
                ...updatedData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
            return quizzes[quizIndex];
        }
        return null;
    }

    // Delete quiz
    deleteQuiz(quizId) {
        let quizzes = this.getQuizzes();
        quizzes = quizzes.filter(q => q.id !== parseInt(quizId));
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        
        // Also delete all results for this quiz
        let results = this.getQuizResults();
        results = results.filter(r => r.quizId !== parseInt(quizId));
        localStorage.setItem('quizResults', JSON.stringify(results));
    }

    /* ===================================
       QUIZ RESULTS METHODS
       =================================== */

    // Get all quiz results
    getQuizResults() {
        return JSON.parse(localStorage.getItem('quizResults') || '[]');
    }

    // Get results for a specific quiz
    getResultsForQuiz(quizId) {
        const results = this.getQuizResults();
        return results.filter(r => r.quizId === parseInt(quizId));
    }

    // Get results for a specific student
    getResultsForStudent(studentId) {
        const results = this.getQuizResults();
        return results.filter(r => r.studentId === parseInt(studentId));
    }

    // Get specific result
    getQuizResult(quizId, studentId) {
        const results = this.getQuizResults();
        return results.find(r => 
            r.quizId === parseInt(quizId) && 
            r.studentId === parseInt(studentId)
        );
    }

    // Submit quiz and auto-grade (handles all question types)
    submitQuiz(quizId, studentId, answers, timeTaken) {
        const quiz = this.getQuizById(quizId);
        if (!quiz) return null;

        let autoGradedScore = 0;
        let totalAutoGradableMarks = 0;
        let hasManualGrading = false;

        const gradedAnswers = answers.map((answer, index) => {
            const question = quiz.questions[index];
            const questionType = question.type || 'mcq'; // default to MCQ for backward compatibility
            
            let answerResult = {
                questionId: index,
                questionType: questionType,
                studentAnswer: answer,
                marks: null,
                autoGraded: false,
                isCorrect: null,
                gradedBy: null,
                gradedAt: null,
                teacherFeedback: null
            };

            // Auto-gradable question types
            if (questionType === 'mcq' || questionType === 'true_false') {
                // Multiple Choice or True/False
                const isCorrect = answer === question.correctAnswer;
                answerResult.correctAnswer = question.correctAnswer;
                answerResult.isCorrect = isCorrect;
                answerResult.marks = isCorrect ? question.marks : 0;
                answerResult.autoGraded = true;
                autoGradedScore += answerResult.marks;
                totalAutoGradableMarks += question.marks;
            } else if (questionType === 'fill_blank') {
                // Fill in the Blank - check against accepted answers
                const acceptedAnswers = question.acceptedAnswers || [question.correctAnswer];
                const studentAnswerNorm = (answer || '').toString().trim().toLowerCase();
                const isCorrect = acceptedAnswers.some(accepted => 
                    accepted.toString().trim().toLowerCase() === studentAnswerNorm
                );
                answerResult.isCorrect = isCorrect;
                answerResult.marks = isCorrect ? question.marks : 0;
                answerResult.autoGraded = true;
                answerResult.correctAnswer = acceptedAnswers[0]; // Show first accepted answer
                autoGradedScore += answerResult.marks;
                totalAutoGradableMarks += question.marks;
            } else {
                // Manual grading required: short_answer, essay, file_upload
                hasManualGrading = true;
                answerResult.autoGraded = false;
                answerResult.marks = null; // Will be set by teacher
            }

            return answerResult;
        });

        const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
        
        // Determine status and scores
        let status, finalScore, percentage, passed;
        
        if (hasManualGrading) {
            // Some questions need manual grading
            status = 'pending_review';
            finalScore = null; // Can't calculate final score yet
            percentage = null;
            passed = null;
        } else {
            // All questions auto-graded
            status = 'graded';
            finalScore = autoGradedScore;
            percentage = parseFloat(((finalScore / totalMarks) * 100).toFixed(2));
            passed = percentage >= (quiz.passingPercentage || 40);
        }

        const result = {
            id: Date.now(),
            quizId: parseInt(quizId),
            studentId: parseInt(studentId),
            answers: gradedAnswers,
            autoGradedScore: autoGradedScore,
            manualGradedScore: hasManualGrading ? null : 0,
            score: finalScore,
            totalMarks: totalMarks,
            percentage: percentage,
            passed: passed,
            status: status, // 'pending_review', 'graded'
            timeTaken: timeTaken,
            submittedAt: new Date().toISOString(),
            gradedAt: hasManualGrading ? null : new Date().toISOString()
        };

        const results = this.getQuizResults();
        results.push(result);
        localStorage.setItem('quizResults', JSON.stringify(results));
        
        return result;
    }

    // Check if student has already taken quiz
    hasStudentTakenQuiz(quizId, studentId) {
        const result = this.getQuizResult(quizId, studentId);
        return result !== undefined;
    }

    // Get quiz statistics
    getQuizStatistics(quizId) {
        const results = this.getResultsForQuiz(quizId);
        const quiz = this.getQuizById(quizId);
        
        if (results.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                averagePercentage: 0,
                passedCount: 0,
                failedCount: 0,
                passRate: 0,
                highestScore: 0,
                lowestScore: 0,
                totalAssigned: quiz ? quiz.assignedTo.length : 0,
                completionRate: 0
            };
        }

        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        const totalPercentage = results.reduce((sum, r) => sum + r.percentage, 0);
        const passedCount = results.filter(r => r.passed).length;
        const scores = results.map(r => r.score);

        return {
            totalAttempts: results.length,
            averageScore: (totalScore / results.length).toFixed(2),
            averagePercentage: (totalPercentage / results.length).toFixed(2),
            passedCount: passedCount,
            failedCount: results.length - passedCount,
            passRate: ((passedCount / results.length) * 100).toFixed(2),
            highestScore: Math.max(...scores),
            lowestScore: Math.min(...scores),
            totalAssigned: quiz ? quiz.assignedTo.length : 0,
            completionRate: quiz ? ((results.length / quiz.assignedTo.length) * 100).toFixed(2) : 0
        };
    }

    // Get student quiz statistics
    getStudentQuizStats(studentId) {
        const results = this.getResultsForStudent(studentId);
        
        // Only count graded results for stats
        const gradedResults = results.filter(r => r.status === 'graded');
        
        if (gradedResults.length === 0) {
            return {
                totalQuizzes: 0,
                averageScore: 0,
                averagePercentage: 0,
                passedCount: 0,
                failedCount: 0
            };
        }

        const totalScore = gradedResults.reduce((sum, r) => sum + (r.score || 0), 0);
        const totalPercentage = gradedResults.reduce((sum, r) => sum + (r.percentage || 0), 0);
        const passedCount = gradedResults.filter(r => r.passed).length;

        return {
            totalQuizzes: gradedResults.length,
            averageScore: (totalScore / gradedResults.length).toFixed(2),
            averagePercentage: (totalPercentage / gradedResults.length).toFixed(2),
            passedCount: passedCount,
            failedCount: gradedResults.length - passedCount
        };
    }

    /* ===================================
       MANUAL GRADING METHODS
       =================================== */

    // Get results pending teacher review
    getPendingGradingResults() {
        const results = this.getQuizResults();
        return results.filter(r => r.status === 'pending_review');
    }

    // Get pending results for specific quiz
    getPendingResultsForQuiz(quizId) {
        const results = this.getResultsForQuiz(quizId);
        return results.filter(r => r.status === 'pending_review');
    }

    // Grade a specific answer
    gradeAnswer(resultId, questionIndex, marks, feedback) {
        const results = this.getQuizResults();
        const resultIndex = results.findIndex(r => r.id === parseInt(resultId));
        
        if (resultIndex === -1) return null;
        
        const result = results[resultIndex];
        const answer = result.answers[questionIndex];
        
        if (!answer) return null;
        
        // Update answer with grading
        answer.marks = parseFloat(marks);
        answer.gradedBy = 'teacher';
        answer.gradedAt = new Date().toISOString();
        answer.teacherFeedback = feedback || null;
        
        // Check if all answers are now graded
        const allGraded = result.answers.every(a => a.marks !== null);
        
        if (allGraded) {
            // Calculate final scores
            const autoScore = result.autoGradedScore || 0;
            const manualScore = result.answers
                .filter(a => !a.autoGraded)
                .reduce((sum, a) => sum + (a.marks || 0), 0);
            
            const totalScore = autoScore + manualScore;
            const percentage = parseFloat(((totalScore / result.totalMarks) * 100).toFixed(2));
            const quiz = this.getQuizById(result.quizId);
            const passed = percentage >= (quiz?.passingPercentage || 40);
            
            result.manualGradedScore = manualScore;
            result.score = totalScore;
            result.percentage = percentage;
            result.passed = passed;
            result.status = 'graded';
            result.gradedAt = new Date().toISOString();
        }
        
        localStorage.setItem('quizResults', JSON.stringify(results));
        return results[resultIndex];
    }

    // Bulk grade multiple answers for a result
    bulkGradeAnswers(resultId, gradings) {
        // gradings is array of {questionIndex, marks, feedback}
        let result = null;
        gradings.forEach(grading => {
            result = this.gradeAnswer(resultId, grading.questionIndex, grading.marks, grading.feedback);
        });
        return result;
    }

    // Get ungraded answers for a result
    getUngradedAnswers(resultId) {
        const results = this.getQuizResults();
        const result = results.find(r => r.id === parseInt(resultId));
        
        if (!result) return [];
        
        return result.answers
            .map((answer, index) => ({...answer, index}))
            .filter(a => a.marks === null && !a.autoGraded);
    }
}

// Initialize data manager
const dataManager = new DataManager();

