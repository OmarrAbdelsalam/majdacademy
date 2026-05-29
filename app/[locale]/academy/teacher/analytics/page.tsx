'use client';

import { useEffect, useState } from 'react';
import { useAcademy } from '@/lib/academy/context/AcademyContext';
import { DistributionChart } from '@/app/components/academy/Charts';
import type { Exam, Submission, Student, AttendanceSummary } from '@/lib/academy/types';

interface ExamAnalytics {
  exam: Exam;
  averageScore: number;
  submissions: Submission[];
}

interface MissedQuestion {
  questionId: string;
  questionText: string;
  missedCount: number;
  totalAttempts: number;
}

interface DecliningStudent {
  student: Student;
  scores: number[];
}

export default function TeacherAnalyticsPage() {
  const { user, services, locale } = useAcademy();
  const isRTL = locale === 'ar';

  const [exams, setExams] = useState<Exam[]>([]);
  const [examAnalytics, setExamAnalytics] = useState<ExamAnalytics[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<{ label: string; value: number; color?: string }[]>([]);
  const [missedQuestions, setMissedQuestions] = useState<MissedQuestion[]>([]);
  const [decliningStudents, setDecliningStudents] = useState<DecliningStudent[]>([]);
  const [attendanceRates, setAttendanceRates] = useState<{ student: Student; rate: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamId, setSelectedExamId] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        const [examList, studentList] = await Promise.all([
          services.exams.getExams({ teacherId: user.id }),
          services.users.getStudents(),
        ]);
        setExams(examList);
        setStudents(studentList);

        // Load submissions for each exam and calculate analytics
        const analytics: ExamAnalytics[] = [];
        const allSubmissions: Submission[] = [];

        for (const exam of examList) {
          const subs = await services.submissions.getSubmissions({ examId: exam.id });
          const gradedSubs = subs.filter((s) => s.percentage !== undefined);
          const avg = gradedSubs.length > 0
            ? gradedSubs.reduce((sum, s) => sum + (s.percentage || 0), 0) / gradedSubs.length
            : 0;
          analytics.push({ exam, averageScore: Math.round(avg * 10) / 10, submissions: subs });
          allSubmissions.push(...subs);
        }
        setExamAnalytics(analytics);

        // Calculate grade distribution from all graded submissions
        const gradedSubs = allSubmissions.filter((s) => s.percentage !== undefined);
        const distribution = calculateGradeDistribution(gradedSubs);
        setGradeDistribution(distribution);

        // Calculate attendance rates
        const rates: { student: Student; rate: number }[] = [];
        for (const student of studentList) {
          const stats = await services.attendance.getAttendanceStats(student.id);
          const rate = stats.totalSessions > 0
            ? Math.round((stats.present / stats.totalSessions) * 100)
            : 0;
          rates.push({ student, rate });
        }
        setAttendanceRates(rates);

        // Detect declining students
        const declining = detectDecliningStudents(studentList, allSubmissions);
        setDecliningStudents(declining);

        // Set default selected exam for missed questions
        if (examList.length > 0) {
          setSelectedExamId(examList[0].id);
          const missed = calculateMissedQuestions(examList[0], allSubmissions);
          setMissedQuestions(missed);
        }
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [services, user.id]);

  function calculateGradeDistribution(submissions: Submission[]): { label: string; value: number; color?: string }[] {
    const buckets = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    for (const sub of submissions) {
      const pct = sub.percentage || 0;
      if (pct >= 90) buckets.A++;
      else if (pct >= 80) buckets.B++;
      else if (pct >= 70) buckets.C++;
      else if (pct >= 60) buckets.D++;
      else buckets.F++;
    }
    return [
      { label: 'A (90-100)', value: buckets.A, color: '#22c55e' },
      { label: 'B (80-89)', value: buckets.B, color: '#3b82f6' },
      { label: 'C (70-79)', value: buckets.C, color: '#f59e0b' },
      { label: 'D (60-69)', value: buckets.D, color: '#f97316' },
      { label: 'F (<60)', value: buckets.F, color: '#ef4444' },
    ];
  }

  function calculateMissedQuestions(exam: Exam, allSubmissions: Submission[]): MissedQuestion[] {
    const examSubs = allSubmissions.filter((s) => s.examId === exam.id);
    const questionMisses: Record<string, { missed: number; total: number }> = {};

    for (const question of exam.questions) {
      questionMisses[question.id] = { missed: 0, total: 0 };
    }

    for (const sub of examSubs) {
      for (const answer of sub.answers) {
        if (questionMisses[answer.questionId]) {
          questionMisses[answer.questionId].total++;
          if (answer.isAutoGraded && answer.score === 0) {
            questionMisses[answer.questionId].missed++;
          }
        }
      }
    }

    return exam.questions
      .map((q) => ({
        questionId: q.id,
        questionText: q.text,
        missedCount: questionMisses[q.id]?.missed || 0,
        totalAttempts: questionMisses[q.id]?.total || 0,
      }))
      .filter((q) => q.missedCount > 0)
      .sort((a, b) => b.missedCount - a.missedCount);
  }

  function detectDecliningStudents(studentList: Student[], allSubmissions: Submission[]): DecliningStudent[] {
    const declining: DecliningStudent[] = [];

    for (const student of studentList) {
      const studentSubs = allSubmissions
        .filter((s) => s.studentId === student.id && s.percentage !== undefined)
        .sort((a, b) => new Date(a.submittedAt || a.startedAt).getTime() - new Date(b.submittedAt || b.startedAt).getTime());

      if (studentSubs.length >= 3) {
        const lastThree = studentSubs.slice(-3).map((s) => s.percentage || 0);
        // Declining if each score is lower than the previous
        if (lastThree[0] > lastThree[1] && lastThree[1] > lastThree[2]) {
          declining.push({ student, scores: lastThree });
        }
      }
    }

    return declining;
  }

  function handleExamChange(examId: string) {
    setSelectedExamId(examId);
    const exam = exams.find((e) => e.id === examId);
    if (exam) {
      const allSubs = examAnalytics.flatMap((ea) => ea.submissions);
      const missed = calculateMissedQuestions(exam, allSubs);
      setMissedQuestions(missed);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0548B]" />
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isRTL ? 'الإحصائيات والتحليلات' : 'Analytics & Statistics'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isRTL ? 'تحليل أداء الطلاب والصفوف' : 'Analyze student and class performance'}
        </p>
      </div>

      {/* Class Average Scores per Exam */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isRTL ? 'متوسط الدرجات لكل اختبار' : 'Average Scores per Exam'}
        </h2>
        {examAnalytics.length === 0 ? (
          <p className="text-sm text-gray-400">{isRTL ? 'لا توجد بيانات' : 'No data available'}</p>
        ) : (
          <div className="space-y-3">
            {examAnalytics.map((ea) => (
              <div key={ea.exam.id} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{ea.exam.title}</p>
                  <p className="text-xs text-gray-400">{ea.exam.subject}</p>
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F0548B] rounded-full"
                    style={{ width: `${ea.averageScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-12 text-end">
                  {ea.averageScore}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grade Distribution Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isRTL ? 'توزيع الدرجات' : 'Grade Distribution'}
        </h2>
        <DistributionChart data={gradeDistribution} height={220} locale={locale} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Most Commonly Missed Questions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isRTL ? 'الأسئلة الأكثر خطأً' : 'Most Missed Questions'}
            </h2>
            <select
              value={selectedExamId}
              onChange={(e) => handleExamChange(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 rounded-lg"
            >
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>{exam.title}</option>
              ))}
            </select>
          </div>
          {missedQuestions.length === 0 ? (
            <p className="text-sm text-gray-400">{isRTL ? 'لا توجد بيانات' : 'No missed questions'}</p>
          ) : (
            <div className="space-y-2">
              {missedQuestions.slice(0, 5).map((mq, idx) => (
                <div key={mq.questionId} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs flex items-center justify-center font-medium">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{mq.questionText}</p>
                    <p className="text-xs text-gray-400">
                      {mq.missedCount}/{mq.totalAttempts} {isRTL ? 'أخطأوا' : 'missed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attendance/Participation Rates */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {isRTL ? 'نسب الحضور والمشاركة' : 'Attendance & Participation Rates'}
          </h2>
          {attendanceRates.length === 0 ? (
            <p className="text-sm text-gray-400">{isRTL ? 'لا توجد بيانات' : 'No data'}</p>
          ) : (
            <div className="space-y-3">
              {attendanceRates
                .sort((a, b) => b.rate - a.rate)
                .map(({ student, rate }) => (
                  <div key={student.id} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 w-32 truncate">{student.name}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          rate >= 80 ? 'bg-green-500' : rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-10 text-end">{rate}%</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Declining Students */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isRTL ? '⚠️ طلاب بأداء متراجع' : '⚠️ Declining Students'}
        </h2>
        <p className="text-xs text-gray-400 mb-3">
          {isRTL
            ? 'طلاب انخفضت درجاتهم في آخر 3 اختبارات متتالية'
            : 'Students whose scores declined over the last 3 consecutive exams'}
        </p>
        {decliningStudents.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            {isRTL ? 'لا يوجد طلاب بأداء متراجع حالياً' : 'No declining students currently'}
          </div>
        ) : (
          <div className="space-y-3">
            {decliningStudents.map(({ student, scores }) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm">
                    ⚠️
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {scores.map((score, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 text-xs rounded ${
                        idx === scores.length - 1
                          ? 'bg-red-200 text-red-800 font-medium'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {score}%
                    </span>
                  ))}
                  <span className="text-red-500 text-sm">↓</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
