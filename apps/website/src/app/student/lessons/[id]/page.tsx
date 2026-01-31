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
  ArrowLeft, ArrowRight, BookOpen, Clock, Video, FileText, Play,
  CheckCircle, Loader2, AlertCircle, HelpCircle
} from 'lucide-react';
import { studentApi, Lesson, Course, UserProgress } from '@/lib/student-api';

const LESSON_TYPE_ICONS: Record<string, React.ElementType> = {
  video: Video,
  reading: FileText,
  interactive: Play,
  quiz: HelpCircle,
  audio: Play,
};

export default function StudentLessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch lesson
        const lessonRes = await studentApi.lessons.getById(lessonId);
        const lessonData = lessonRes.data;
        setLesson(lessonData);

        // Fetch course if lesson has one
        if (lessonData.course) {
          const courseId = String(lessonData.course.documentId || lessonData.course.id);
          try {
            const courseRes = await studentApi.courses.getById(courseId);
            setCourse(courseRes.data);

            // Fetch all lessons in this course for prev/next navigation
            const allLessonsRes = await studentApi.lessons.getAll({ course_id: courseId });
            const sorted = (allLessonsRes.data || []).sort((a, b) => a.lesson_order - b.lesson_order);
            setCourseLessons(sorted);
          } catch {
            // Course detail might fail, that's ok
          }
        }

        // Fetch user progress for this lesson
        try {
          const progressRes = await studentApi.progress.getMine();
          const allProgress = progressRes.data || [];
          const lessonProgress = allProgress.find(p => p.lesson?.id === lessonData.id);
          setProgress(lessonProgress || null);
        } catch {
          // Progress might fail if not authenticated
        }
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchData();
  }, [lessonId]);

  const handleMarkComplete = async () => {
    if (!lesson) return;
    try {
      setCompleting(true);
      await studentApi.progress.updateLesson(lesson.id, {
        status: 'completed',
        progress_percentage: 100,
      });
      setProgress(prev => prev
        ? { ...prev, status: 'completed', progress_percentage: 100 }
        : { id: 0, documentId: '', status: 'completed', progress_percentage: 100, time_spent_minutes: 0 } as UserProgress
      );
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    } finally {
      setCompleting(false);
    }
  };

  // Find prev/next lessons
  const currentIndex = courseLessons.findIndex(l =>
    String(l.documentId) === lessonId || String(l.id) === lessonId
  );
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < courseLessons.length - 1
    ? courseLessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <StudentLayout title="Lesson" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </StudentLayout>
    );
  }

  if (error || !lesson) {
    return (
      <StudentLayout title="Lesson" subtitle="Error">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load lesson</h3>
          <p className="text-gray-500 mb-4">{error || 'Lesson not found'}</p>
          <Link href="/student/lessons">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lessons
            </Button>
          </Link>
        </Card>
      </StudentLayout>
    );
  }

  const TypeIcon = LESSON_TYPE_ICONS[lesson.lesson_type] || FileText;
  const isCompleted = progress?.status === 'completed';

  return (
    <StudentLayout title={lesson.title} subtitle={course?.title || 'Lesson'}>
      {/* Back + Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/student/lessons">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> All Lessons
          </Button>
        </Link>
        {course && (
          <Link href={`/student/courses/${course.documentId || course.id}`}>
            <Button variant="ghost" size="sm">
              <BookOpen className="h-4 w-4 mr-2" /> {course.title}
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isCompleted ? 'bg-emerald-100' : 'bg-blue-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <TypeIcon className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {lesson.duration_minutes} minutes
                    </span>
                    <span className="capitalize">{lesson.lesson_type}</span>
                    <span>Lesson {lesson.lesson_order}</span>
                    {lesson.is_free && <Badge variant="secondary" className="text-xs">Free</Badge>}
                  </div>
                </div>
              </div>

              {lesson.description && (
                <p className="text-gray-600 mb-4">{lesson.description}</p>
              )}

              {/* Status Badge */}
              {isCompleted ? (
                <Badge className="bg-emerald-100 text-emerald-700">
                  <CheckCircle className="h-3 w-3 mr-1" /> Completed
                </Badge>
              ) : progress?.status === 'in_progress' ? (
                <Badge className="bg-blue-100 text-blue-700">
                  <Play className="h-3 w-3 mr-1" /> In Progress
                </Badge>
              ) : (
                <Badge variant="secondary">Not Started</Badge>
              )}
            </CardContent>
          </Card>

          {/* Video Player */}
          {lesson.video_url && (
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                  {lesson.video_url.includes('youtube') || lesson.video_url.includes('youtu.be') ? (
                    <iframe
                      src={lesson.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full rounded-t-lg"
                      allowFullScreen
                      title={lesson.title}
                    />
                  ) : (
                    <div className="text-center text-white p-8">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Video Lesson</p>
                      <a
                        href={lesson.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 underline"
                      >
                        Open Video
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson Content */}
          {lesson.content && (
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </CardContent>
            </Card>
          )}

          {/* Learning Objectives */}
          {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.learning_objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{obj}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Mark Complete / Navigation */}
          <div className="flex items-center justify-between">
            {prevLesson ? (
              <Link href={`/student/lessons/${prevLesson.documentId || prevLesson.id}`}>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous Lesson
                </Button>
              </Link>
            ) : <div />}

            {!isCompleted && (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleMarkComplete}
                disabled={completing}
              >
                {completing ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><CheckCircle className="h-4 w-4 mr-2" /> Mark as Complete</>
                )}
              </Button>
            )}

            {nextLesson ? (
              <Link href={`/student/lessons/${nextLesson.documentId || nextLesson.id}`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Next Lesson <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* Sidebar - Course Curriculum */}
        <div className="space-y-6">
          {courseLessons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Course Curriculum</CardTitle>
                {course && (
                  <p className="text-sm text-gray-500">{course.title}</p>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {courseLessons.map((cl) => {
                    const isCurrent = String(cl.documentId) === lessonId || String(cl.id) === lessonId;
                    return (
                      <Link
                        key={cl.id}
                        href={`/student/lessons/${cl.documentId || cl.id}`}
                        className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          isCurrent ? 'bg-emerald-50 border-l-2 border-emerald-600' : ''
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                          isCurrent ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {cl.lesson_order}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`truncate ${isCurrent ? 'font-medium text-emerald-700' : 'text-gray-700'}`}>
                            {cl.title}
                          </p>
                          <p className="text-xs text-gray-400">{cl.duration_minutes} min</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quiz */}
          {lesson.quiz && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lesson Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{lesson.quiz.title}</p>
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <p>Time limit: {lesson.quiz.time_limit_minutes} min</p>
                  <p>Passing score: {lesson.quiz.passing_score}%</p>
                  <p>Max attempts: {lesson.quiz.max_attempts}</p>
                </div>
                <Link href={`/student/quizzes/${lesson.quiz.documentId || lesson.quiz.id}`}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <HelpCircle className="h-4 w-4 mr-2" /> Take Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
