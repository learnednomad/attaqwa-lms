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
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
      </div>

      {/* Course Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Course Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <Badge className={isPublished
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
                }>
                  {isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {course.subject}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {course.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.age_tier}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration_weeks} weeks
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/teacher/courses/${courseId}/edit`}>
                <Button variant="outline">
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
                  className="bg-indigo-600 hover:bg-indigo-700"
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
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                <p className="text-sm text-gray-500">Enrolled Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
                <p className="text-sm text-gray-500">Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {course.completion_rate || 0}%
                </p>
                <p className="text-sm text-gray-500">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {course.average_progress || 0}%
                </p>
                <p className="text-sm text-gray-500">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lessons ({totalLessons})</TabsTrigger>
          <TabsTrigger value="students">Students ({totalStudents})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium">{course.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-medium capitalize">{course.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age Group</p>
                    <p className="font-medium capitalize">{course.age_tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{course.duration_weeks} weeks</p>
                  </div>
                  {course.schedule && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Schedule</p>
                      <p className="font-medium">{course.schedule}</p>
                    </div>
                  )}
                  {course.max_students && (
                    <div>
                      <p className="text-sm text-gray-500">Max Students</p>
                      <p className="font-medium">{course.max_students}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                {course.learning_outcomes && course.learning_outcomes.length > 0 ? (
                  <ul className="space-y-2">
                    {course.learning_outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No learning outcomes defined</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href={`/teacher/courses/${courseId}/edit`}>
                    <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                      <Edit className="h-6 w-6" />
                      <span>Edit Course</span>
                    </Button>
                  </Link>
                  <Link href={`/teacher/courses/${courseId}/students`}>
                    <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                      <Users className="h-6 w-6" />
                      <span>Manage Students</span>
                    </Button>
                  </Link>
                  <Link href={`/teacher/courses/${courseId}/analytics`}>
                    <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                      <BarChart3 className="h-6 w-6" />
                      <span>View Analytics</span>
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    <span>Schedule Class</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="lessons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Course Lessons</CardTitle>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Add Lesson
              </Button>
            </CardHeader>
            <CardContent>
              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-3">
                  {course.lessons.sort((a, b) => a.order - b.order).map((lesson, index) => (
                    <div
                      key={lesson.documentId}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{lesson.title}</p>
                          {lesson.duration_minutes && (
                            <p className="text-sm text-gray-500">
                              {lesson.duration_minutes} minutes
                            </p>
                          )}
                        </div>
                      </div>
                      <Link href={`/teacher/lessons/${lesson.documentId}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No lessons yet</p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
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
              <CardTitle>Enrolled Students</CardTitle>
              <Link href={`/teacher/courses/${courseId}/students`}>
                <Button variant="outline">
                  Manage All Students
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {course.enrollments && course.enrollments.length > 0 ? (
                <div className="space-y-3">
                  {course.enrollments.slice(0, 5).map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-700 font-medium">
                            {enrollment.student?.first_name?.[0] || enrollment.student?.username?.[0] || 'S'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {enrollment.student?.first_name
                              ? `${enrollment.student.first_name} ${enrollment.student.last_name || ''}`
                              : enrollment.student?.username}
                          </p>
                          <p className="text-sm text-gray-500">{enrollment.student?.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{enrollment.progress ?? enrollment.overall_progress ?? 0}%</p>
                        <p className="text-sm text-gray-500">Progress</p>
                      </div>
                    </div>
                  ))}
                  {course.enrollments.length > 5 && (
                    <Link href={`/teacher/courses/${courseId}/students`}>
                      <Button variant="ghost" className="w-full">
                        View all {course.enrollments.length} students
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No students enrolled yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Course Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  Detailed analytics for this course
                </p>
                <Link href={`/teacher/courses/${courseId}/analytics`}>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
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
