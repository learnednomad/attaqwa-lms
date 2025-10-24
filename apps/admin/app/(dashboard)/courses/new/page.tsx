/**
 * Create Course Page
 * Form for creating new courses
 */

'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CourseForm, type CourseFormData } from '@/components/courses/course-form';
import { strapiClient } from '@attaqwa/api-client';

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare form data for Strapi
      const formData = new FormData();

      // Add course data
      const courseData = {
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        ageTier: data.ageTier,
        duration: data.duration,
        isPublished: data.isPublished,
      };

      formData.append('data', JSON.stringify(courseData));

      // Add cover image if provided
      if (data.coverImage instanceof File) {
        formData.append('files.coverImage', data.coverImage);
      }

      // Create course via Strapi API
      const response = await strapiClient.post('/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to courses list on success
      router.push('/courses');
    } catch (err) {
      console.error('Failed to create course:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create course. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/courses');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/courses"
          className="rounded-lg p-2 text-charcoal-600 transition-colors hover:bg-charcoal-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Create New Course</h1>
          <p className="mt-2 text-charcoal-600">
            Add a new course to your learning management system
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Course Form */}
      <CourseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
