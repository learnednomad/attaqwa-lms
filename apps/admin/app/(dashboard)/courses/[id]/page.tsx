/**
 * /courses/[id] → redirects to /courses/[id]/lessons
 * The course detail surface is a tabbed view: Lessons is the default
 * (primary work surface), Settings holds the edit form. Any existing links
 * that pointed at /courses/[id] (including deep-links to the lesson drawer
 * like ?lesson=new or ?lesson=<id>) fall through to here and are forwarded
 * with their query string intact.
 */

'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CourseRootRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.id as string;

  useEffect(() => {
    const qs = searchParams?.toString();
    const target = qs ? `/courses/${courseId}/lessons?${qs}` : `/courses/${courseId}/lessons`;
    router.replace(target);
  }, [courseId, router, searchParams]);

  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );
}
