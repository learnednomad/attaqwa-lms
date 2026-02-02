'use client';

import React, { useState } from 'react';
import { sanitizeHtml } from '@/lib/sanitize';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  CheckCircle2,
  Loader2,
  PlayCircle,
  FileText,
  Award
} from 'lucide-react';
import { useLessonById } from '@/lib/hooks/use-strapi-courses';
import { formatDuration } from '@/lib/strapi-api';

export default function LessonViewerPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const [isCompleted, setIsCompleted] = useState(false);

  const { data: lesson, isLoading, isError, error } = useLessonById(lessonId);

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-islamic-green-600" />
          <span className="ml-4 text-lg text-gray-600">Loading lesson...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 text-red-400 mx-auto mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Failed to load lesson</h3>
            <p className="text-gray-500 mb-4">
              {error?.message || 'Lesson not found'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleMarkComplete = () => {
    // TODO: Implement progress tracking
    setIsCompleted(true);
    alert('Progress tracking coming soon!');
  };

  const handleStartQuiz = () => {
    if (lesson.quiz) {
      router.push(`/education/quizzes/${lesson.quiz.documentId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (lesson.course) {
                    router.push(`/education/courses/${lesson.course.documentId}`);
                  } else {
                    router.back();
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {lesson.course ? 'Back to Course' : 'Back'}
              </Button>

              {lesson.course && (
                <div className="hidden md:block">
                  <p className="text-sm text-gray-600">Course:</p>
                  <p className="font-semibold text-islamic-navy-800">
                    {lesson.course.title}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isCompleted ? (
                <Badge className="bg-islamic-green-100 text-islamic-green-800">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Completed
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkComplete}
                  className="border-islamic-green-600 text-islamic-green-600 hover:bg-islamic-green-50"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lesson Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Meta */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{lesson.content_type}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(lesson.duration_minutes)}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold text-islamic-navy-800 mb-4">
                {lesson.title}
              </h1>

              <p className="text-lg text-gray-600">
                {lesson.description}
              </p>
            </div>

            {/* Media Display */}
            {lesson.media_url && (
              <Card>
                <CardContent className="p-6">
                  {lesson.content_type === 'video' && (
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white" />
                      <p className="text-white ml-4">Video player coming soon</p>
                    </div>
                  )}

                  {lesson.content_type === 'audio' && (
                    <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                      <div className="text-center">
                        <PlayCircle className="h-16 w-16 text-islamic-green-600 mx-auto mb-4" />
                        <p className="text-gray-700">Audio player coming soon</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-islamic-green-600" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(lesson.content || '<p class="text-gray-600">Content coming soon...</p>')
                  }}
                />
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Navigate to previous lesson
                  alert('Previous lesson navigation coming soon!');
                }}
                disabled
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Lesson
              </Button>

              <Button
                onClick={() => {
                  // TODO: Navigate to next lesson
                  alert('Next lesson navigation coming soon!');
                }}
                className="bg-islamic-green-600 hover:bg-islamic-green-700"
                disabled
              >
                Next Lesson
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Card */}
            {lesson.quiz && (
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Lesson Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-islamic-navy-800 mb-2">
                      {lesson.quiz.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {lesson.quiz.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Questions:</span>
                        <span className="font-semibold">{lesson.quiz.questions?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passing Score:</span>
                        <span className="font-semibold">{lesson.quiz.passing_score}%</span>
                      </div>
                      {lesson.quiz.time_limit_minutes && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time Limit:</span>
                          <span className="font-semibold">
                            {formatDuration(lesson.quiz.time_limit_minutes)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handleStartQuiz}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    Complete the lesson before taking the quiz
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Progress Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lesson Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${isCompleted ? 'text-islamic-green-600' : 'text-gray-800'}`}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Spent:</span>
                  <span className="font-semibold">0 min</span>
                </div>
                {lesson.quiz && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quiz Attempts:</span>
                    <span className="font-semibold">0</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resources Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Additional resources and materials will be available here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
