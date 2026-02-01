'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ArrowRight, BookOpen, Clock, Users, Calendar, Play,
  CheckCircle, Video, FileText, HelpCircle, Loader2, AlertCircle,
  Lock, Target, GraduationCap, Award, Star, Sparkles
} from 'lucide-react';
import { useCourse, useLessons, useEnrollments, useProgress } from '@/hooks/use-student-data';
import type { UserProgress } from '@/lib/student-api';

// ── Subject theming (consistent with courses list page) ───────────────────────

const SUBJECT_COLORS: Record<string, { text: string; icon: string; gradient: string }> = {
  quran:           { text: 'text-emerald-600', icon: 'text-emerald-500', gradient: 'from-emerald-600 to-emerald-800' },
  hadith:          { text: 'text-blue-600',    icon: 'text-blue-500',    gradient: 'from-blue-600 to-blue-800' },
  fiqh:            { text: 'text-purple-600',  icon: 'text-purple-500',  gradient: 'from-purple-600 to-purple-800' },
  aqeedah:         { text: 'text-indigo-600',  icon: 'text-indigo-500',  gradient: 'from-indigo-600 to-indigo-800' },
  seerah:          { text: 'text-amber-600',   icon: 'text-amber-500',   gradient: 'from-amber-600 to-amber-800' },
  arabic:          { text: 'text-teal-600',    icon: 'text-teal-500',    gradient: 'from-teal-600 to-teal-800' },
  islamic_history: { text: 'text-orange-600',  icon: 'text-orange-500',  gradient: 'from-orange-600 to-orange-800' },
  akhlaq:          { text: 'text-pink-600',    icon: 'text-pink-500',    gradient: 'from-pink-600 to-pink-800' },
  tajweed:         { text: 'text-cyan-600',    icon: 'text-cyan-500',    gradient: 'from-cyan-600 to-cyan-800' },
};

const SUBJECT_LABELS: Record<string, string> = {
  quran: 'Quran', hadith: 'Hadith', fiqh: 'Fiqh', aqeedah: 'Aqeedah',
  seerah: 'Seerah', arabic: 'Arabic', islamic_history: 'Islamic History',
  akhlaq: 'Akhlaq', tajweed: 'Tajweed',
};

const SUBJECT_BG_COLORS: Record<string, { bg: string; ring: string }> = {
  quran:           { bg: 'bg-emerald-50', ring: 'text-emerald-600' },
  hadith:          { bg: 'bg-blue-50',    ring: 'text-blue-600' },
  fiqh:            { bg: 'bg-purple-50',  ring: 'text-purple-600' },
  aqeedah:         { bg: 'bg-indigo-50',  ring: 'text-indigo-600' },
  seerah:          { bg: 'bg-amber-50',   ring: 'text-amber-600' },
  arabic:          { bg: 'bg-teal-50',    ring: 'text-teal-600' },
  islamic_history: { bg: 'bg-orange-50',  ring: 'text-orange-600' },
  akhlaq:          { bg: 'bg-pink-50',    ring: 'text-pink-600' },
  tajweed:         { bg: 'bg-cyan-50',    ring: 'text-cyan-600' },
};

const SUBJECT_RING_COLORS: Record<string, string> = {
  quran: '#059669', hadith: '#2563eb', fiqh: '#9333ea', aqeedah: '#4f46e5',
  seerah: '#d97706', arabic: '#0d9488', islamic_history: '#ea580c',
  akhlaq: '#db2777', tajweed: '#0891b2',
};

function getSubjectFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('quran') || t.includes('surah')) return 'quran';
  if (t.includes('hadith')) return 'hadith';
  if (t.includes('fiqh') || t.includes('islamic studies')) return 'fiqh';
  if (t.includes('aqeedah') || t.includes('aqidah')) return 'aqeedah';
  if (t.includes('seerah') || t.includes('prophet')) return 'seerah';
  if (t.includes('arabic')) return 'arabic';
  if (t.includes('history')) return 'islamic_history';
  if (t.includes('akhlaq')) return 'akhlaq';
  if (t.includes('tajweed')) return 'tajweed';
  return 'quran';
}

// ── Helper components ─────────────────────────────────────────────────────────

const LESSON_TYPE_ICONS: Record<string, React.ElementType> = {
  video: Video,
  reading: FileText,
  interactive: Play,
  quiz: HelpCircle,
  audio: Play,
};

const LESSON_TYPE_COLORS: Record<string, string> = {
  video: 'bg-blue-50 text-blue-600',
  reading: 'bg-amber-50 text-amber-600',
  interactive: 'bg-emerald-50 text-emerald-600',
  quiz: 'bg-purple-50 text-purple-600',
  audio: 'bg-pink-50 text-pink-600',
};

function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  ringColor,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  ringColor: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={ringColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
    </svg>
  );
}

function IslamicPatternOverlay() {
  return (
    <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="islamic-hero-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 15 L60 45 L30 60 L0 45 L0 15 Z" fill="none" stroke="white" strokeWidth="1" />
            <path d="M30 10 L50 20 L50 40 L30 50 L10 40 L10 20 Z" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-hero-pattern)" />
      </svg>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StudentCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  // TanStack Query hooks
  const { data: course, isLoading, error: courseError } = useCourse(courseId);
  const { data: lessonsData = [] } = useLessons({ course_id: courseId });
  const { data: enrollmentsData } = useEnrollments();
  const { data: courseProgress = [] } = useProgress({ course_id: courseId });

  const loading = isLoading;
  const error = courseError ? (courseError instanceof Error ? courseError.message : 'Failed to load course') : null;

  // Derive sorted lessons, enrollment, and progress map
  const lessons = useMemo(
    () => [...lessonsData].sort((a, b) => a.lesson_order - b.lesson_order),
    [lessonsData]
  );

  const enrollment = useMemo(
    () => (enrollmentsData?.enrollments || []).find(
      e => String(e.course?.id) === courseId || String(e.course?.documentId) === courseId
    ) || null,
    [enrollmentsData, courseId]
  );

  const lessonProgress = useMemo(() => {
    const progressMap = new Map<number, UserProgress>();
    courseProgress.forEach(p => {
      if (p.lesson) progressMap.set(p.lesson.id, p);
    });
    return progressMap;
  }, [courseProgress]);

  const completedLessons = lessons.filter(l => lessonProgress.get(l.id)?.status === 'completed').length;
  const overallProgress = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
  const totalDuration = lessons.reduce((sum, l) => sum + l.duration_minutes, 0);

  if (loading) {
    return (
      <StudentLayout title="Course" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </StudentLayout>
    );
  }

  if (error || !course) {
    return (
      <StudentLayout title="Course" subtitle="Error">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load course</h3>
          <p className="text-gray-500 mb-4">{error || 'Course not found'}</p>
          <Link href="/student/courses">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
            </Button>
          </Link>
        </Card>
      </StudentLayout>
    );
  }

  // ── Computed theme variables ──────────────────────────────────────────────
  const subjectKey = course.subject || getSubjectFromTitle(course.title);
  const colors = SUBJECT_COLORS[subjectKey] || SUBJECT_COLORS.quran;
  const bgColors = SUBJECT_BG_COLORS[subjectKey] || SUBJECT_BG_COLORS.quran;
  const ringColor = SUBJECT_RING_COLORS[subjectKey] || SUBJECT_RING_COLORS.quran;
  const subjectLabel = SUBJECT_LABELS[subjectKey] || subjectKey;

  const nextLesson = lessons.find(l => {
    const p = lessonProgress.get(l.id);
    return !p || p.status !== 'completed';
  }) || lessons[0];

  return (
    <StudentLayout title={course.title} subtitle={`${subjectLabel} | ${course.difficulty}`}>
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className={cn(
        'relative rounded-2xl overflow-hidden mb-8',
        `bg-gradient-to-br ${colors.gradient}`
      )}>
        <IslamicPatternOverlay />
        <div className="relative z-10 px-6 py-8 md:px-8 md:py-12">
          {/* Back button */}
          <Link href="/student/courses" className="inline-flex mb-6">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
            </Button>
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30">
              {subjectLabel}
            </Badge>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30 capitalize">
              {course.difficulty}
            </Badge>
            {course.age_tier && (
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30 capitalize">
                {course.age_tier}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {course.title}
          </h1>

          {/* Description */}
          {course.description && (
            <p className="text-white/80 text-base md:text-lg max-w-2xl mb-6 leading-relaxed">
              {course.description}
            </p>
          )}

          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {course.instructor}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {course.duration_weeks} weeks
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> {lessons.length} lessons
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {Math.round(totalDuration / 60)}h total
            </span>
            {course.schedule && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {course.schedule}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main column ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Progress Card ────────────────────────────────────────── */}
          <Card className="shadow-[var(--shadow-islamic)]">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Circular ring */}
                <div className="relative">
                  <CircularProgress value={overallProgress} size={120} strokeWidth={8} ringColor={ringColor} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4 flex-1 w-full">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', bgColors.bg)}>
                      <CheckCircle className={cn('h-4 w-4', colors.icon)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{completedLessons}</p>
                      <p className="text-xs text-gray-500">Lessons Done</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50">
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {enrollment ? Math.round(enrollment.total_time_spent_minutes / 60) : 0}h
                      </p>
                      <p className="text-xs text-gray-500">Time Spent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50">
                      <Calendar className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {enrollment
                          ? new Date(enrollment.enrollment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                          : '—'}
                      </p>
                      <p className="text-xs text-gray-500">Enrolled</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Curriculum ───────────────────────────────────────────── */}
          <Card className="shadow-[var(--shadow-islamic)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Curriculum</CardTitle>
                <span className="text-sm text-gray-500">{lessons.length} lessons</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y stagger-children">
                {lessons.map((lesson) => {
                  const progress = lessonProgress.get(lesson.id);
                  const isComplete = progress?.status === 'completed';
                  const isInProgress = progress?.status === 'in_progress';
                  const isNextUp = nextLesson && lesson.id === nextLesson.id && !isComplete;
                  const isLocked = !lesson.is_free && !enrollment;
                  const TypeIcon = LESSON_TYPE_ICONS[lesson.lesson_type] || FileText;
                  const typeColor = LESSON_TYPE_COLORS[lesson.lesson_type] || 'bg-gray-50 text-gray-600';

                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        'group flex items-center gap-4 px-6 py-4 transition-colors',
                        isNextUp && 'bg-gradient-to-r from-amber-50/50 to-transparent border-l-2 border-l-amber-400',
                        isLocked ? 'opacity-50 cursor-default' : 'hover:bg-gray-50 cursor-pointer',
                      )}
                      onClick={() => {
                        if (!isLocked) {
                          router.push(`/student/lessons/${lesson.documentId || lesson.id}`);
                        }
                      }}
                    >
                      {/* Lesson number */}
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0',
                        isComplete && `${bgColors.bg} ${colors.text}`,
                        isInProgress && 'bg-blue-50 text-blue-700 animate-pulse',
                        isLocked && 'bg-gray-100 text-gray-400',
                        !isComplete && !isInProgress && !isLocked && 'bg-gray-100 text-gray-500',
                      )}>
                        {isComplete ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : isLocked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          lesson.lesson_order
                        )}
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 truncate">{lesson.title}</h4>
                          {isNextUp && (
                            <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] px-1.5 py-0">
                              <Sparkles className="h-3 w-3 mr-0.5" /> Next Up
                            </Badge>
                          )}
                          {lesson.is_free && (
                            <Badge variant="secondary" className="text-xs">Free</Badge>
                          )}
                        </div>
                        {lesson.description && (
                          <p className="text-sm text-gray-500 truncate mt-0.5">{lesson.description}</p>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-sm text-gray-400 shrink-0">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', typeColor)}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <span className="hidden sm:inline">{lesson.duration_minutes} min</span>
                        {isComplete && (
                          <Badge className={cn('text-xs border-0', bgColors.bg, colors.text)}>Done</Badge>
                        )}
                        {isInProgress && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs border-0">In Progress</Badge>
                        )}
                        {/* Hover arrow */}
                        {!isLocked && (
                          <ArrowRight className="h-4 w-4 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {lessons.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No lessons available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <Card className="shadow-[var(--shadow-islamic)]">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextLesson && (
                <Button
                  className={cn('w-full text-white', `bg-gradient-to-r ${colors.gradient}`)}
                  onClick={() => router.push(`/student/lessons/${nextLesson.documentId || nextLesson.id}`)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {completedLessons > 0 ? 'Continue Learning' : 'Start Course'}
                </Button>
              )}
              <Link href="/student/lessons" className="block">
                <Button variant="outline" className={cn('w-full', colors.text)}>
                  <BookOpen className="h-4 w-4 mr-2" /> All My Lessons
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card className="shadow-[var(--shadow-islamic)]">
            <CardHeader>
              <CardTitle className="text-base">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 text-sm">
              {[
                { icon: Users, label: 'Instructor', value: course.instructor },
                { icon: BookOpen, label: 'Subject', value: subjectLabel },
                { icon: Target, label: 'Difficulty', value: course.difficulty },
                { icon: Calendar, label: 'Duration', value: `${course.duration_weeks} weeks` },
                { icon: GraduationCap, label: 'Students', value: String(course.current_enrollments) },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={cn(
                    'flex items-center justify-between py-3',
                    i < arr.length - 1 && 'border-b border-gray-100'
                  )}
                >
                  <span className="flex items-center gap-2 text-gray-500">
                    <row.icon className="h-4 w-4" /> {row.label}
                  </span>
                  <span className="font-medium capitalize">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          {course.learning_outcomes && course.learning_outcomes.length > 0 && (
            <Card className="shadow-[var(--shadow-islamic)]">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" /> What You&apos;ll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.learning_outcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className={cn('h-4 w-4 mt-0.5 shrink-0', colors.icon)} />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Enrollment Status */}
          {enrollment && (
            <Card className="shadow-[var(--shadow-islamic)]">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-500" /> Enrollment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 text-sm">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Status</span>
                  <Badge className={cn(
                    'border-0',
                    enrollment.enrollment_status === 'active' && 'bg-emerald-100 text-emerald-700',
                    enrollment.enrollment_status === 'completed' && 'bg-blue-100 text-blue-700',
                    enrollment.enrollment_status !== 'active' && enrollment.enrollment_status !== 'completed' && 'bg-gray-100 text-gray-700',
                  )}>
                    {enrollment.enrollment_status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Enrolled</span>
                  <span className="font-medium">{new Date(enrollment.enrollment_date).toLocaleDateString()}</span>
                </div>
                {enrollment.average_quiz_score !== undefined && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">Quiz Average</span>
                    <span className="font-medium">{enrollment.average_quiz_score}%</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500">Time Spent</span>
                  <span className="font-medium">{Math.round(enrollment.total_time_spent_minutes / 60)}h</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
