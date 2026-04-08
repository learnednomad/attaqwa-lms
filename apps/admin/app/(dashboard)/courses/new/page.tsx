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

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

  const handleSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate unique slug from title + short timestamp
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Date.now().toString(36);

      // Map age tier (form uses 'all' but schema doesn't have it)
      const ageTier = data.ageTier === 'all' ? 'adults' : data.ageTier;

      // Prepare course data for Strapi
      const courseData = {
        data: {
          title: data.title,
          slug,
          description: data.description,
          subject: data.category,
          difficulty: data.difficulty,
          age_tier: ageTier,
          duration_weeks: data.duration ? Math.max(1, Math.ceil(data.duration / 60)) : 1,
          schedule: data.schedule || 'self-paced',
          instructor: data.instructor || 'Attaqwa Masjid Education Team',
          is_featured: false,
          prerequisites: data.prerequisites || undefined,
          learning_outcomes: data.learningOutcomes?.filter(o => o.trim()) || undefined,
          max_students: data.maxStudents || undefined,
          start_date: data.startDate || undefined,
          end_date: data.endDate || undefined,
        },
      };

      const response = await fetch(`${API_URL}/api/v1/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `Request failed with status code ${response.status}`);
      }

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
