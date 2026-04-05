/**
 * Create Lesson Page
 * Form for creating new lessons within a course
 */

'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LessonForm, type LessonFormData } from '@/components/lessons/lesson-form';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface CourseInfo {
  id: number;
  documentId: string;
  title: string;
}

export default function CreateLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch course data to display context
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/api/v1/courses/${courseId}`);
        if (!res.ok) throw new Error(`Failed to fetch course (${res.status})`);
        const json = await res.json();
        setCourse(json.data);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (data: LessonFormData) => {
    setIsSaving(true);
    setError(null);

    try {
      // Generate unique slug
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Date.now().toString(36);

      // Map lesson type from form to Strapi enum
      const lessonTypeMap: Record<string, string> = {
        video: 'video',
        audio: 'reading',  // Strapi has no 'audio' enum, map to reading
        article: 'reading',
        quiz: 'quiz',
        interactive: 'interactive',
      };

      // Build lesson data matching Strapi schema fields
      const lessonData: Record<string, unknown> = {
        title: data.title,
        slug,
        description: data.description || undefined,
        lesson_type: lessonTypeMap[data.type] || 'reading',
        lesson_order: data.order || 1,
        duration_minutes: data.duration || 10,
        course: courseId,
      };

      // Map content fields to Strapi schema fields
      if (data.type === 'video' && data.content.videoUrl) {
        lessonData.video_url = data.content.videoUrl;
      }
      if (data.type === 'article' && data.content.articleBody) {
        lessonData.content = data.content.articleBody;
      }
      if (data.content.videoTranscript || data.content.audioTranscript) {
        lessonData.content = data.content.videoTranscript || data.content.audioTranscript;
      }

      const response = await fetch(`${API_URL}/api/v1/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: lessonData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `Request failed with status code ${response.status}`);
      }

      const lessonResult = await response.json();

      // If quiz type with questions, create a linked Quiz entity
      if (data.type === 'quiz' && data.content.questions && data.content.questions.length > 0) {
        const quizSlug = `quiz-${slug}`;
        const totalPoints = data.content.questions.reduce((sum, q) => sum + (q.points || 10), 0);

        const quizData = {
          data: {
            title: `Quiz: ${data.title}`,
            slug: quizSlug,
            quiz_type: 'practice',
            passing_score: data.content.passingScore || 70,
            time_limit_minutes: data.content.timeLimit || undefined,
            questions: data.content.questions,
            total_points: totalPoints,
            lesson: lessonResult.data?.documentId || lessonResult.data?.id,
          },
        };

        const quizRes = await fetch(`${API_URL}/api/v1/quizzes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quizData),
        });

        if (!quizRes.ok) {
          console.warn('Quiz creation failed, but lesson was created successfully');
        }
      }

      // Redirect back to course edit page
      router.push(`/courses/${courseId}`);
    } catch (err) {
      console.error('Failed to create lesson:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create lesson. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/courses/${courseId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-charcoal-600">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href={`/courses/${courseId}`}
            className="rounded-lg p-2 text-charcoal-600 transition-colors hover:bg-charcoal-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">Course Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href={`/courses/${courseId}`}
          className="rounded-lg p-2 text-charcoal-600 transition-colors hover:bg-charcoal-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-charcoal-900">Create New Lesson</h1>
          <p className="mt-2 text-charcoal-600">
            Add a lesson to <span className="font-medium">{course.title}</span>
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Lesson Form */}
      <LessonForm
        courseId={courseId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </div>
  );
}
