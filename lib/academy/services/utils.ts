// lib/academy/services/utils.ts
// Shared utility functions for the academy service layer
// Validates: Requirements 6.1, 6.3, 7.2, 7.5, 12.1, 12.4

import type { Question, Answer, Submission } from '../types';

// === Auto-Grading ===

/**
 * Auto-grade a single answer for MCQ or true/false questions.
 * Compares student answer to the question's correctAnswer.
 * Returns the score (full points if correct, 0 if incorrect).
 */
export function autoGradeAnswer(question: Question, answer: Answer): Answer {
  if (question.type !== 'multiple_choice' && question.type !== 'true_false') {
    return answer;
  }

  const studentValue = Array.isArray(answer.value) ? answer.value[0] : answer.value;
  const correctValue = Array.isArray(question.correctAnswer)
    ? question.correctAnswer[0]
    : question.correctAnswer;

  const isCorrect = studentValue === correctValue;

  return {
    ...answer,
    isAutoGraded: true,
    score: isCorrect ? question.points : 0,
  };
}

/**
 * Auto-grade all auto-gradable answers in a submission.
 * MCQ and true/false are auto-graded; essay, short_answer, and matching are left for manual review.
 */
export function autoGradeSubmission(
  answers: Answer[],
  questions: Question[]
): Answer[] {
  return answers.map((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return answer;
    return autoGradeAnswer(question, answer);
  });
}

// === Score Calculation ===

/**
 * Calculate total score from graded answers.
 * Only counts answers that have a defined score.
 */
export function calculateTotalScore(answers: Answer[]): number {
  return answers.reduce((sum, a) => sum + (a.score ?? 0), 0);
}

/**
 * Calculate percentage: (totalScore / totalPoints) * 100.
 * Returns 0 if totalPoints is 0.
 */
export function calculatePercentage(totalScore: number, totalPoints: number): number {
  if (totalPoints === 0) return 0;
  return Math.round((totalScore / totalPoints) * 100 * 10) / 10;
}

/**
 * Calculate auto-graded score (sum of scores from auto-graded answers only).
 */
export function calculateAutoGradedScore(answers: Answer[]): number {
  return answers
    .filter((a) => a.isAutoGraded)
    .reduce((sum, a) => sum + (a.score ?? 0), 0);
}

/**
 * Calculate manually graded score (sum of scores from non-auto-graded answers).
 */
export function calculateManualGradedScore(answers: Answer[]): number {
  return answers
    .filter((a) => !a.isAutoGraded && a.score !== undefined)
    .reduce((sum, a) => sum + (a.score ?? 0), 0);
}

/**
 * Determine submission status based on graded answers and question types.
 * - If all questions are auto-gradable (MCQ/T-F) → 'graded'
 * - If some manual questions have scores → 'partially_graded'
 * - Otherwise → 'submitted'
 */
export function determineSubmissionStatus(
  answers: Answer[],
  questions: Question[]
): Submission['status'] {
  const allAutoGradable = questions.every(
    (q) => q.type === 'multiple_choice' || q.type === 'true_false'
  );

  if (allAutoGradable) return 'graded';

  const manualQuestions = questions.filter(
    (q) => q.type !== 'multiple_choice' && q.type !== 'true_false'
  );

  const manualAnswers = answers.filter((a) =>
    manualQuestions.some((q) => q.id === a.questionId)
  );

  const allManualGraded = manualAnswers.length > 0 &&
    manualAnswers.every((a) => a.score !== undefined);

  if (allManualGraded) return 'graded';

  const someManualGraded = manualAnswers.some((a) => a.score !== undefined);
  if (someManualGraded) return 'partially_graded';

  return 'submitted';
}

// === URL Validation ===

/**
 * Validate a Google Drive URL.
 * Accepts drive.google.com and docs.google.com URLs.
 */
export function isValidGoogleDriveUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return (
      hostname === 'drive.google.com' ||
      hostname === 'docs.google.com'
    );
  } catch {
    return false;
  }
}

// === WhatsApp Link Generation ===

/**
 * Generate a WhatsApp deep link from a phone number.
 * Strips all non-digit characters and formats as https://wa.me/{digits}.
 */
export function generateWhatsAppLink(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  return `https://wa.me/${digitsOnly}`;
}

// === Late Submission Detection ===

/**
 * Determine if a submission is late by comparing submission time to due date.
 */
export function isLateSubmission(submittedAt: string, dueDate: string): boolean {
  return new Date(submittedAt).getTime() > new Date(dueDate).getTime();
}

// === Exam Timer ===

/**
 * Calculate remaining time for an exam.
 * Returns remaining seconds, clamped to zero minimum.
 */
export function calculateRemainingTime(
  durationMinutes: number,
  elapsedSeconds: number
): number {
  const totalSeconds = durationMinutes * 60;
  return Math.max(0, totalSeconds - elapsedSeconds);
}
