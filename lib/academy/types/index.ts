// lib/academy/types/index.ts
// Educational Platform Dashboard - Data Models
// Validates: Requirement 20.2

// === Union Types ===

export type UserRole = 'teacher' | 'student' | 'parent';

export type StudentType = 'regular' | 'non_native';

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'short_answer'
  | 'essay'
  | 'matching';

export type SubmissionStatus =
  | 'in_progress'
  | 'submitted'
  | 'graded'
  | 'partially_graded';

export type ReportPeriod = 'weekly' | 'monthly' | 'term';

export type NotificationType =
  | 'exam_published'
  | 'exam_graded'
  | 'report_generated'
  | 'homework_reminder'
  | 'attendance_alert';

export type AttendanceStatus = 'present' | 'absent' | 'late';

// === User Types ===

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string; // WhatsApp number (international format)
  avatarUrl?: string;
}

export interface Teacher extends User {
  role: 'teacher';
  subjects: string[];
  grades: string[];
}

export interface Student extends User {
  role: 'student';
  studentType: StudentType;
  grade: string;
  parentId?: string; // Only for regular students
  subjects: string[];
}

export interface Parent extends User {
  role: 'parent';
  childrenIds: string[];
}

// === Exam Types ===

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface QuestionMetadata {
  subject: string;
  grade: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  options?: AnswerOption[]; // For MCQ
  correctAnswer?: string | string[]; // For MCQ, T/F, short answer
  matchingPairs?: MatchingPair[]; // For matching
  metadata: QuestionMetadata;
}

export type ExamAssignment =
  | { type: 'all' }
  | { type: 'grade'; grade: string }
  | { type: 'students'; studentIds: string[] };

export interface Exam {
  id: string;
  title: string;
  subject: string;
  grade: string;
  teacherId: string;
  duration: number; // minutes
  instructions?: string;
  questions: Question[];
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: 'draft' | 'published' | 'closed';
  assignedTo: ExamAssignment;
  totalPoints: number;
  createdAt: string;
}

// === Submission Types ===

export interface Answer {
  questionId: string;
  value: string | string[];
  isAutoGraded?: boolean;
  score?: number;
  feedback?: string;
}

export interface Submission {
  id: string;
  examId: string;
  studentId: string;
  answers: Answer[];
  status: SubmissionStatus;
  startedAt: string;
  submittedAt?: string;
  totalScore?: number;
  percentage?: number;
  autoGradedScore?: number;
  manualGradedScore?: number;
}

// === Homework Types ===

export interface Homework {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  grade: string;
  subject: string;
  dueDate: string;
  fileTypeRequirements?: string;
  createdAt: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  googleDriveLink: string;
  submittedAt: string;
  isLate: boolean;
  status: 'submitted' | 'reviewed';
  feedback?: string;
}

// === Report Types ===

export interface AttendanceSummary {
  totalSessions: number;
  present: number;
  absent: number;
  late: number;
}

export interface Report {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  period: ReportPeriod;
  periodStart: string;
  periodEnd: string;
  averageScore: number;
  attendanceSummary: AttendanceSummary;
  teacherComments: string;
  createdAt: string;
}

// === Notification Types ===

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string; // Navigation target
  isRead: boolean;
  createdAt: string;
}

// === Attendance Types ===

export interface AttendanceRecord {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  session: string;
  status: AttendanceStatus;
}

// === Schedule Types ===

export interface ScheduleEntry {
  id: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  subject: string;
  teacherId: string;
  teacherName: string;
  grade: string;
  notes?: string;
  meetingLink?: string;
}

// === Progress Types ===

export interface SubjectAverage {
  subject: string;
  average: number;
  examCount: number;
}

export interface ScoreEntry {
  examId: string;
  examTitle: string;
  subject: string;
  score: number;
  percentage: number;
  date: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface PeriodComparison {
  currentAverage: number;
  previousAverage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ProgressStats {
  overallAverage: number;
  subjectAverages: SubjectAverage[];
  recentScores: ScoreEntry[];
  badges: Badge[];
  periodComparison: PeriodComparison;
}
