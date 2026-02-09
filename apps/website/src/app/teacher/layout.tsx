'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PUBLIC_TEACHER_PATHS = ['/teacher/login', '/teacher/forgot-password'];

function TeacherAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  const isPublicPage = PUBLIC_TEACHER_PATHS.includes(pathname);

  useEffect(() => {
    if (isPublicPage) {
      setIsAuthed(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/teacher/auth/me', { credentials: 'include' });
        if (res.ok) {
          setIsAuthed(true);
        } else {
          setIsAuthed(false);
          router.push('/teacher/login');
        }
      } catch {
        setIsAuthed(false);
        router.push('/teacher/login');
      }
    };

    checkAuth();
  }, [pathname, isPublicPage, router]);

  // Public pages render immediately
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Loading state
  if (isAuthed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Not authenticated - will redirect via useEffect
  if (!isAuthed) {
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
