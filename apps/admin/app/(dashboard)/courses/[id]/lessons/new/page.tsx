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
import { strapiClient } from '@attaqwa/api-client';
import type { Course } from '@attaqwa/shared-types';

export default function CreateLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch course data to display context
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await strapiClient.get(`/courses/${courseId}`);
        setCourse(response.data.data);
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
      // Prepare form data for Strapi
      const formData = new FormData();

      // Add lesson data
      const lessonData = {
        title: data.title,
        description: data.description,
        type: data.type,
        duration: data.duration,
        order: data.order,
        isRequired: data.isRequired,
        content: data.content,
        course: courseId, // Link to parent course
      };

      formData.append('data', JSON.stringify(lessonData));

      // Add media files if provided
      if (data.content.videoFile) {
        formData.append('files.video', data.content.videoFile);
      }

      if (data.content.audioFile) {
        formData.append('files.audio', data.content.audioFile);
      }

      // Create lesson via Strapi API
      await strapiClient.post('/lessons', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
