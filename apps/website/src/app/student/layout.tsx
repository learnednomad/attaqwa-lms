'use client';

import { StudentAuthProvider, useStudentAuth } from '@/contexts/StudentAuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PUBLIC_STUDENT_PATHS = ['/student/login', '/student/forgot-password', '/student/register'];

function StudentAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useStudentAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPage = PUBLIC_STUDENT_PATHS.includes(pathname);

  useEffect(() => {
    if (!isPublicPage && !loading && !user) {
      router.push('/student/login');
    }
  }, [user, loading, isPublicPage, router]);

  // Public pages render immediately
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green-600" />
      </div>
    );
  }

  // Not authenticated - will redirect via useEffect
  if (!user) {
    return null;
  }

  return <>{children}</>;
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentAuthProvider>
      <StudentAuthGuard>
        {children}
      </StudentAuthGuard>
    </StudentAuthProvider>
  );
}
