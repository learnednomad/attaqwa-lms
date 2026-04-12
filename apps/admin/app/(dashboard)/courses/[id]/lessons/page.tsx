/**
 * Course Lessons Page
 * Primary work surface for a course: the lesson outline with drag-and-drop,
 * inline quick-add, and the URL-driven editor drawer.
 */

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CourseShell } from '@/components/courses/course-shell';
import { CourseLessonsOutline } from '@/components/lessons/course-lessons-outline';
import { adminApiEndpoints, strapiClient } from '@/lib/api/strapi-client';

interface CourseMeta {
  id: number;
  documentId?: string;
  title: string;
  instructor?: string | null;
}

export default function CourseLessonsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<CourseMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    strapiClient
      .get<CourseMeta>(
        `${adminApiEndpoints.courses}/${courseId}?fields[0]=title&fields[1]=instructor&publicationState=preview`
      )
      .then((res) => {
        if (cancelled) return;
        setCourse((res.data as unknown) as CourseMeta);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[CourseLessonsPage] failed to load course', err);
        setError('Could not load course.');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (isLoading && !course) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <CourseShell courseId={courseId} activeTab="lessons" courseTitle="Course not found">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error || "This course doesn't exist or has been removed."}
        </div>
      </CourseShell>
    );
  }

  return (
    <CourseShell
      courseId={courseId}
      courseTitle={course.title}
      courseInstructor={course.instructor}
      activeTab="lessons"
    >
      <CourseLessonsOutline courseId={courseId} courseTitle={course.title} />
    </CourseShell>
  );
}
