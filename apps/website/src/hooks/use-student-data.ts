'use client';

/**
 * React hooks for student portal data fetching
 * Uses SWR for caching and revalidation
 */

import { useState, useEffect, useCallback } from 'react';
import {
  studentApi,
  Course,
  Lesson,
  Enrollment,
  UserProgress,
  StudentDashboardData,
} from '@/lib/student-api';

// Simple state hook for data fetching with loading/error states
interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// DASHBOARD HOOK
// ============================================================================
export function useStudentDashboard(): UseDataState<StudentDashboardData> {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentApi.dashboard.getData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// COURSES HOOKS
// ============================================================================
export function useCourses(params?: {
  age_tier?: string;
  subject?: string;
  difficulty?: string;
  featured?: boolean;
}): UseDataState<Course[]> {
  const [data, setData] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentApi.courses.getAll(params);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch courses'));
    } finally {
      setLoading(false);
    }
  }, [params?.age_tier, params?.subject, params?.difficulty, params?.featured]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useCourse(id: string): UseDataState<Course> {
  const [data, setData] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const result = await studentApi.courses.getById(id);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch course'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// LESSONS HOOK
// ============================================================================
export function useLessons(params?: {
  course_id?: string;
  is_free?: boolean;
}): UseDataState<Lesson[]> {
  const [data, setData] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentApi.lessons.getAll(params);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch lessons'));
    } finally {
      setLoading(false);
    }
  }, [params?.course_id, params?.is_free]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// ENROLLMENTS HOOKS
// ============================================================================
interface EnrollmentsData {
  enrollments: Enrollment[];
  summary: {
    totalEnrollments: number;
    active: number;
    completed: number;
    certificatesEarned: number;
  };
}

export function useEnrollments(params?: {
  status?: 'active' | 'completed' | 'dropped';
}): UseDataState<EnrollmentsData> {
  const [data, setData] = useState<EnrollmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentApi.enrollments.getMine(params);
      setData({
        enrollments: result.data,
        summary: result.meta?.summary || {
          totalEnrollments: result.data.length,
          active: result.data.filter(e => e.enrollment_status === 'active').length,
          completed: result.data.filter(e => e.enrollment_status === 'completed').length,
          certificatesEarned: result.data.filter(e => e.certificate_issued).length,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch enrollments'));
    } finally {
      setLoading(false);
    }
  }, [params?.status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// PROGRESS HOOKS
// ============================================================================
export function useProgress(params?: {
  course_id?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
}): UseDataState<UserProgress[]> {
  const [data, setData] = useState<UserProgress[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentApi.progress.getMine(params);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch progress'));
    } finally {
      setLoading(false);
    }
  }, [params?.course_id, params?.status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// ENROLLMENT ACTIONS HOOK
// ============================================================================
interface EnrollmentActions {
  enrollInCourse: (courseId: number) => Promise<void>;
  dropCourse: (enrollmentId: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useEnrollmentActions(onSuccess?: () => void): EnrollmentActions {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enrollInCourse = async (courseId: number) => {
    try {
      setLoading(true);
      setError(null);
      await studentApi.enrollments.enroll(courseId);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to enroll'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const dropCourse = async (enrollmentId: number) => {
    try {
      setLoading(true);
      setError(null);
      await studentApi.enrollments.updateStatus(enrollmentId, 'dropped');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to drop course'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { enrollInCourse, dropCourse, loading, error };
}

// ============================================================================
// PROGRESS ACTIONS HOOK
// ============================================================================
interface ProgressActions {
  updateLessonProgress: (
    lessonId: number,
    data: { status?: 'not_started' | 'in_progress' | 'completed'; progress_percentage?: number }
  ) => Promise<void>;
  submitQuiz: (
    quizId: number,
    answers: Record<string, number | boolean>
  ) => Promise<{ score: number; passed: boolean }>;
  loading: boolean;
  error: Error | null;
}

export function useProgressActions(onSuccess?: () => void): ProgressActions {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateLessonProgress = async (
    lessonId: number,
    data: { status?: 'not_started' | 'in_progress' | 'completed'; progress_percentage?: number }
  ) => {
    try {
      setLoading(true);
      setError(null);
      await studentApi.progress.updateLesson(lessonId, data);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update progress'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async (quizId: number, answers: Record<string, number | boolean>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentApi.progress.submitQuiz(quizId, answers);
      onSuccess?.();
      return { score: result.data.score, passed: result.data.passed };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to submit quiz'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateLessonProgress, submitQuiz, loading, error };
}

// ============================================================================
// RE-EXPORT TYPES
// ============================================================================
export type {
  Course,
  Lesson,
  Enrollment,
  UserProgress,
  StudentDashboardData,
} from '@/lib/student-api';
