// lib/academy/services/mock-services.ts
// Mock implementation of AcademyServices using in-memory data
// Validates: Requirements 20.1, 6.1, 6.3

import type {
  User,
  Teacher,
  Student,
  Parent,
  UserRole,
  Exam,
  Question,
  Submission,
  Answer,
  Homework,
  HomeworkSubmission,
  Report,
  Notification,
  AttendanceRecord,
  AttendanceSummary,
  ScheduleEntry,
  ProgressStats,
  SubjectAverage,
  Badge,
  ScoreEntry,
} from '../types';

import type {
  AcademyServices,
  AuthService,
  ExamService,
  ExamFilters,
  QuestionBankService,
  QuestionFilters,
  SubmissionService,
  SubmissionFilters,
  HomeworkService,
  HomeworkFilters,
  ReportService,
  ReportFilters,
  NotificationService,
  AttendanceService,
  AttendanceFilters,
  ScheduleService,
  ScheduleFilters,
  ProgressService,
  UserService,
  UserFilters,
} from './index';

import {
  mockTeachers,
  mockStudents,
  mockParents,
  mockExams,
  mockSubmissions,
  mockHomework,
  mockHomeworkSubmissions,
  mockReports,
  mockNotifications,
  mockAttendanceRecords,
  mockScheduleEntries,
  mockQuestionBank,
} from '../mock-data';

import {
  autoGradeSubmission,
  calculateTotalScore,
  calculatePercentage,
  calculateAutoGradedScore,
  calculateManualGradedScore,
  determineSubmissionStatus,
  isValidGoogleDriveUrl,
  isLateSubmission,
} from './utils';

// === Helper: Generate unique IDs ===

let idCounter = 1000;
function generateId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

// === Mutable copies of mock data (for CRUD operations) ===

let exams = [...mockExams];
let submissions = [...mockSubmissions];
let questionBank = [...mockQuestionBank];
let homework = [...mockHomework];
let homeworkSubmissions = [...mockHomeworkSubmissions];
let reports = [...mockReports];
let notifications = [...mockNotifications];
let attendanceRecords = [...mockAttendanceRecords];
let scheduleEntries = [...mockScheduleEntries];

// === Current user state (mock auth) ===

let currentUser: User | null = null;

// === Auth Service ===

const mockAuthService: AuthService = {
  async login(email: string, _password: string): Promise<User | null> {
    const allUsers: User[] = [...mockTeachers, ...mockStudents, ...mockParents];
    const user = allUsers.find((u) => u.email === email);
    if (user) {
      currentUser = user;
      return user;
    }
    return null;
  },

  async logout(): Promise<void> {
    currentUser = null;
  },

  async getCurrentUser(): Promise<User | null> {
    return currentUser;
  },

  async getUserRole(): Promise<UserRole | null> {
    return currentUser?.role ?? null;
  },
};

// === Exam Service ===

const mockExamService: ExamService = {
  async createExam(examData): Promise<Exam> {
    const newExam: Exam = {
      ...examData,
      id: generateId('exam'),
      createdAt: new Date().toISOString(),
    };
    exams.push(newExam);
    return newExam;
  },

  async getExams(filters?: ExamFilters): Promise<Exam[]> {
    let result = [...exams];

    if (filters) {
      if (filters.teacherId) {
        result = result.filter((e) => e.teacherId === filters.teacherId);
      }
      if (filters.subject) {
        result = result.filter((e) => e.subject === filters.subject);
      }
      if (filters.grade) {
        result = result.filter((e) => e.grade === filters.grade);
      }
      if (filters.status) {
        result = result.filter((e) => e.status === filters.status);
      }
      if (filters.assignedTo) {
        const studentId = filters.assignedTo;
        const student = mockStudents.find((s) => s.id === studentId);
        result = result.filter((e) => {
          if (e.assignedTo.type === 'all') return true;
          if (e.assignedTo.type === 'grade') {
            return student?.grade === e.assignedTo.grade;
          }
          if (e.assignedTo.type === 'students') {
            return e.assignedTo.studentIds.includes(studentId);
          }
          return false;
        });
      }
    }

    return result;
  },

  async getExamById(examId: string): Promise<Exam | null> {
    return exams.find((e) => e.id === examId) ?? null;
  },

  async updateExam(examId: string, updates: Partial<Exam>): Promise<Exam> {
    const index = exams.findIndex((e) => e.id === examId);
    if (index === -1) throw new Error(`Exam not found: ${examId}`);
    exams[index] = { ...exams[index], ...updates };
    return exams[index];
  },

  async publishExam(examId: string): Promise<Exam> {
    return mockExamService.updateExam(examId, { status: 'published' });
  },

  async deleteExam(examId: string): Promise<void> {
    exams = exams.filter((e) => e.id !== examId);
  },
};

// === Question Bank Service ===

const mockQuestionBankService: QuestionBankService = {
  async saveQuestion(questionData): Promise<Question> {
    const newQuestion: Question = {
      ...questionData,
      id: generateId('q'),
    };
    questionBank.push(newQuestion);
    return newQuestion;
  },

  async getQuestions(filters?: QuestionFilters): Promise<Question[]> {
    let result = [...questionBank];

    if (filters) {
      if (filters.subject) {
        result = result.filter((q) => q.metadata.subject === filters.subject);
      }
      if (filters.grade) {
        result = result.filter((q) => q.metadata.grade === filters.grade);
      }
      if (filters.difficulty) {
        result = result.filter((q) => q.metadata.difficulty === filters.difficulty);
      }
      if (filters.type) {
        result = result.filter((q) => q.type === filters.type);
      }
    }

    return result;
  },

  async searchQuestions(query: string, filters?: QuestionFilters): Promise<Question[]> {
    const lowerQuery = query.toLowerCase();
    let result = questionBank.filter(
      (q) =>
        q.text.toLowerCase().includes(lowerQuery) ||
        (q.metadata.tags ?? []).some((tag) => tag.toLowerCase().includes(lowerQuery))
    );

    if (filters) {
      if (filters.subject) {
        result = result.filter((q) => q.metadata.subject === filters.subject);
      }
      if (filters.grade) {
        result = result.filter((q) => q.metadata.grade === filters.grade);
      }
      if (filters.difficulty) {
        result = result.filter((q) => q.metadata.difficulty === filters.difficulty);
      }
      if (filters.type) {
        result = result.filter((q) => q.type === filters.type);
      }
    }

    return result;
  },

  async deleteQuestion(questionId: string): Promise<void> {
    questionBank = questionBank.filter((q) => q.id !== questionId);
  },
};

// === Submission Service ===

const mockSubmissionService: SubmissionService = {
  async submitExam(submissionData): Promise<Submission> {
    // Find the exam to get questions for auto-grading
    const exam = exams.find((e) => e.id === submissionData.examId);
    if (!exam) throw new Error(`Exam not found: ${submissionData.examId}`);

    // Auto-grade MCQ and true/false answers
    const gradedAnswers = autoGradeSubmission(submissionData.answers, exam.questions);
    const autoScore = calculateAutoGradedScore(gradedAnswers);
    const status = determineSubmissionStatus(gradedAnswers, exam.questions);

    const newSubmission: Submission = {
      id: generateId('sub'),
      examId: submissionData.examId,
      studentId: submissionData.studentId,
      answers: gradedAnswers,
      status,
      startedAt: submissionData.startedAt,
      submittedAt: new Date().toISOString(),
      autoGradedScore: autoScore,
      ...(status === 'graded'
        ? {
            totalScore: autoScore,
            percentage: calculatePercentage(autoScore, exam.totalPoints),
          }
        : {}),
    };

    submissions.push(newSubmission);
    return newSubmission;
  },

  async getSubmissions(filters?: SubmissionFilters): Promise<Submission[]> {
    let result = [...submissions];

    if (filters) {
      if (filters.examId) {
        result = result.filter((s) => s.examId === filters.examId);
      }
      if (filters.studentId) {
        result = result.filter((s) => s.studentId === filters.studentId);
      }
      if (filters.status) {
        result = result.filter((s) => s.status === filters.status);
      }
      if (filters.grade) {
        // Filter by student grade
        const studentsInGrade = mockStudents
          .filter((st) => st.grade === filters.grade)
          .map((st) => st.id);
        result = result.filter((s) => studentsInGrade.includes(s.studentId));
      }
    }

    // Sort by submission date descending (most recent first)
    result.sort((a, b) => {
      const dateA = a.submittedAt ?? a.startedAt;
      const dateB = b.submittedAt ?? b.startedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return result;
  },

  async gradeSubmission(
    submissionId: string,
    grades: { questionId: string; score: number; feedback?: string }[]
  ): Promise<Submission> {
    const index = submissions.findIndex((s) => s.id === submissionId);
    if (index === -1) throw new Error(`Submission not found: ${submissionId}`);

    const submission = submissions[index];
    const exam = exams.find((e) => e.id === submission.examId);
    if (!exam) throw new Error(`Exam not found: ${submission.examId}`);

    // Apply manual grades to answers
    const updatedAnswers = submission.answers.map((answer) => {
      const grade = grades.find((g) => g.questionId === answer.questionId);
      if (grade) {
        return {
          ...answer,
          score: grade.score,
          feedback: grade.feedback,
        };
      }
      return answer;
    });

    const totalScore = calculateTotalScore(updatedAnswers);
    const percentage = calculatePercentage(totalScore, exam.totalPoints);
    const autoGradedScore = calculateAutoGradedScore(updatedAnswers);
    const manualGradedScore = calculateManualGradedScore(updatedAnswers);
    const status = determineSubmissionStatus(updatedAnswers, exam.questions);

    submissions[index] = {
      ...submission,
      answers: updatedAnswers,
      status,
      totalScore,
      percentage,
      autoGradedScore,
      manualGradedScore,
    };

    return submissions[index];
  },

  async getSubmissionById(submissionId: string): Promise<Submission | null> {
    return submissions.find((s) => s.id === submissionId) ?? null;
  },
};

// === Homework Service ===

const mockHomeworkService: HomeworkService = {
  async createHomework(homeworkData): Promise<Homework> {
    const newHomework: Homework = {
      ...homeworkData,
      id: generateId('hw'),
      createdAt: new Date().toISOString(),
    };
    homework.push(newHomework);
    return newHomework;
  },

  async getHomework(filters?: HomeworkFilters): Promise<Homework[]> {
    let result = [...homework];

    if (filters) {
      if (filters.teacherId) {
        result = result.filter((h) => h.teacherId === filters.teacherId);
      }
      if (filters.grade) {
        result = result.filter((h) => h.grade === filters.grade);
      }
      if (filters.subject) {
        result = result.filter((h) => h.subject === filters.subject);
      }
      if (filters.studentId) {
        // Filter homework by student's grade
        const student = mockStudents.find((s) => s.id === filters.studentId);
        if (student) {
          result = result.filter((h) => h.grade === student.grade);
        }
      }
    }

    return result;
  },

  async submitHomework(submissionData): Promise<HomeworkSubmission> {
    // Validate Google Drive URL
    if (!isValidGoogleDriveUrl(submissionData.googleDriveLink)) {
      throw new Error('Invalid Google Drive URL. Must be from drive.google.com or docs.google.com');
    }

    // Determine if late
    const hw = homework.find((h) => h.id === submissionData.homeworkId);
    if (!hw) throw new Error(`Homework not found: ${submissionData.homeworkId}`);

    const submittedAt = new Date().toISOString();
    const late = isLateSubmission(submittedAt, hw.dueDate);

    const newSubmission: HomeworkSubmission = {
      id: generateId('hwsub'),
      homeworkId: submissionData.homeworkId,
      studentId: submissionData.studentId,
      googleDriveLink: submissionData.googleDriveLink,
      submittedAt,
      isLate: late,
      status: 'submitted',
    };

    homeworkSubmissions.push(newSubmission);
    return newSubmission;
  },

  async getHomeworkSubmissions(homeworkId: string): Promise<HomeworkSubmission[]> {
    return homeworkSubmissions.filter((s) => s.homeworkId === homeworkId);
  },
};

// === Report Service ===

const mockReportService: ReportService = {
  async generateReport(reportData): Promise<Report> {
    const newReport: Report = {
      ...reportData,
      id: generateId('report'),
      createdAt: new Date().toISOString(),
    };
    reports.push(newReport);
    return newReport;
  },

  async getReports(filters?: ReportFilters): Promise<Report[]> {
    let result = [...reports];

    if (filters) {
      if (filters.studentId) {
        result = result.filter((r) => r.studentId === filters.studentId);
      }
      if (filters.teacherId) {
        result = result.filter((r) => r.teacherId === filters.teacherId);
      }
      if (filters.subject) {
        result = result.filter((r) => r.subject === filters.subject);
      }
      if (filters.period) {
        result = result.filter((r) => r.period === filters.period);
      }
    }

    return result;
  },

  async getReportById(reportId: string): Promise<Report | null> {
    return reports.find((r) => r.id === reportId) ?? null;
  },

  async exportReportPdf(_reportId: string): Promise<Blob> {
    // Mock PDF export - returns an empty blob
    return new Blob(['Mock PDF content'], { type: 'application/pdf' });
  },
};

// === Notification Service ===

const mockNotificationService: NotificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    return notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markAsRead(notificationId: string): Promise<void> {
    const index = notifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      notifications[index] = { ...notifications[index], isRead: true };
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    return notifications.filter((n) => n.userId === userId && !n.isRead).length;
  },
};

// === Attendance Service ===

const mockAttendanceService: AttendanceService = {
  async saveAttendance(records): Promise<AttendanceRecord[]> {
    const savedRecords = records.map((record) => ({
      ...record,
      id: generateId('att'),
    }));
    attendanceRecords.push(...savedRecords);
    return savedRecords;
  },

  async getAttendance(filters?: AttendanceFilters): Promise<AttendanceRecord[]> {
    let result = [...attendanceRecords];

    if (filters) {
      if (filters.studentId) {
        result = result.filter((r) => r.studentId === filters.studentId);
      }
      if (filters.teacherId) {
        result = result.filter((r) => r.teacherId === filters.teacherId);
      }
      if (filters.date) {
        result = result.filter((r) => r.date === filters.date);
      }
      if (filters.session) {
        result = result.filter((r) => r.session === filters.session);
      }
      if (filters.status) {
        result = result.filter((r) => r.status === filters.status);
      }
    }

    return result;
  },

  async getAttendanceStats(studentId: string): Promise<AttendanceSummary> {
    const records = attendanceRecords.filter((r) => r.studentId === studentId);
    return {
      totalSessions: records.length,
      present: records.filter((r) => r.status === 'present').length,
      absent: records.filter((r) => r.status === 'absent').length,
      late: records.filter((r) => r.status === 'late').length,
    };
  },
};

// === Schedule Service ===

const mockScheduleService: ScheduleService = {
  async getSchedule(filters?: ScheduleFilters): Promise<ScheduleEntry[]> {
    let result = [...scheduleEntries];

    if (filters) {
      if (filters.teacherId) {
        result = result.filter((e) => e.teacherId === filters.teacherId);
      }
      if (filters.grade) {
        result = result.filter((e) => e.grade === filters.grade);
      }
      if (filters.dayOfWeek !== undefined) {
        result = result.filter((e) => e.dayOfWeek === filters.dayOfWeek);
      }
    }

    // Sort by day of week, then start time
    result.sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return a.startTime.localeCompare(b.startTime);
    });

    return result;
  },

  async addScheduleEntry(entryData): Promise<ScheduleEntry> {
    const newEntry: ScheduleEntry = {
      ...entryData,
      id: generateId('sched'),
    };
    scheduleEntries.push(newEntry);
    return newEntry;
  },

  async updateScheduleEntry(entryId: string, updates: Partial<ScheduleEntry>): Promise<ScheduleEntry> {
    const index = scheduleEntries.findIndex((e) => e.id === entryId);
    if (index === -1) throw new Error(`Schedule entry not found: ${entryId}`);
    scheduleEntries[index] = { ...scheduleEntries[index], ...updates };
    return scheduleEntries[index];
  },
};

// === Progress Service ===

const mockProgressService: ProgressService = {
  async getProgressStats(studentId: string): Promise<ProgressStats> {
    // Get all graded submissions for this student
    const studentSubmissions = submissions.filter(
      (s) => s.studentId === studentId && s.status === 'graded' && s.percentage !== undefined
    );

    // Calculate overall average
    const overallAverage =
      studentSubmissions.length > 0
        ? studentSubmissions.reduce((sum, s) => sum + (s.percentage ?? 0), 0) /
          studentSubmissions.length
        : 0;

    // Calculate subject averages
    const subjectMap = new Map<string, { total: number; count: number }>();
    for (const sub of studentSubmissions) {
      const exam = exams.find((e) => e.id === sub.examId);
      if (exam) {
        const existing = subjectMap.get(exam.subject) ?? { total: 0, count: 0 };
        subjectMap.set(exam.subject, {
          total: existing.total + (sub.percentage ?? 0),
          count: existing.count + 1,
        });
      }
    }

    const subjectAverages: SubjectAverage[] = Array.from(subjectMap.entries()).map(
      ([subject, data]) => ({
        subject,
        average: Math.round((data.total / data.count) * 10) / 10,
        examCount: data.count,
      })
    );

    // Recent scores
    const recentScores: ScoreEntry[] = studentSubmissions
      .map((sub) => {
        const exam = exams.find((e) => e.id === sub.examId);
        return {
          examId: sub.examId,
          examTitle: exam?.title ?? 'Unknown',
          subject: exam?.subject ?? 'Unknown',
          score: sub.totalScore ?? 0,
          percentage: sub.percentage ?? 0,
          date: sub.submittedAt ?? sub.startedAt,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Mock badges
    const badges: Badge[] = [];
    if (studentSubmissions.length > 0) {
      badges.push({
        id: 'badge-first-exam',
        title: 'أول اختبار',
        description: 'أكملت أول اختبار لك',
        icon: '🎯',
        earnedAt: studentSubmissions[0].submittedAt ?? studentSubmissions[0].startedAt,
      });
    }
    if (studentSubmissions.some((s) => (s.percentage ?? 0) >= 90)) {
      badges.push({
        id: 'badge-high-score',
        title: 'متفوق',
        description: 'حصلت على 90% أو أكثر',
        icon: '⭐',
        earnedAt: new Date().toISOString(),
      });
    }

    // Period comparison (mock: current month vs previous month)
    const currentAverage = overallAverage;
    const previousAverage = currentAverage > 5 ? currentAverage - 5 : currentAverage + 3;
    const trend =
      currentAverage > previousAverage
        ? 'up'
        : currentAverage < previousAverage
          ? 'down'
          : 'stable';

    return {
      overallAverage: Math.round(overallAverage * 10) / 10,
      subjectAverages,
      recentScores,
      badges,
      periodComparison: {
        currentAverage: Math.round(currentAverage * 10) / 10,
        previousAverage: Math.round(previousAverage * 10) / 10,
        trend: trend as 'up' | 'down' | 'stable',
      },
    };
  },

  async getSubjectAverages(studentId: string): Promise<SubjectAverage[]> {
    const stats = await mockProgressService.getProgressStats(studentId);
    return stats.subjectAverages;
  },

  async getBadges(studentId: string): Promise<Badge[]> {
    const stats = await mockProgressService.getProgressStats(studentId);
    return stats.badges;
  },
};

// === User Service ===

const mockUserService: UserService = {
  async getStudents(filters?: UserFilters): Promise<Student[]> {
    let result = [...mockStudents];

    if (filters) {
      if (filters.grade) {
        result = result.filter((s) => s.grade === filters.grade);
      }
      if (filters.subject) {
        result = result.filter((s) => s.subjects.includes(filters.subject!));
      }
      if (filters.studentType) {
        result = result.filter((s) => s.studentType === filters.studentType);
      }
    }

    return result;
  },

  async getTeachers(): Promise<Teacher[]> {
    return [...mockTeachers];
  },

  async getParents(): Promise<Parent[]> {
    return [...mockParents];
  },

  async getUserById(userId: string): Promise<User | null> {
    const allUsers: User[] = [...mockTeachers, ...mockStudents, ...mockParents];
    return allUsers.find((u) => u.id === userId) ?? null;
  },
};

// === Main Service Export ===

export const mockAcademyServices: AcademyServices = {
  auth: mockAuthService,
  exams: mockExamService,
  questions: mockQuestionBankService,
  submissions: mockSubmissionService,
  homework: mockHomeworkService,
  reports: mockReportService,
  notifications: mockNotificationService,
  attendance: mockAttendanceService,
  schedule: mockScheduleService,
  progress: mockProgressService,
  users: mockUserService,
};
