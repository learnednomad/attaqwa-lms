'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

const PUBLIC_TEACHER_PATHS = ['/teacher/login', '/teacher/forgot-password'];

function TeacherAuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPage = PUBLIC_TEACHER_PATHS.includes(pathname);

  useEffect(() => {
    if (!isPublicPage && !isPending && !session) {
      router.push('/teacher/login');
    }
  }, [session, isPending, isPublicPage, router]);

  // Public pages render immediately
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Not authenticated - will redirect via useEffect
  if (!session) {
    return null;
  }

  return <>{children}</>;
}

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TeacherAuthGuard>
      {children}
    </TeacherAuthGuard>
  );
}
