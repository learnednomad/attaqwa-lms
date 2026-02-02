'use client';

import React, { useState, useEffect } from 'react';
import { sanitizeHtml } from '@/lib/sanitize';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Loader2, AlertCircle, Edit, Trash2, Eye,
  Clock, FileText, Video, BookOpen, CheckCircle, Play
} from 'lucide-react';
import { teacherApi } from '@/lib/teacher-api';

interface LessonDetail {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  lesson_order: number;
  lesson_type: string;
  duration_minutes: number;
  content: string;
  video_url: string | null;
  learning_objectives: string[];
  prerequisites: string | null;
  is_free: boolean;
  is_preview: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: number;
    documentId: string;
    title: string;
  };
}

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await teacherApi.lessons.getLesson(lessonId);
        setLesson(result.data as unknown as LessonDetail);
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchLesson();
  }, [lessonId]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5 text-purple-600" />;
      case 'quiz': return <BookOpen className="h-5 w-5 text-amber-600" />;
      default: return <FileText className="h-5 w-5 text-indigo-600" />;
    }
  };

  if (loading) {
    return (
      <TeacherLayout title="Lesson Detail" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </TeacherLayout>
    );
  }

  if (error || !lesson) {
    return (
      <TeacherLayout title="Lesson Detail" subtitle="Error loading lesson">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load lesson</h3>
          <p className="text-gray-500 mb-4">{error || 'Lesson not found'}</p>
          <Link href="/teacher/lessons">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lessons
            </Button>
          </Link>
        </Card>
      </TeacherLayout>
    );
  }

  const isPublished = !!lesson.publishedAt;

  return (
    <TeacherLayout title={lesson.title} subtitle={`Lesson ${lesson.lesson_order}`}>
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/teacher/lessons">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lessons
          </Button>
        </Link>
      </div>

      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getTypeIcon(lesson.lesson_type)}
                <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className={isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}>
                  {isPublished ? 'Published' : 'Draft'}
                </Badge>
                {lesson.is_free && (
                  <Badge className="bg-blue-100 text-blue-700">Free</Badge>
                )}
                {lesson.is_preview && (
                  <Badge className="bg-purple-100 text-purple-700">Preview</Badge>
                )}
              </div>
              {lesson.description && (
                <p className="text-gray-600 mb-4">{lesson.description}</p>
              )}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {lesson.duration_minutes} min
                </span>
                <span className="capitalize">{lesson.lesson_type}</span>
                <span>Lesson {lesson.lesson_order}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/teacher/lessons/${lessonId}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  // TODO: Add delete confirmation dialog
                  console.log('Delete lesson:', lessonId);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Lesson Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lesson.content ? (
                <div
                  className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson.content) }}
                />
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No content added yet</p>
                  <Link href={`/teacher/lessons/${lessonId}/edit`}>
                    <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
                      <Edit className="h-4 w-4 mr-2" /> Add Content
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video */}
          {lesson.video_url && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" /> Video Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Play className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Video URL</p>
                    <p className="text-sm text-purple-600 break-all">{lesson.video_url}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Objectives */}
          {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.learning_objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Lesson Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900 capitalize">{lesson.lesson_type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium text-gray-900">{lesson.duration_minutes} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order</span>
                <span className="font-medium text-gray-900">Lesson {lesson.lesson_order}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Free Access</span>
                <span className="font-medium text-gray-900">{lesson.is_free ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Preview</span>
                <span className="font-medium text-gray-900">{lesson.is_preview ? 'Yes' : 'No'}</span>
              </div>
              {lesson.prerequisites && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500 mb-1">Prerequisites</p>
                  <p className="text-sm text-gray-900">{lesson.prerequisites}</p>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {new Date(lesson.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/teacher/lessons/${lessonId}/edit`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" /> Edit Lesson
                </Button>
              </Link>
              {lesson.course?.documentId && (
                <Link href={`/teacher/courses/${lesson.course.documentId}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" /> View Course
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}
