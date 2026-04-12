'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface User {
  id: string;
  email: string;
  studentId?: string;
  name: string;
  role: string;
  requiresPasswordChange?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithStudentId: (studentId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Decide the post-login landing page. Users whose account was created with
 * a temporary password land on /student/change-password and cannot proceed
 * until they set a new one.
 */
function landingPathFor(user: Pick<User, 'requiresPasswordChange'>, fallback = '/student/dashboard') {
  return user.requiresPasswordChange ? '/student/change-password' : fallback;
}

export function StudentAuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, refetch } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as { role?: string }).role ?? 'user',
        requiresPasswordChange:
          (session.user as { requiresPasswordChange?: boolean }).requiresPasswordChange === true,
      }
    : null;

  // Enforce the password-change gate: if a logged-in student needs to
  // change their password, lock them to /student/change-password until
  // they do. Login and the change-password page itself are exempt.
  useEffect(() => {
    if (isPending || !user?.requiresPasswordChange) return;
    if (!pathname?.startsWith('/student')) return;
    const exempt =
      pathname.startsWith('/student/login') ||
      pathname.startsWith('/student/forgot-password') ||
      pathname.startsWith('/student/change-password');
    if (!exempt) {
      router.replace(`/student/change-password?next=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, user?.requiresPasswordChange, pathname, router]);

  const login = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      throw new Error(error.message || 'Login failed');
    }
    // Pull the freshly-established session so we can route based on the flag.
    const { data: freshSession } = await authClient.getSession();
    const requires =
      (freshSession?.user as { requiresPasswordChange?: boolean })?.requiresPasswordChange === true;
    router.push(landingPathFor({ requiresPasswordChange: requires }));
  };

  const loginWithStudentId = async (studentId: string, password: string) => {
    // Student ID login: use the student ID as the email identifier
    // This assumes student IDs are mapped to email addresses in the system
    const { error } = await authClient.signIn.email({
      email: studentId,
      password,
    });
    if (error) {
      throw new Error(error.message || 'Login failed');
    }
    const { data: freshSession } = await authClient.getSession();
    const requires =
      (freshSession?.user as { requiresPasswordChange?: boolean })?.requiresPasswordChange === true;
    router.push(landingPathFor({ requiresPasswordChange: requires }));
  };

  const logout = async () => {
    await authClient.signOut();
    router.push('/student/login');
  };

  const refreshUser = async () => {
    await refetch();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading: isPending, login, loginWithStudentId, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
}
