/**
 * Edit Course Page
 * Form for editing existing courses with lesson management
 */

'use client';

import { ArrowLeft, BookOpen, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CourseForm, type CourseFormData } from '@/components/courses/course-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { strapiClient } from '@attaqwa/api-client';
import type { Course, StrapiResponse } from '@attaqwa/shared-types';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch course data on mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await strapiClient.get<StrapiResponse<Course>>(`/courses/${courseId}?populate=*`);
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

  const handleSubmit = async (data: CourseFormData) => {
    setIsSaving(true);
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

      // Add cover image if new file uploaded
      if (data.coverImage instanceof File) {
        formData.append('files.coverImage', data.coverImage);
      }

      // Update course via Strapi API
      await strapiClient.put(`/courses/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to courses list on success
      router.push('/courses');
    } catch (err) {
      console.error('Failed to update course:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update course. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/courses');
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
            href="/courses"
            className="rounded-lg p-2 text-charcoal-600 transition-colors hover:bg-charcoal-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">Course Not Found</h1>
          </div>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-charcoal-600">
              The course you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/courses">
              <Button className="mt-4">Return to Courses</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-charcoal-900">Edit Course</h1>
          <p className="mt-2 text-charcoal-600">
            Update course details and manage lessons
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
        initialData={course}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />

      {/* Lesson Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Lessons</CardTitle>
              <CardDescription>
                Manage lessons and learning materials for this course
              </CardDescription>
            </div>
            <Link href={`/courses/${courseId}/lessons/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Lesson
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {course.lessons && course.lessons.length > 0 ? (
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between rounded-lg border border-charcoal-200 p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-sm font-semibold text-primary-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">
                        {lesson.title}
                      </p>
                      <div className="mt-1 flex items-center space-x-3 text-xs text-charcoal-500">
                        <span className="capitalize">{lesson.type}</span>
                        <span>•</span>
                        <span>{lesson.duration} min</span>
                        {lesson.isRequired && (
                          <>
                            <span>•</span>
                            <span className="text-primary-600">Required</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this lesson?')) {
                          // TODO: Implement delete functionality
                          console.log('Delete lesson:', lesson.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-charcoal-400" />
              <p className="mt-4 text-charcoal-600">No lessons yet</p>
              <p className="mt-1 text-sm text-charcoal-500">
                Get started by adding your first lesson to this course
              </p>
              <Link href={`/courses/${courseId}/lessons/new`}>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Lesson
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
