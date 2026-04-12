/**
 * Legacy redirect — the full-page "new lesson" route has been replaced by
 * the in-course outline drawer at /courses/[id]?lesson=new. Existing
 * bookmarks and links fall through here and get forwarded.
 */

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateLessonLegacyRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  useEffect(() => {
    router.replace(`/courses/${courseId}/lessons?lesson=new`);
  }, [courseId, router]);

  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="text-sm text-charcoal-500">Redirecting…</div>
    </div>
  );
}
