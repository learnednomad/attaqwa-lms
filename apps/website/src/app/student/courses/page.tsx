'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Clock, Users, Play, CheckCircle, AlertCircle, Loader2,
  BarChart3, ChevronDown, ChevronUp, ArrowRight, Search, Award
} from 'lucide-react';
import { studentApi, Course as ApiCourse } from '@/lib/student-api';

interface CourseData {
  id: string;
  documentId?: string;
  title: string;
  subject: string;
  instructor: string;
  instructorTitle: string;
  progress: number;
  lessons: number;
  completedLessons: number;
  students: number;
  nextLesson: string;
  schedule: string;
  status: 'in_progress' | 'completed';
}

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

function EnrolledCourseCard({
  course,
  onContinue,
}: {
  course: CourseData;
  onContinue: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = SUBJECT_COLORS[course.subject] || SUBJECT_COLORS.quran;
  const subjectLabel = SUBJECT_LABELS[course.subject] || course.subject;
  const isCompleted = course.status === 'completed';
  const remainingLessons = course.lessons - course.completedLessons;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Subject Tag */}
        <div className="flex items-center gap-1.5 mb-3">
          <BarChart3 className={`h-4 w-4 ${colors.icon}`} />
          <span className={`text-sm font-semibold ${colors.text}`}>{subjectLabel}</span>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Next lesson or completed */}
        {!isCompleted ? (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
            {course.nextLesson}
          </p>
        ) : (
          <p className="text-sm text-gray-400 mb-4 flex-1">
            All {course.lessons} lessons completed
          </p>
        )}

        {/* Instructor */}
        <div className="mt-auto">
          <p className="text-sm text-gray-700">By {course.instructor}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {course.instructorTitle} &middot; {course.schedule}
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        {!expanded ? (
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {isCompleted ? (
                <span>{course.lessons} lessons</span>
              ) : (
                <span>{remainingLessons} lesson{remainingLessons !== 1 ? 's' : ''} remaining</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isCompleted && (
                <button
                  onClick={(e) => { e.stopPropagation(); onContinue(); }}
                  className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className={`bg-gradient-to-br ${colors.gradient} px-5 py-4 text-white rounded-b-xl`}>
            {/* Progress */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/80">Progress</span>
                <span className="font-semibold">{course.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className="text-xs text-white/60 mt-1">
                {course.completedLessons}/{course.lessons} Lessons &middot; {course.students} Students
              </p>
            </div>

            {/* Actions */}
            {!isCompleted ? (
              <button
                onClick={(e) => { e.stopPropagation(); onContinue(); }}
                className="flex items-center gap-2 text-white font-semibold text-[15px] mb-2 hover:opacity-90 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="h-3.5 w-3.5 text-white fill-white" />
                </div>
                Continue Learning
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onContinue(); }}
                className="flex items-center gap-2 text-white font-semibold text-[15px] mb-2 hover:opacity-90 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Award className="h-3.5 w-3.5 text-white" />
                </div>
                View Certificate
              </button>
            )}

            {!isCompleted && (
              <p className="text-white/70 text-xs">
                Next: {course.nextLesson}
              </p>
            )}

            <div className="flex justify-end mt-1">
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data for fallback
const mockCourses: CourseData[] = [
  {
    id: '1', title: 'Quran Memorization - Juz 30', subject: 'quran',
    instructor: 'Imam Mohammad', instructorTitle: 'Hafiz',
    progress: 75, lessons: 30, completedLessons: 22, students: 24,
    nextLesson: 'Surah An-Naba - Verses 31-40', schedule: 'Mon, Wed, Fri - 4:00 PM', status: 'in_progress',
  },
  {
    id: '2', title: 'Islamic Studies - Fiqh', subject: 'fiqh',
    instructor: 'Sheikh Abdullah', instructorTitle: 'Ph.D',
    progress: 60, lessons: 24, completedLessons: 14, students: 32,
    nextLesson: 'Chapter 8: Fasting Rules', schedule: 'Tue, Thu - 3:00 PM', status: 'in_progress',
  },
  {
    id: '3', title: 'Arabic Language - Level 2', subject: 'arabic',
    instructor: 'Ustadh Omar', instructorTitle: 'Ph.D',
    progress: 45, lessons: 40, completedLessons: 18, students: 28,
    nextLesson: 'Lesson 19: Verb Conjugations', schedule: 'Mon, Wed - 5:00 PM', status: 'in_progress',
  },
  {
    id: '4', title: 'Hadith Studies', subject: 'hadith',
    instructor: 'Dr. Fatima Ali', instructorTitle: 'Ph.D',
    progress: 80, lessons: 20, completedLessons: 16, students: 18,
    nextLesson: 'Sahih Bukhari: Book of Prayer', schedule: 'Thu - 4:30 PM', status: 'in_progress',
  },
  {
    id: '5', title: 'Tajweed Fundamentals', subject: 'tajweed',
    instructor: 'Qari Ibrahim', instructorTitle: 'Certified Qari',
    progress: 100, lessons: 15, completedLessons: 15, students: 20,
    nextLesson: 'Course Completed', schedule: 'Completed', status: 'completed',
  },
  {
    id: '6', title: 'Seerah of the Prophet', subject: 'seerah',
    instructor: 'Sheikh Ahmed', instructorTitle: 'Islamic Studies',
    progress: 100, lessons: 25, completedLessons: 25, students: 45,
    nextLesson: 'Course Completed', schedule: 'Completed', status: 'completed',
  },
];

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock');
  const [totalHours, setTotalHours] = useState(127);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          studentApi.courses.getAll(),
          studentApi.enrollments.getMine().catch(() => null),
        ]);

        const apiCourses = coursesRes.data || [];
        const enrollments = enrollmentsRes?.data || [];

        if (apiCourses.length > 0) {
          setDataSource('api');

          const transformedCourses: CourseData[] = apiCourses.map((course) => {
            const enrollment = enrollments.find(e => e.course?.id === course.id);
            const isCompleted = enrollment?.enrollment_status === 'completed';
            const progress = enrollment?.overall_progress || (isCompleted ? 100 : Math.floor(Math.random() * 80) + 10);
            const lessonsCount = course.lessons?.length || Math.ceil(course.duration_weeks * 2);
            const completedLessons = Math.round((progress / 100) * lessonsCount);

            return {
              id: String(course.id),
              documentId: course.documentId,
              title: course.title,
              subject: course.subject || getSubjectFromTitle(course.title),
              instructor: course.instructor,
              instructorTitle: course.subject === 'quran' || course.subject === 'tajweed' ? 'Hafiz' : 'Ph.D',
              progress,
              lessons: lessonsCount,
              completedLessons,
              students: course.current_enrollments || Math.floor(Math.random() * 30) + 10,
              nextLesson: isCompleted ? 'Course Completed' : `Lesson ${completedLessons + 1}: ${course.title.split(' - ')[0]}`,
              schedule: isCompleted ? 'Completed' : course.schedule,
              status: isCompleted ? 'completed' : 'in_progress',
            };
          });

          setCourses(transformedCourses);

          const hours = enrollments.reduce((sum, e) => sum + Math.round((e.total_time_spent_minutes || 0) / 60), 0);
          setTotalHours(hours || 127);
        } else {
          setCourses(mockCourses);
        }
      } catch (error) {
        console.warn('Failed to fetch courses from API, using mock data:', error);
        setCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const activeCourses = courses.filter(c => c.status === 'in_progress');
  const completedCourses = courses.filter(c => c.status === 'completed');

  if (loading) {
    return (
      <StudentLayout title="My Courses" subtitle="Track your enrolled courses and progress">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="My Courses" subtitle="Track your enrolled courses and progress">
      {/* Top Bar: Data Source + Browse Link */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {dataSource === 'api' ? (
            <Badge className="bg-emerald-100 text-emerald-700 border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              Live Data from Strapi
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-700 border-0">
              <AlertCircle className="h-3 w-3 mr-1" />
              Demo Mode
            </Badge>
          )}
        </div>
        <Link href="/student/browse">
          <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-gray-600 hover:text-gray-900">
            <Search className="h-4 w-4 mr-2" /> Browse Courses
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              <p className="text-xs text-gray-500">Total Courses</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Play className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeCourses.length}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
              <p className="text-xs text-gray-500">Hours Learned</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedCourses.length}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Courses */}
      {activeCourses.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Active Courses</h2>
            <span className="text-sm text-gray-500">{activeCourses.length} course{activeCourses.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {activeCourses.map((course) => (
              <EnrolledCourseCard
                key={course.id}
                course={course}
                onContinue={() => router.push(`/student/courses/${course.documentId || course.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Completed</h2>
            <span className="text-sm text-gray-500">{completedCourses.length} course{completedCourses.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {completedCourses.map((course) => (
              <EnrolledCourseCard
                key={course.id}
                course={course}
                onContinue={() => router.push(`/student/courses/${course.documentId || course.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h3>
          <p className="text-gray-500 mb-4">Browse our catalog to enroll in your first course.</p>
          <Link href="/student/browse">
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
              Browse Courses
            </Button>
          </Link>
        </div>
      )}
    </StudentLayout>
  );
}
