'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookOpen, Clock, Play, CheckCircle, Lock, Search,
  FileText, Video, HelpCircle, Loader2, AlertCircle, Filter
} from 'lucide-react';
import { studentApi, Lesson, Course, UserProgress } from '@/lib/student-api';

interface LessonWithProgress extends Lesson {
  courseName: string;
  courseId: string;
  progress: UserProgress | null;
  status: 'completed' | 'in_progress' | 'not_started';
}

const LESSON_TYPE_ICONS: Record<string, React.ElementType> = {
  video: Video,
  reading: FileText,
  interactive: Play,
  quiz: HelpCircle,
  audio: Play,
};

// Mock lessons for fallback
const mockLessons: LessonWithProgress[] = [
  {
    id: 1, documentId: '1', title: 'Introduction to Tajweed Rules', slug: 'intro-tajweed',
    description: 'Learn the fundamental rules of Quran recitation', lesson_order: 1,
    lesson_type: 'video', duration_minutes: 45, content: '', learning_objectives: [],
    is_free: true, is_preview: false, courseName: 'Quran Memorization - Juz 30', courseId: '1',
    progress: null, status: 'completed',
  },
  {
    id: 2, documentId: '2', title: 'Surah An-Naba - Verses 1-10', slug: 'naba-1-10',
    description: 'Memorization and tafsir of the first ten verses', lesson_order: 2,
    lesson_type: 'reading', duration_minutes: 60, content: '', learning_objectives: [],
    is_free: false, is_preview: false, courseName: 'Quran Memorization - Juz 30', courseId: '1',
    progress: null, status: 'completed',
  },
  {
    id: 3, documentId: '3', title: 'Surah An-Naba - Verses 11-20', slug: 'naba-11-20',
    description: 'Continue memorization with detailed explanation', lesson_order: 3,
    lesson_type: 'reading', duration_minutes: 60, content: '', learning_objectives: [],
    is_free: false, is_preview: false, courseName: 'Quran Memorization - Juz 30', courseId: '1',
    progress: null, status: 'in_progress',
  },
  {
    id: 4, documentId: '4', title: 'Pillars of Islam - Overview', slug: 'pillars-overview',
    description: 'The five pillars and their significance', lesson_order: 1,
    lesson_type: 'video', duration_minutes: 30, content: '', learning_objectives: [],
    is_free: true, is_preview: false, courseName: 'Islamic Studies - Fiqh', courseId: '2',
    progress: null, status: 'completed',
  },
  {
    id: 5, documentId: '5', title: 'Rules of Wudu', slug: 'rules-wudu',
    description: 'Detailed study of ablution rules and conditions', lesson_order: 2,
    lesson_type: 'interactive', duration_minutes: 40, content: '', learning_objectives: [],
    is_free: false, is_preview: false, courseName: 'Islamic Studies - Fiqh', courseId: '2',
    progress: null, status: 'in_progress',
  },
  {
    id: 6, documentId: '6', title: 'Arabic Alphabet - Part 1', slug: 'arabic-alphabet-1',
    description: 'Letters, pronunciation, and basic forms', lesson_order: 1,
    lesson_type: 'interactive', duration_minutes: 35, content: '', learning_objectives: [],
    is_free: true, is_preview: false, courseName: 'Arabic Language - Level 2', courseId: '3',
    progress: null, status: 'not_started',
  },
];

export default function StudentLessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseNames, setCourseNames] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const [lessonsRes, coursesRes, progressRes] = await Promise.all([
          studentApi.lessons.getAll(),
          studentApi.courses.getAll(),
          studentApi.progress.getMine().catch(() => null),
        ]);

        const apiLessons = lessonsRes.data || [];
        const apiCourses = coursesRes.data || [];
        const userProgress = progressRes?.data || [];

        if (apiLessons.length > 0) {
          setDataSource('api');

          // Build course name lookup
          const courseMap = new Map<number, Course>();
          apiCourses.forEach(c => courseMap.set(c.id, c));

          // Build progress lookup by lesson id
          const progressMap = new Map<number, UserProgress>();
          userProgress.forEach(p => {
            if (p.lesson) progressMap.set(p.lesson.id, p);
          });

          const transformed: LessonWithProgress[] = apiLessons.map(lesson => {
            const course = lesson.course ? courseMap.get(lesson.course.id) : null;
            const progress = progressMap.get(lesson.id) || null;
            const status = progress?.status || 'not_started';

            return {
              ...lesson,
              courseName: course?.title || lesson.course?.title || 'Unknown Course',
              courseId: String(course?.documentId || course?.id || lesson.course?.id || ''),
              progress,
              status: status as 'completed' | 'in_progress' | 'not_started',
            };
          });

          // Sort: in_progress first, then not_started, then completed
          transformed.sort((a, b) => {
            const order = { in_progress: 0, not_started: 1, completed: 2 };
            return order[a.status] - order[b.status] || a.lesson_order - b.lesson_order;
          });

          setLessons(transformed);

          // Extract unique course names for filter
          const names = [...new Map(transformed.map(l => [l.courseId, { id: l.courseId, name: l.courseName }])).values()];
          setCourseNames(names);
        } else {
          setLessons(mockLessons);
          const names = [...new Map(mockLessons.map(l => [l.courseId, { id: l.courseId, name: l.courseName }])).values()];
          setCourseNames(names);
        }
      } catch (error) {
        console.warn('Failed to fetch lessons from API, using mock data:', error);
        setLessons(mockLessons);
        const names = [...new Map(mockLessons.map(l => [l.courseId, { id: l.courseId, name: l.courseName }])).values()];
        setCourseNames(names);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || lesson.courseId === courseFilter;
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const inProgressCount = lessons.filter(l => l.status === 'in_progress').length;
  const totalMinutes = lessons.reduce((sum, l) => sum + l.duration_minutes, 0);

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
        {dataSource === 'api' ? (
          <Badge className="bg-emerald-100 text-emerald-700">
            <CheckCircle className="h-3 w-3 mr-1" /> Live Data
          </Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-700">
            <AlertCircle className="h-3 w-3 mr-1" /> Demo Mode
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lessons.length}</p>
                <p className="text-sm text-gray-500">Total Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(totalMinutes / 60)}h</p>
                <p className="text-sm text-gray-500">Total Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search lessons..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courseNames.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {filteredLessons.map((lesson) => {
          const TypeIcon = LESSON_TYPE_ICONS[lesson.lesson_type] || FileText;
          return (
            <Card
              key={lesson.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/student/lessons/${lesson.documentId || lesson.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Type Icon */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                    lesson.status === 'completed' ? 'bg-emerald-100' :
                    lesson.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {lesson.status === 'completed' ? (
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <TypeIcon className={`h-6 w-6 ${
                        lesson.status === 'in_progress' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{lesson.title}</h3>
                      {lesson.is_free && (
                        <Badge variant="secondary" className="text-xs">Free</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{lesson.courseName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {lesson.duration_minutes} min
                      </span>
                      <span className="capitalize">{lesson.lesson_type}</span>
                      <span>Lesson {lesson.lesson_order}</span>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    {lesson.status === 'completed' ? (
                      <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
                    ) : lesson.status === 'in_progress' ? (
                      <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>
                    ) : (
                      <Badge variant="secondary">Not Started</Badge>
                    )}
                    <Button
                      size="sm"
                      className={lesson.status === 'completed'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/student/lessons/${lesson.documentId || lesson.id}`);
                      }}
                    >
                      {lesson.status === 'completed' ? 'Review' :
                       lesson.status === 'in_progress' ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lessons Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || courseFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Enroll in a course to access lessons.'}
            </p>
            <Link href="/student/browse">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </StudentLayout>
  );
}
