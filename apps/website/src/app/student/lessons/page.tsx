'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StudentLayout } from '@/components/layout/student-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  BookOpen, Clock, Play, CheckCircle, Search,
  FileText, Video, HelpCircle, Loader2, AlertCircle, Filter,
  ArrowRight, Sparkles, BarChart3, ArrowUpDown
} from 'lucide-react';
import { useLessons, useCourses, useProgress } from '@/hooks/use-student-data';
import type { Lesson, Course, UserProgress } from '@/lib/student-api';

// ── Subject theming (consistent with course detail page) ─────────────────────

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

const SUBJECT_LABELS: Record<string, string> = {
  quran: 'Quran', hadith: 'Hadith', fiqh: 'Fiqh', aqeedah: 'Aqeedah',
  seerah: 'Seerah', arabic: 'Arabic', islamic_history: 'Islamic History',
  akhlaq: 'Akhlaq', tajweed: 'Tajweed',
};

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

// ── Mini circular progress for stats row ─────────────────────────────────────

function MiniCircularProgress({ value, size = 40, strokeWidth = 3, ringColor }: {
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
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={ringColor} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
    </svg>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

interface LessonWithProgress extends Lesson {
  courseName: string;
  courseId: string;
  progress: UserProgress | null;
  status: 'completed' | 'in_progress' | 'not_started';
  subject: string;
}

// ── Mock data ────────────────────────────────────────────────────────────────

const mockLessons: LessonWithProgress[] = [
  {
    id: 1, documentId: '1', title: 'Introduction to Tajweed Rules', slug: 'intro-tajweed',
    description: 'Learn the fundamental rules of Quran recitation', lesson_order: 1,
    lesson_type: 'video', duration_minutes: 45, content: '', learning_objectives: [],
    is_free: true, is_preview: false, courseName: 'Quran Memorization - Juz 30', courseId: '1',
    progress: null, status: 'completed', subject: 'quran',
  },
  {
    id: 2, documentId: '2', title: 'Surah An-Naba - Verses 1-10', slug: 'naba-1-10',
    description: 'Memorization and tafsir of the first ten verses', lesson_order: 2,
    lesson_type: 'reading', duration_minutes: 60, content: '', learning_objectives: [],
    is_free: false, is_preview: false, courseName: 'Quran Memorization - Juz 30', courseId: '1',
    progress: null, status: 'completed', subject: 'quran',
  },
  {
    id: 3, documentId: '3', title: 'Surah An-Naba - Verses 11-20', slug: 'naba-11-20',
    description: 'Continue memorization with detailed explanation', lesson_order: 3,
    lesson_type: 'reading', duration_minutes: 60, content: '', learning_objectives: [],
    is_free: false, is_preview: false, courseName: 'Quran Memorization - Juz 30', courseId: '1',
    progress: null, status: 'in_progress', subject: 'quran',
  },
  {
    id: 4, documentId: '4', title: 'Pillars of Islam - Overview', slug: 'pillars-overview',
    description: 'The five pillars and their significance', lesson_order: 1,
    lesson_type: 'video', duration_minutes: 30, content: '', learning_objectives: [],
    is_free: true, is_preview: false, courseName: 'Islamic Studies - Fiqh', courseId: '2',
    progress: null, status: 'completed', subject: 'fiqh',
  },
  {
    id: 5, documentId: '5', title: 'Rules of Wudu', slug: 'rules-wudu',
    description: 'Detailed study of ablution rules and conditions', lesson_order: 2,
    lesson_type: 'interactive', duration_minutes: 40, content: '', learning_objectives: [],
    is_free: false, is_preview: false, courseName: 'Islamic Studies - Fiqh', courseId: '2',
    progress: null, status: 'in_progress', subject: 'fiqh',
  },
  {
    id: 6, documentId: '6', title: 'Arabic Alphabet - Part 1', slug: 'arabic-alphabet-1',
    description: 'Letters, pronunciation, and basic forms', lesson_order: 1,
    lesson_type: 'interactive', duration_minutes: 35, content: '', learning_objectives: [],
    is_free: true, is_preview: false, courseName: 'Arabic Language - Level 2', courseId: '3',
    progress: null, status: 'not_started', subject: 'arabic',
  },
];

// ── Main component ───────────────────────────────────────────────────────────

export default function StudentLessonsPage() {
  const router = useRouter();

  // TanStack Query hooks
  const { data: apiLessons = [], isLoading: lessonsLoading, isError: lessonsError } = useLessons();
  const { data: apiCourses = [] } = useCourses();
  const { data: userProgress = [] } = useProgress();

  // Local filter/sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lesson_order');

  // Derive LessonWithProgress[] from TQ results
  const { lessons, dataSource } = useMemo(() => {
    if (apiLessons.length > 0) {
      const courseMap = new Map<number, Course>();
      apiCourses.forEach(c => courseMap.set(c.id, c));

      const progressMap = new Map<number, UserProgress>();
      userProgress.forEach(p => {
        if (p.lesson) progressMap.set(p.lesson.id, p);
      });

      const transformed: LessonWithProgress[] = apiLessons.map(lesson => {
        const course = lesson.course ? courseMap.get(lesson.course.id) : null;
        const progress = progressMap.get(lesson.id) || null;
        const status = progress?.status || 'not_started';
        const subject = course?.subject
          || getSubjectFromTitle(course?.title || lesson.course?.title || '');

        return {
          ...lesson,
          courseName: course?.title || lesson.course?.title || 'Unknown Course',
          courseId: String(course?.documentId || course?.id || lesson.course?.id || ''),
          progress,
          status: status as 'completed' | 'in_progress' | 'not_started',
          subject,
        };
      });

      return { lessons: transformed, dataSource: 'api' as const };
    }
    return { lessons: mockLessons, dataSource: 'mock' as const };
  }, [apiLessons, apiCourses, userProgress]);

  // Use mock data on error
  const effectiveLessons = lessonsError ? mockLessons : lessons;
  const effectiveDataSource = lessonsError ? 'mock' : dataSource;

  const courseNames = useMemo(() => {
    return [...new Map(effectiveLessons.map(l => [l.courseId, { id: l.courseId, name: l.courseName }])).values()];
  }, [effectiveLessons]);

  const loading = lessonsLoading;

  const filteredLessons = effectiveLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || lesson.courseId === courseFilter;
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const sortLessons = (items: LessonWithProgress[]) => {
    const sorted = [...items];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id);
      case 'oldest':
        return sorted.sort((a, b) => a.id - b.id);
      case 'duration_short':
        return sorted.sort((a, b) => a.duration_minutes - b.duration_minutes);
      case 'duration_long':
        return sorted.sort((a, b) => b.duration_minutes - a.duration_minutes);
      case 'alpha_az':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'alpha_za':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'lesson_order':
      default:
        return sorted.sort((a, b) => a.courseName.localeCompare(b.courseName) || a.lesson_order - b.lesson_order);
    }
  };

  const sortedFiltered = sortLessons(filteredLessons);
  const inProgressLessons = sortedFiltered.filter(l => l.status === 'in_progress');
  const notStartedLessons = sortedFiltered.filter(l => l.status === 'not_started');
  const completedLessons2 = sortedFiltered.filter(l => l.status === 'completed');

  const completedCount = effectiveLessons.filter(l => l.status === 'completed').length;
  const inProgressCount = effectiveLessons.filter(l => l.status === 'in_progress').length;
  const totalMinutes = effectiveLessons.reduce((sum, l) => sum + l.duration_minutes, 0);
  const overallProgress = effectiveLessons.length > 0 ? Math.round((completedCount / effectiveLessons.length) * 100) : 0;

  if (loading) {
    return (
      <StudentLayout title="My Lessons" subtitle="Track your lesson progress">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="My Lessons" subtitle="Track your lesson progress">
      {/* Data Source */}
      <div className="mb-4">
        {effectiveDataSource === 'api' ? (
          <Badge className="bg-emerald-100 text-emerald-700">
            <CheckCircle className="h-3 w-3 mr-1" /> Live Data
          </Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-700">
            <AlertCircle className="h-3 w-3 mr-1" /> Demo Mode
          </Badge>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-[var(--shadow-islamic)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{effectiveLessons.length}</p>
              <p className="text-sm text-gray-500">Total Lessons</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-[var(--shadow-islamic)]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <MiniCircularProgress value={overallProgress} size={40} strokeWidth={3} ringColor="#059669" />
              <CheckCircle className="h-4 w-4 text-emerald-600 absolute" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-[var(--shadow-islamic)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Play className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgressCount}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-[var(--shadow-islamic)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(totalMinutes / 60)}h</p>
              <p className="text-sm text-gray-500">Total Duration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search / Filter Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-[var(--shadow-islamic)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search lessons..."
              className="pl-9 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-400 hidden sm:block shrink-0" />
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-48 rounded-lg">
                <span className="truncate">
                  {courseFilter === 'all'
                    ? 'All Courses'
                    : courseNames.find(c => c.id === courseFilter)?.name || 'All Courses'}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courseNames.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 rounded-lg">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
              </SelectContent>
            </Select>
            <ArrowUpDown className="h-4 w-4 text-gray-400 hidden sm:block shrink-0" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-44 rounded-lg">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lesson_order">Lesson Order</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="duration_short">Duration: Short → Long</SelectItem>
                <SelectItem value="duration_long">Duration: Long → Short</SelectItem>
                <SelectItem value="alpha_az">Title: A → Z</SelectItem>
                <SelectItem value="alpha_za">Title: Z → A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Lesson Sections (grouped by status) */}
      {[
        { key: 'in_progress', title: 'In Progress', items: inProgressLessons, accent: 'text-amber-600' },
        { key: 'not_started', title: 'Not Started', items: notStartedLessons, accent: 'text-gray-600' },
        { key: 'completed', title: 'Completed', items: completedLessons2, accent: 'text-emerald-600' },
      ].map(section => section.items.length > 0 && (
        <div key={section.key} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn('text-xl font-bold', section.accent)}>{section.title}</h2>
            <span className="text-sm text-gray-500">
              {section.items.length} lesson{section.items.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
            {section.items.map((lesson) => {
              const colors = SUBJECT_COLORS[lesson.subject] || SUBJECT_COLORS.quran;
              const subjectLabel = SUBJECT_LABELS[lesson.subject] || lesson.subject;
              const isInProgress = lesson.status === 'in_progress';
              const isCompleted = lesson.status === 'completed';

              return (
                <div
                  key={lesson.id}
                  className={cn(
                    'bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer',
                    isInProgress && 'border-amber-200 ring-1 ring-amber-100',
                  )}
                  onClick={() => router.push(`/student/lessons/${lesson.documentId || lesson.id}`)}
                >
                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Subject tag */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <BarChart3 className={cn('h-4 w-4', colors.icon)} />
                      <span className={cn('text-sm font-semibold', colors.text)}>{subjectLabel}</span>
                    </div>

                    {/* Title */}
                    <h3 className={cn(
                      'text-[17px] font-bold leading-snug mb-1 line-clamp-2',
                      isCompleted ? 'text-gray-400' : 'text-gray-900',
                    )}>
                      {lesson.title}
                    </h3>

                    {/* Course name */}
                    <p className={cn(
                      'text-sm mb-3',
                      isCompleted ? 'text-gray-400' : colors.text,
                    )}>
                      {lesson.courseName}
                    </p>

                    {/* Meta row */}
                    <div className="mt-auto flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {lesson.duration_minutes} min
                      </span>
                      <span>&middot;</span>
                      <span className="capitalize">{lesson.lesson_type}</span>
                      <span>&middot;</span>
                      <span>Lesson {lesson.lesson_order}</span>
                      {lesson.is_free && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">Free</Badge>
                      )}
                    </div>
                  </div>

                  {/* Footer bar */}
                  <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm">
                      {isInProgress ? (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Sparkles className="h-3.5 w-3.5" /> In Progress
                        </span>
                      ) : isCompleted ? (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle className="h-3.5 w-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="text-gray-400">Not Started</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className={cn(
                        'rounded-lg',
                        isInProgress && `bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90`,
                        isCompleted && 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                        !isInProgress && !isCompleted && 'bg-emerald-600 hover:bg-emerald-700 text-white',
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/student/lessons/${lesson.documentId || lesson.id}`);
                      }}
                    >
                      {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {sortedFiltered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-[var(--shadow-islamic)] p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Lessons Found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || courseFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'Enroll in a course to access lessons.'}
          </p>
          <Link href="/student/browse">
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">Browse Courses</Button>
          </Link>
        </div>
      )}
    </StudentLayout>
  );
}
