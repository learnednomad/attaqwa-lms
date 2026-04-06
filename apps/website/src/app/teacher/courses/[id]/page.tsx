'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen, Users, Clock, Calendar, ArrowLeft,
  Edit, Play, Pause, Trash2, Loader2, AlertCircle,
  FileText, BarChart3, GraduationCap, CheckCircle,
  Star, TrendingUp
} from 'lucide-react';
import { teacherApi, TeacherCourse, StudentEnrollment } from '@/lib/teacher-api';

interface CourseDetailsData {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  age_tier: string;
  subject: string;
  difficulty: string;
  duration_weeks: number;
  schedule?: string;
  instructor?: string;
  learning_outcomes?: string[];
  max_students?: number | null;
  current_enrollments?: number;
  publishedAt?: string | null;
  completion_rate?: number;
  average_progress?: number;
  enrollments?: StudentEnrollment[];
  lessons?: Array<{
    id: number;
    documentId: string;
    title: string;
    order: number;
    duration_minutes?: number;
  }>;
}

export default function TeacherCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await teacherApi.courses.getCourseDetails(courseId);
        setCourse(result.data as unknown as CourseDetailsData);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handlePublish = async () => {
    if (!course) return;
    try {
      setPublishing(true);
      await teacherApi.courses.publishCourse(courseId);
      setCourse({ ...course, publishedAt: new Date().toISOString() });
    } catch (err) {
      console.error('Failed to publish course:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!course) return;
    try {
      setPublishing(true);
      await teacherApi.courses.unpublishCourse(courseId);
      setCourse({ ...course, publishedAt: null } as CourseDetailsData);
    } catch (err) {
      console.error('Failed to unpublish course:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!course || !confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    try {
      setDeleting(true);
      await teacherApi.courses.deleteCourse(courseId);
      router.push('/teacher/courses');
    } catch (err) {
      console.error('Failed to delete course:', err);
      setDeleting(false);
    }
  };

  const isPublished = course?.publishedAt != null;
  const totalLessons = course?.lessons?.length || 0;
  const totalStudents = course?.current_enrollments || course?.enrollments?.length || 0;

  if (loading) {
    return (
      <TeacherLayout title="Course Details" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-islamic-green-600" />
        </div>
      </TeacherLayout>
    );
  }

  if (error || !course) {
    return (
      <TeacherLayout title="Course Details" subtitle="Error loading course">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load course</h3>
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
      title={course.title}
      subtitle={`${course.subject} | ${course.difficulty}`}
    >
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/teacher/courses">
          <Button variant="ghost" size="sm" className="hover:bg-islamic-green-50 hover:text-islamic-green-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
      </div>

      {/* Course Header */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-islamic-green-600 via-islamic-green-500 to-islamic-gold-500" />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            {/* Course Info */}
            <div className="flex gap-4 flex-1">
              <div className="hidden sm:flex flex-shrink-0 w-14 h-14 bg-gradient-to-br from-islamic-green-600 to-islamic-green-800 rounded-2xl items-center justify-center shadow-lg shadow-islamic-green-600/20">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
                  <Badge className={isPublished
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }>
                    {isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{course.description}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 rounded-full px-3 py-1.5 text-xs font-medium">
                    <BookOpen className="h-3.5 w-3.5 text-islamic-green-600" />
                    {course.subject}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 rounded-full px-3 py-1.5 text-xs font-medium">
                    <GraduationCap className="h-3.5 w-3.5 text-islamic-gold-600" />
                    {course.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 rounded-full px-3 py-1.5 text-xs font-medium">
                    <Users className="h-3.5 w-3.5 text-islamic-navy-600" />
                    {course.age_tier}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 rounded-full px-3 py-1.5 text-xs font-medium">
                    <Clock className="h-3.5 w-3.5 text-purple-600" />
                    {course.duration_weeks} weeks
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/teacher/courses/${courseId}/edit`}>
                <Button variant="outline" className="border-islamic-green-200 text-islamic-green-700 hover:bg-islamic-green-50">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              {isPublished ? (
                <Button
                  variant="outline"
                  onClick={handleUnpublish}
                  disabled={publishing}
                >
                  {publishing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Pause className="h-4 w-4 mr-2" />
                  )}
                  Unpublish
                </Button>
              ) : (
                <Button
                  className="bg-islamic-green-600 hover:bg-islamic-green-700 shadow-md shadow-islamic-green-600/20"
                  onClick={handlePublish}
                  disabled={publishing}
                >
                  {publishing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Publish
                </Button>
              )}
              <div className="w-px h-6 bg-slate-200 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="relative overflow-hidden border-0 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white" />
          <CardContent className="relative p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-purple-100 rounded-xl">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{totalStudents}</p>
            <p className="text-sm text-slate-500 mt-0.5">Enrolled Students</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-islamic-green-50 to-white" />
          <CardContent className="relative p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-islamic-green-100 rounded-xl">
                <FileText className="h-5 w-5 text-islamic-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{totalLessons}</p>
            <p className="text-sm text-slate-500 mt-0.5">Lessons</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white" />
          <CardContent className="relative p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-emerald-100 rounded-xl">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {course.completion_rate || 0}%
            </p>
            <p className="text-sm text-slate-500 mt-0.5">Completion Rate</p>
            <div className="mt-3 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${course.completion_rate || 0}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-white" />
          <CardContent className="relative p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {course.average_progress || 0}%
            </p>
            <p className="text-sm text-slate-500 mt-0.5">Avg Progress</p>
            <div className="mt-3 h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${course.average_progress || 0}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white border border-slate-200 shadow-sm p-1 rounded-xl h-12">
          <TabsTrigger value="overview" className="data-[state=active]:bg-islamic-green-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200">Overview</TabsTrigger>
          <TabsTrigger value="lessons" className="data-[state=active]:bg-islamic-green-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200">Lessons ({totalLessons})</TabsTrigger>
          <TabsTrigger value="students" className="data-[state=active]:bg-islamic-green-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200">Students ({totalStudents})</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-islamic-green-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-islamic-green-500 rounded-full" />
                  Course Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                      <BookOpen className="h-4 w-4 text-islamic-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Subject</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{course.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                      <GraduationCap className="h-4 w-4 text-islamic-gold-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Difficulty</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5 capitalize">{course.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                      <Users className="h-4 w-4 text-islamic-navy-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Age Group</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5 capitalize">{course.age_tier}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Duration</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{course.duration_weeks} weeks</p>
                    </div>
                  </div>
                  {course.schedule && (
                    <div className="col-span-2 flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                        <Calendar className="h-4 w-4 text-islamic-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Schedule</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{course.schedule}</p>
                      </div>
                    </div>
                  )}
                  {course.max_students && (
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                        <Users className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Max Students</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{course.max_students}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-islamic-green-500 rounded-full" />
                  Learning Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {course.learning_outcomes && course.learning_outcomes.length > 0 ? (
                  <ul className="space-y-2">
                    {course.learning_outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-islamic-green-50/50 rounded-xl border border-islamic-green-100/50 hover:border-islamic-green-200 transition-colors">
                        <span className="flex-shrink-0 w-7 h-7 bg-islamic-green-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-slate-700 text-sm leading-relaxed pt-0.5">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                    <GraduationCap className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">No learning outcomes defined</p>
                    <p className="text-slate-400 text-xs mt-1">Add outcomes to help students understand course goals</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-islamic-green-500 rounded-full" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href={`/teacher/courses/${courseId}/edit`} className="group">
                    <div className="relative p-5 bg-white rounded-xl border border-slate-200 hover:border-islamic-green-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center gap-3 text-center">
                      <div className="p-3 bg-islamic-green-50 rounded-xl group-hover:bg-islamic-green-100 group-hover:scale-110 transition-all duration-200">
                        <Edit className="h-5 w-5 text-islamic-green-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-islamic-green-700">Edit Course</span>
                    </div>
                  </Link>
                  <Link href={`/teacher/courses/${courseId}/students`} className="group">
                    <div className="relative p-5 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center gap-3 text-center">
                      <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-200">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">Manage Students</span>
                    </div>
                  </Link>
                  <Link href={`/teacher/courses/${courseId}/analytics`} className="group">
                    <div className="relative p-5 bg-white rounded-xl border border-slate-200 hover:border-islamic-navy-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center gap-3 text-center">
                      <div className="p-3 bg-islamic-navy-50 rounded-xl group-hover:bg-islamic-navy-100 group-hover:scale-110 transition-all duration-200">
                        <BarChart3 className="h-5 w-5 text-islamic-navy-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-islamic-navy-700">View Analytics</span>
                    </div>
                  </Link>
                  <div className="group cursor-pointer">
                    <div className="relative p-5 bg-white rounded-xl border border-slate-200 hover:border-islamic-gold-300 hover:shadow-md transition-all duration-200 flex flex-col items-center gap-3 text-center">
                      <div className="p-3 bg-islamic-gold-50 rounded-xl group-hover:bg-islamic-gold-100 group-hover:scale-110 transition-all duration-200">
                        <Calendar className="h-5 w-5 text-islamic-gold-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-islamic-gold-700">Schedule Class</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="lessons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-1 h-5 bg-islamic-green-500 rounded-full" />
                Course Lessons
              </CardTitle>
              <Button className="bg-islamic-green-600 hover:bg-islamic-green-700 shadow-md shadow-islamic-green-600/20">
                Add Lesson
              </Button>
            </CardHeader>
            <CardContent>
              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-2">
                  {course.lessons.sort((a, b) => a.order - b.order).map((lesson, index) => (
                    <div
                      key={lesson.documentId}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-islamic-green-200 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-islamic-green-500 to-islamic-green-700 text-white rounded-xl font-semibold text-sm shadow-sm">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-islamic-green-700 transition-colors">{lesson.title}</p>
                          {lesson.duration_minutes && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3 text-slate-400" />
                              <p className="text-xs text-slate-500">{lesson.duration_minutes} min</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <Link href={`/teacher/lessons/${lesson.documentId}/edit`}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">No lessons yet</h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Start building your course by creating the first lesson</p>
                  <Button className="bg-islamic-green-600 hover:bg-islamic-green-700 shadow-md shadow-islamic-green-600/20">
                    <FileText className="h-4 w-4 mr-2" />
                    Create First Lesson
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-1 h-5 bg-islamic-green-500 rounded-full" />
                Enrolled Students
              </CardTitle>
              <Link href={`/teacher/courses/${courseId}/students`}>
                <Button variant="outline" className="border-islamic-green-200 text-islamic-green-700 hover:bg-islamic-green-50">
                  Manage All Students
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {course.enrollments && course.enrollments.length > 0 ? (
                <div className="space-y-2">
                  {course.enrollments.slice(0, 5).map((enrollment) => {
                    const progress = enrollment.progress ?? enrollment.overall_progress ?? 0;
                    return (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-islamic-green-200 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-islamic-green-500 to-islamic-green-700 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-medium text-sm">
                              {enrollment.student?.first_name?.[0] || enrollment.student?.username?.[0] || 'S'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {enrollment.student?.first_name
                                ? `${enrollment.student.first_name} ${enrollment.student.last_name || ''}`
                                : enrollment.student?.username}
                            </p>
                            <p className="text-xs text-slate-500">{enrollment.student?.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{progress}%</p>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-islamic-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {course.enrollments.length > 5 && (
                    <Link href={`/teacher/courses/${courseId}/students`}>
                      <Button variant="ghost" className="w-full text-islamic-green-600 hover:text-islamic-green-700 hover:bg-islamic-green-50">
                        View all {course.enrollments.length} students
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">No students enrolled yet</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">Students will appear here once they enroll in this course</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-1 h-5 bg-islamic-green-500 rounded-full" />
                Course Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">Course Analytics</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                  View detailed performance metrics and student engagement data
                </p>
                <Link href={`/teacher/courses/${courseId}/analytics`}>
                  <Button className="bg-islamic-green-600 hover:bg-islamic-green-700 shadow-md shadow-islamic-green-600/20">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Full Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TeacherLayout>
  );
}
