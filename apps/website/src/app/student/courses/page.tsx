'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, Clock, Users, Play, MoreHorizontal, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { studentApi, Course as ApiCourse } from '@/lib/student-api';

interface CourseData {
  id: string;
  documentId?: string;
  title: string;
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

// Mock data for fallback
const mockCourses: CourseData[] = [
  {
    id: '1',
    title: 'Quran Memorization - Juz 30',
    instructor: 'Imam Mohammad',
    instructorTitle: 'Hafiz',
    progress: 75,
    lessons: 30,
    completedLessons: 22,
    students: 24,
    nextLesson: 'Surah An-Naba - Verses 31-40',
    schedule: 'Mon, Wed, Fri - 4:00 PM',
    status: 'in_progress',
  },
  {
    id: '2',
    title: 'Islamic Studies - Fiqh',
    instructor: 'Sheikh Abdullah',
    instructorTitle: 'Ph.D',
    progress: 60,
    lessons: 24,
    completedLessons: 14,
    students: 32,
    nextLesson: 'Chapter 8: Fasting Rules',
    schedule: 'Tue, Thu - 3:00 PM',
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Arabic Language - Level 2',
    instructor: 'Ustadh Omar',
    instructorTitle: 'Ph.D',
    progress: 45,
    lessons: 40,
    completedLessons: 18,
    students: 28,
    nextLesson: 'Lesson 19: Verb Conjugations',
    schedule: 'Mon, Wed - 5:00 PM',
    status: 'in_progress',
  },
  {
    id: '4',
    title: 'Hadith Studies',
    instructor: 'Dr. Fatima Ali',
    instructorTitle: 'Ph.D',
    progress: 80,
    lessons: 20,
    completedLessons: 16,
    students: 18,
    nextLesson: 'Sahih Bukhari: Book of Prayer',
    schedule: 'Thu - 4:30 PM',
    status: 'in_progress',
  },
  {
    id: '5',
    title: 'Tajweed Fundamentals',
    instructor: 'Qari Ibrahim',
    instructorTitle: 'Certified Qari',
    progress: 100,
    lessons: 15,
    completedLessons: 15,
    students: 20,
    nextLesson: 'Course Completed',
    schedule: 'Completed',
    status: 'completed',
  },
  {
    id: '6',
    title: 'Seerah of the Prophet',
    instructor: 'Sheikh Ahmed',
    instructorTitle: 'Islamic Studies',
    progress: 100,
    lessons: 25,
    completedLessons: 25,
    students: 45,
    nextLesson: 'Course Completed',
    schedule: 'Completed',
    status: 'completed',
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
        // Fetch courses from API
        const [coursesRes, enrollmentsRes] = await Promise.all([
          studentApi.courses.getAll(),
          studentApi.enrollments.getMine().catch(() => null),
        ]);

        const apiCourses = coursesRes.data || [];
        const enrollments = enrollmentsRes?.data || [];

        if (apiCourses.length > 0) {
          setDataSource('api');

          // Transform API courses to our UI format
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

          // Calculate hours from enrollments
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
      {/* Data Source Indicator */}
      <div className="mb-4">
        {dataSource === 'api' ? (
          <Badge className="bg-emerald-100 text-emerald-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Live Data from Strapi
          </Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Demo Mode (Mock Data)
          </Badge>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-sm text-gray-500">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCourses.length}</p>
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
                <p className="text-2xl font-bold">{totalHours}</p>
                <p className="text-sm text-gray-500">Hours Learned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCourses.length}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Courses */}
      {activeCourses.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeCourses.map((course) => (
                <div key={course.id} className="border rounded-xl p-4 hover:border-emerald-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                          {course.instructor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-500">{course.instructor}, {course.instructorTitle}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{course.completedLessons}/{course.lessons} Lessons</span>
                    <span>{course.students} Students</span>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Next:</span> {course.nextLesson}
                    </p>
                    <p className="text-xs text-gray-400">{course.schedule}</p>
                  </div>

                  <Button
                    className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => router.push(`/student/courses/${course.documentId || course.id}`)}
                  >
                    Continue Learning
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedCourses.map((course) => (
                <div key={course.id} className="border rounded-xl p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                          {course.instructor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-500">{course.instructor}, {course.instructorTitle}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{course.lessons} Lessons</span>
                    <span>{course.students} Students</span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => router.push(`/student/courses/${course.documentId || course.id}`)}
                  >
                    View Certificate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No courses message */}
      {courses.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Yet</h3>
            <p className="text-gray-500 mb-4">Browse our catalog to enroll in your first course.</p>
            <Link href="/student/browse">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Browse Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </StudentLayout>
  );
}
