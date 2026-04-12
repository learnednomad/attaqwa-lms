/**
 * Course Settings Page
 * Metadata and publishing settings for a course. The lessons outline lives
 * on the Lessons tab so this page stays focused on the course entity itself.
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CourseForm, type CourseFormData } from '@/components/courses/course-form';
import { CourseShell } from '@/components/courses/course-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { adminApiEndpoints, strapiClient } from '@/lib/api/strapi-client';

interface Course {
  [key: string]: unknown;
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  description: string;
  subject: string;
  category?: string;
  difficulty: string;
  age_tier: string;
  ageTier?: string;
  duration_weeks: number;
  estimatedDuration?: number;
  schedule: string;
  instructor: string;
  is_featured: boolean;
  isPublished?: boolean;
  coverImage?: { url: string };
}

export default function CourseSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    strapiClient
      .get<Course>(`${adminApiEndpoints.courses}/${courseId}?populate=*`)
      .then((res) => {
        if (cancelled) return;
        setCourse(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to fetch course:', err);
        setError('Failed to load course. Please try again.');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const handleSubmit = async (data: CourseFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      const ageTier = data.ageTier === 'all' ? 'adults' : data.ageTier;
      const courseData = {
        data: {
          title: data.title,
          description: data.description,
          subject: data.category,
          difficulty: data.difficulty,
          age_tier: ageTier,
          duration_weeks: data.duration ? Math.max(1, Math.ceil(data.duration / 60)) : 1,
          schedule: data.schedule || undefined,
          instructor: data.instructor || undefined,
          prerequisites: data.prerequisites || undefined,
          learning_outcomes: data.learningOutcomes?.filter((o) => o.trim()) || undefined,
          max_students: data.maxStudents || undefined,
          start_date: data.startDate || undefined,
          end_date: data.endDate || undefined,
        },
      };
      await strapiClient.put(`${adminApiEndpoints.courses}/${courseId}`, courseData);
      router.push('/courses');
    } catch (err) {
      console.error('Failed to update course:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to update course. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/courses');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <CourseShell courseId={courseId} activeTab="settings" courseTitle="Course not found">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-charcoal-600">
              The course you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
            <Button className="mt-4" onClick={() => router.push('/courses')}>
              Return to courses
            </Button>
          </CardContent>
        </Card>
      </CourseShell>
    );
  }

  return (
    <CourseShell
      courseId={courseId}
      courseTitle={course.title}
      courseInstructor={course.instructor}
      activeTab="settings"
    >
      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <CourseForm
        initialData={course}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </CourseShell>
  );
}
