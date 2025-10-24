'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  studentId?: string;
  name: string;
  role: string;
  enrolledCourses?: Array<{
    courseId: string;
    courseName: string;
    courseCode?: string;
    instructor?: string;
    enrolledAt: string;
    progress?: number;
  }>;
  recentSubmissions?: Array<{
    id: string;
    assignmentTitle: string;
    submittedAt: string;
    grade?: number;
    status: string;
  }>;
  unreadNotifications?: number;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/student/auth/me', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/student/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      
      // Store token in localStorage as backup
      if (data.token) {
        localStorage.setItem('studentToken', data.token);
      }
      
      router.push('/student/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const loginWithStudentId = async (studentId: string, password: string) => {
    try {
      const response = await fetch('/api/student/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ studentId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      
      // Store token in localStorage as backup
      if (data.token) {
        localStorage.setItem('studentToken', data.token);
      }
      
      router.push('/student/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/student/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentData');
      router.push('/student/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      setUser(null);
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentData');
      router.push('/student/login');
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithStudentId, logout, refreshUser }}>
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