'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, BookOpen, Clock, Users, Calendar, Play,
  CheckCircle, Video, FileText, HelpCircle, Loader2, AlertCircle
} from 'lucide-react';
import { studentApi, Course, Lesson, Enrollment, UserProgress } from '@/lib/student-api';

const LESSON_TYPE_ICONS: Record<string, React.ElementType> = {
  video: Video,
  reading: FileText,
  interactive: Play,
  quiz: HelpCircle,
  audio: Play,
};

export default function StudentCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Map<number, UserProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch course details
        const courseRes = await studentApi.courses.getById(courseId);
        setCourse(courseRes.data);

        // Fetch lessons for this course
        const lessonsRes = await studentApi.lessons.getAll({ course_id: courseId });
        const sorted = (lessonsRes.data || []).sort((a, b) => a.lesson_order - b.lesson_order);
        setLessons(sorted);

        // Fetch enrollment & progress
        try {
          const [enrollRes, progressRes] = await Promise.all([
            studentApi.enrollments.getMine(),
            studentApi.progress.getMine({ course_id: courseId }),
          ]);

          const myEnrollment = (enrollRes.data || []).find(
            e => String(e.course?.id) === courseId || String(e.course?.documentId) === courseId
          );
          setEnrollment(myEnrollment || null);

          const progressMap = new Map<number, UserProgress>();
          (progressRes.data || []).forEach(p => {
            if (p.lesson) progressMap.set(p.lesson.id, p);
          });
          setLessonProgress(progressMap);
        } catch {
          // Non-authenticated users won't have enrollment data
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

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

  return (
    <StudentLayout title={course.title} subtitle={`${course.subject} | ${course.difficulty}`}>
      {/* Back */}
      <div className="mb-4">
        <Link href="/student/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
          </Button>
        </Link>
      </div>

      {/* Course Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-3">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {course.instructor}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {course.duration_weeks} weeks
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" /> {lessons.length} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {Math.round(totalDuration / 60)}h total
                </span>
                {course.schedule && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {course.schedule}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={
                course.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                course.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }>
                {course.difficulty}
              </Badge>
              <Badge variant="secondary">{course.subject}</Badge>
              {course.age_tier && (
                <Badge variant="outline">{course.age_tier}</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main - Curriculum */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Progress</CardTitle>
                <span className="text-lg font-bold text-emerald-600">{overallProgress}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} className="h-3 mb-3" />
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{completedLessons} of {lessons.length} lessons completed</span>
                {enrollment && (
                  <span>Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <Card>
            <CardHeader>
              <CardTitle>Curriculum</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {lessons.map((lesson) => {
                  const progress = lessonProgress.get(lesson.id);
                  const isComplete = progress?.status === 'completed';
                  const isInProgress = progress?.status === 'in_progress';
                  const TypeIcon = LESSON_TYPE_ICONS[lesson.lesson_type] || FileText;

                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/student/lessons/${lesson.documentId || lesson.id}`)}
                    >
                      {/* Order Number */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                        isComplete ? 'bg-emerald-100 text-emerald-700' :
                        isInProgress ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {isComplete ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          lesson.lesson_order
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 truncate">{lesson.title}</h4>
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
                        <TypeIcon className="h-4 w-4" />
                        <span>{lesson.duration_minutes} min</span>
                        {isComplete && (
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">Done</Badge>
                        )}
                        {isInProgress && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">In Progress</Badge>
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lessons.length > 0 && (() => {
                // Find the first incomplete lesson
                const nextLesson = lessons.find(l => {
                  const p = lessonProgress.get(l.id);
                  return !p || p.status !== 'completed';
                }) || lessons[0];

                return (
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => router.push(`/student/lessons/${nextLesson.documentId || nextLesson.id}`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {completedLessons > 0 ? 'Continue Learning' : 'Start Course'}
                  </Button>
                );
              })()}
              <Link href="/student/lessons" className="block">
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" /> All My Lessons
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Instructor</span>
                <span className="font-medium">{course.instructor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subject</span>
                <span className="font-medium capitalize">{course.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Difficulty</span>
                <span className="font-medium capitalize">{course.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{course.duration_weeks} weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Students</span>
                <span className="font-medium">{course.current_enrollments}</span>
              </div>
              {course.learning_outcomes && course.learning_outcomes.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="font-medium text-gray-700 mb-2">What you'll learn</p>
                  <ul className="space-y-1">
                    {course.learning_outcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="h-3 w-3 text-emerald-500 mt-1 shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enrollment Status */}
          {enrollment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Enrollment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <Badge className={
                    enrollment.enrollment_status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    enrollment.enrollment_status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {enrollment.enrollment_status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Enrolled</span>
                  <span>{new Date(enrollment.enrollment_date).toLocaleDateString()}</span>
                </div>
                {enrollment.average_quiz_score !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quiz Average</span>
                    <span>{enrollment.average_quiz_score}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Time Spent</span>
                  <span>{Math.round(enrollment.total_time_spent_minutes / 60)}h</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
