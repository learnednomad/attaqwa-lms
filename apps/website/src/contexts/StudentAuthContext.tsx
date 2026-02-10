'use client';

import React, { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface User {
  id: string;
  email: string;
  studentId?: string;
  name: string;
  role: string;
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

export function StudentAuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, refetch } = authClient.useSession();
  const router = useRouter();

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role ?? 'user',
      }
    : null;

  const login = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      throw new Error(error.message || 'Login failed');
    }
    router.push('/student/dashboard');
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
    router.push('/student/dashboard');
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
