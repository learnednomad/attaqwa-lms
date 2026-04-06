'use client';

import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen, Users, Clock, TrendingUp,
  Calendar, ClipboardCheck,
  ArrowRight, Loader2, FileText, Star, BarChart3, Award
} from 'lucide-react';
import { teacherApi } from '@/lib/teacher-api';

interface CourseData {
  id: number;
  title: string;
  students: number;
  progress: number;
  nextClass: string;
  room: string;
  pendingAssignments: number;
  subject: string;
  lessonsCount: number;
}

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalLessons = courses.reduce((sum, c) => sum + c.lessonsCount, 0);
  const avgProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
    : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coursesRes = await teacherApi.courses.getMyCourses();
        const apiCourses: CourseData[] = (coursesRes.data || []).map((course: any) => ({
          id: course.id,
          title: course.title,
          students: course.current_enrollments || 0,
          progress: 0,
          nextClass: '',
          room: '',
          pendingAssignments: 0,
          subject: course.subject || 'general',
          lessonsCount: course.lessons?.length || 0,
        }));
        setCourses(apiCourses);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <TeacherLayout title="Dashboard" subtitle="Loading your teaching data...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-islamic-green-600" />
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout title="Dashboard" subtitle="Welcome back">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Dashboard" subtitle="Welcome back, Sheikh Abdullah">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="p-3 bg-islamic-green-100 rounded-xl">
                <BookOpen className="h-6 w-6 text-islamic-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">From Strapi CMS</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Enrolled Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Total enrollments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Student completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">My Courses</CardTitle>
              <Button variant="ghost" size="sm" className="text-islamic-green-600 hover:text-islamic-green-700" asChild>
                <a href="/teacher/courses">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No courses yet</p>
                  <p className="text-sm mt-1">Create your first course to get started.</p>
                  <Button className="mt-4 bg-islamic-green-600 hover:bg-islamic-green-700" asChild>
                    <a href="/teacher/courses/new">Create Course</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-gray-200 rounded-xl hover:border-islamic-green-200 hover:bg-islamic-green-50/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{course.title}</h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {course.subject}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" /> {course.students} students
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" /> {course.lessonsCount} lessons
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-islamic-green-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/teacher/courses/new">
                  <BookOpen className="h-4 w-4 mr-2" /> Create New Course
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/teacher/lessons/new">
                  <FileText className="h-4 w-4 mr-2" /> Create New Lesson
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/teacher/students">
                  <Users className="h-4 w-4 mr-2" /> View Students
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/teacher/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" /> View Analytics
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Course Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courses.slice(0, 4).map((course) => (
                  <div key={course.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate flex-1 mr-2">{course.title}</span>
                    <Badge variant="outline" className="text-xs capitalize flex-shrink-0">{course.subject}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}
