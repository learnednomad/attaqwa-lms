'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, Loader2, AlertCircle, BarChart3, Users,
  TrendingUp, BookOpen, Clock, CheckCircle, Award,
  Calendar, Target, Activity
} from 'lucide-react';
import { teacherApi, TeacherCourse, StudentEnrollment } from '@/lib/teacher-api';

interface CourseWithEnrollments {
  id: number;
  documentId: string;
  title: string;
  subject: string;
  difficulty: string;
  enrollments?: Array<{
    id: number;
    documentId: string;
    student?: {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
    progress?: number;
    overall_progress?: number;
  }>;
  lessons?: Array<{
    id: number;
    documentId: string;
    title: string;
    order: number;
  }>;
}

export default function CourseAnalyticsPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseWithEnrollments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    const fetchCourseAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await teacherApi.courses.getCourseDetails(courseId);
        setCourse(result.data as unknown as CourseWithEnrollments);
      } catch (err) {
        console.error('Failed to fetch course analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseAnalytics();
    }
  }, [courseId]);

  // Calculate analytics from available data
  const enrollments = course?.enrollments || [];
  const lessons = course?.lessons || [];

  const totalStudents = enrollments.length;
  const completedCount = enrollments.filter(e => (e.progress ?? e.overall_progress ?? 0) === 100).length;
  const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;
  const averageProgress = totalStudents > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress ?? e.overall_progress ?? 0), 0) / totalStudents)
    : 0;

  // Simulated lesson completion data (would come from real analytics in production)
  const lessonCompletionData = lessons.map((lesson, index) => ({
    ...lesson,
    completions: Math.max(0, totalStudents - Math.floor(index * 0.2 * totalStudents)),
    completionRate: Math.max(0, 100 - index * 15),
  }));

  // Simulated engagement metrics
  const engagementMetrics = {
    avgSessionDuration: '45 min',
    avgLessonsPerWeek: '2.3',
    activeStudentsThisWeek: Math.round(totalStudents * 0.7),
    discussionPosts: 24,
  };

  if (loading) {
    return (
      <TeacherLayout title="Course Analytics" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </TeacherLayout>
    );
  }

  if (error || !course) {
    return (
      <TeacherLayout title="Course Analytics" subtitle="Error loading analytics">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load analytics</h3>
          <p className="text-gray-500 mb-4">{error || 'Course not found'}</p>
          <Link href="/teacher/courses">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </Card>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout
      title="Course Analytics"
      subtitle={course.title}
    >
      {/* Back Button and Time Range */}
      <div className="flex items-center justify-between mb-6">
        <Link href={`/teacher/courses/${courseId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </Link>

        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                <p className="text-sm text-gray-500">Total Enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
                <p className="text-sm text-gray-500">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageProgress}%</p>
                <p className="text-sm text-gray-500">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{engagementMetrics.activeStudentsThisWeek}</p>
                <p className="text-sm text-gray-500">Active This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Progress Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Completed (100%)</span>
                  <span className="text-sm text-gray-500">{completedCount} students</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${totalStudents > 0 ? (completedCount / totalStudents) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">In Progress (1-99%)</span>
                  <span className="text-sm text-gray-500">
                    {enrollments.filter(e => { const p = e.progress || 0; return p > 0 && p < 100; }).length} students
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${totalStudents > 0
                        ? (enrollments.filter(e => { const p = e.progress || 0; return p > 0 && p < 100; }).length / totalStudents) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Not Started (0%)</span>
                  <span className="text-sm text-gray-500">
                    {enrollments.filter(e => (e.progress ?? e.overall_progress ?? 0) === 0).length} students
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400 rounded-full"
                    style={{
                      width: `${totalStudents > 0
                        ? (enrollments.filter(e => (e.progress ?? e.overall_progress ?? 0) === 0).length / totalStudents) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Avg Session</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{engagementMetrics.avgSessionDuration}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Lessons/Week</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{engagementMetrics.avgLessonsPerWeek}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Active Students</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{engagementMetrics.activeStudentsThisWeek}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Discussion Posts</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{engagementMetrics.discussionPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Completion */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Lesson Completion Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lessonCompletionData.length > 0 ? (
            <div className="space-y-4">
              {lessonCompletionData.map((lesson, index) => (
                <div key={lesson.documentId} className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                        {lesson.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {lesson.completions}/{totalStudents} students
                        </span>
                        <Badge
                          className={
                            lesson.completionRate >= 75
                              ? 'bg-emerald-100 text-emerald-700'
                              : lesson.completionRate >= 50
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-amber-100 text-amber-700'
                          }
                        >
                          {lesson.completionRate}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={lesson.completionRate} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No lessons available yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrollments.slice(0, 5).map((enrollment, index) => {
              const studentName = enrollment.student?.first_name
                ? `${enrollment.student.first_name} ${enrollment.student.last_name || ''}`
                : enrollment.student?.username || 'Student';

              // Simulate recent activities
              const activities = [
                `${studentName} completed lesson ${Math.min(enrollment.progress || 0, 10)}`,
                `${studentName} started the course`,
                `${studentName} achieved ${enrollment.progress || 0}% progress`,
              ];

              return (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-700 font-medium">
                      {studentName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activities[index % activities.length]}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(Date.now() - index * 3600000).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}

            {enrollments.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No activity recorded yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TeacherLayout>
  );
}
