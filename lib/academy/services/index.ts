// lib/academy/services/index.ts
// Educational Platform Dashboard - Service Layer Interfaces
// Validates: Requirements 20.1, 20.3
//
// This file defines the service interfaces for the academy platform.
// The mock implementation can be swapped with real API calls by providing
// a different implementation of AcademyServices without modifying UI components.

import type {
  User,
  Teacher,
  Student,
  Parent,
  UserRole,
  Exam,
  ExamAssignment,
  Question,
  QuestionMetadata,
  Submission,
  Answer,
  Homework,
  HomeworkSubmission,
  Report,
  ReportPeriod,
  Notification,
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
  ScheduleEntry,
  ProgressStats,
  SubjectAverage,
  Badge,
} from '../types';

// === Auth Service ===

export interface AuthService {
  login(email: string, password: string): Promise<User | null>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getUserRole(): Promise<UserRole | null>;
}

// === Exam Service ===

export interface ExamService {
  createExam(exam: Omit<Exam, 'id' | 'createdAt'>): Promise<Exam>;
  getExams(filters?: ExamFilters): Promise<Exam[]>;
  getExamById(examId: string): Promise<Exam | null>;
  updateExam(examId: string, updates: Partial<Exam>): Promise<Exam>;
  publishExam(examId: string): Promise<Exam>;
  deleteExam(examId: string): Promise<void>;
}

export interface ExamFilters {
  teacherId?: string;
  subject?: string;
  grade?: string;
  status?: Exam['status'];
  assignedTo?: string; // studentId - returns exams assigned to this student
}

// === Question Bank Service ===

export interface QuestionBankService {
  saveQuestion(question: Omit<Question, 'id'>): Promise<Question>;
  getQuestions(filters?: QuestionFilters): Promise<Question[]>;
  searchQuestions(query: string, filters?: QuestionFilters): Promise<Question[]>;
  deleteQuestion(questionId: string): Promise<void>;
}

export interface QuestionFilters {
  subject?: string;
  grade?: string;
  difficulty?: QuestionMetadata['difficulty'];
  type?: Question['type'];
}

// === Submission Service ===

export interface SubmissionService {
  submitExam(submission: Omit<Submission, 'id' | 'status' | 'submittedAt'>): Promise<Submission>;
  getSubmissions(filters?: SubmissionFilters): Promise<Submission[]>;
  gradeSubmission(
    submissionId: string,
    grades: { questionId: string; score: number; feedback?: string }[]
  ): Promise<Submission>;
  getSubmissionById(submissionId: string): Promise<Submission | null>;
}

export interface SubmissionFilters {
  examId?: string;
  studentId?: string;
  status?: Submission['status'];
  grade?: string;
}

// === Homework Service ===

export interface HomeworkService {
  createHomework(homework: Omit<Homework, 'id' | 'createdAt'>): Promise<Homework>;
  getHomework(filters?: HomeworkFilters): Promise<Homework[]>;
  submitHomework(
    submission: Omit<HomeworkSubmission, 'id' | 'submittedAt' | 'isLate' | 'status'>
  ): Promise<HomeworkSubmission>;
  getHomeworkSubmissions(homeworkId: string): Promise<HomeworkSubmission[]>;
}

export interface HomeworkFilters {
  teacherId?: string;
  grade?: string;
  subject?: string;
  studentId?: string;
}

// === Report Service ===

export interface ReportService {
  generateReport(
    report: Omit<Report, 'id' | 'createdAt'>
  ): Promise<Report>;
  getReports(filters?: ReportFilters): Promise<Report[]>;
  getReportById(reportId: string): Promise<Report | null>;
  exportReportPdf(reportId: string): Promise<Blob>;
}

export interface ReportFilters {
  studentId?: string;
  teacherId?: string;
  subject?: string;
  period?: ReportPeriod;
}

// === Notification Service ===

export interface NotificationService {
  getNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}

// === Attendance Service ===

export interface AttendanceService {
  saveAttendance(
    records: Omit<AttendanceRecord, 'id'>[]
  ): Promise<AttendanceRecord[]>;
  getAttendance(filters?: AttendanceFilters): Promise<AttendanceRecord[]>;
  getAttendanceStats(studentId: string): Promise<AttendanceSummary>;
}

export interface AttendanceFilters {
  studentId?: string;
  teacherId?: string;
  date?: string;
  session?: string;
  status?: AttendanceStatus;
}

// === Schedule Service ===

export interface ScheduleService {
  getSchedule(filters?: ScheduleFilters): Promise<ScheduleEntry[]>;
  addScheduleEntry(entry: Omit<ScheduleEntry, 'id'>): Promise<ScheduleEntry>;
  updateScheduleEntry(
    entryId: string,
    updates: Partial<ScheduleEntry>
  ): Promise<ScheduleEntry>;
}

export interface ScheduleFilters {
  teacherId?: string;
  grade?: string;
  dayOfWeek?: number;
}

// === Progress Service ===

export interface ProgressService {
  getProgressStats(studentId: string): Promise<ProgressStats>;
  getSubjectAverages(studentId: string): Promise<SubjectAverage[]>;
  getBadges(studentId: string): Promise<Badge[]>;
}

// === User Service ===

export interface UserService {
  getStudents(filters?: UserFilters): Promise<Student[]>;
  getTeachers(): Promise<Teacher[]>;
  getParents(): Promise<Parent[]>;
  getUserById(userId: string): Promise<User | null>;
}

export interface UserFilters {
  grade?: string;
  subject?: string;
  studentType?: Student['studentType'];
}

// === Main Service Interface ===
// Requirement 20.3: Allows replacing mock with real API calls
// by providing a different implementation of this interface.

export interface AcademyServices {
  auth: AuthService;
  exams: ExamService;
  questions: QuestionBankService;
  submissions: SubmissionService;
  homework: HomeworkService;
  reports: ReportService;
  notifications: NotificationService;
  attendance: AttendanceService;
  schedule: ScheduleService;
  progress: ProgressService;
  users: UserService;
}
