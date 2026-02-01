'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  studentApi,
  Course,
  Lesson,
  Enrollment,
  UserProgress,
  StudentDashboardData,
} from '@/lib/student-api';
import { CACHE_TTL } from '@attaqwa/shared';

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

export const studentKeys = {
  progress: {
    all: ['student', 'progress'] as const,
    list: (params?: { course_id?: string; status?: string }) =>
      [...studentKeys.progress.all, 'list', params] as const,
  },
  enrollments: {
    all: ['student', 'enrollments'] as const,
    list: (params?: { status?: string }) =>
      [...studentKeys.enrollments.all, 'list', params] as const,
  },
  courses: {
    all: ['student', 'courses'] as const,
    list: (params?: { age_tier?: string; subject?: string; difficulty?: string; featured?: boolean }) =>
      [...studentKeys.courses.all, 'list', params] as const,
    detail: (id: string) =>
      [...studentKeys.courses.all, 'detail', id] as const,
  },
  lessons: {
    all: ['student', 'lessons'] as const,
    list: (params?: { course_id?: string; is_free?: boolean }) =>
      [...studentKeys.lessons.all, 'list', params] as const,
    detail: (id: string) =>
      [...studentKeys.lessons.all, 'detail', id] as const,
  },
  dashboard: {
    all: ['student', 'dashboard'] as const,
  },
};

// ============================================================================
// ENROLLMENTS DATA TYPE
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

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useProgress(params?: {
  course_id?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
}) {
  return useQuery({
    queryKey: studentKeys.progress.list(params),
    queryFn: () => studentApi.progress.getMine(params),
    select: (res) => res.data,
    staleTime: CACHE_TTL.SHORT,
  });
}

export function useCourses(params?: {
  age_tier?: string;
  subject?: string;
  difficulty?: string;
  featured?: boolean;
}) {
  return useQuery({
    queryKey: studentKeys.courses.list(params),
    queryFn: () => studentApi.courses.getAll(params),
    select: (res) => res.data,
    staleTime: CACHE_TTL.SHORT,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: studentKeys.courses.detail(id),
    queryFn: () => studentApi.courses.getById(id),
    select: (res) => res.data,
    staleTime: CACHE_TTL.SHORT,
    enabled: !!id,
  });
}

export function useLessons(params?: {
  course_id?: string;
  is_free?: boolean;
}) {
  return useQuery({
    queryKey: studentKeys.lessons.list(params),
    queryFn: () => studentApi.lessons.getAll(params),
    select: (res) => res.data,
    staleTime: CACHE_TTL.SHORT,
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: studentKeys.lessons.detail(id),
    queryFn: () => studentApi.lessons.getById(id),
    select: (res) => res.data,
    staleTime: CACHE_TTL.SHORT,
    enabled: !!id,
  });
}

export function useEnrollments(params?: {
  status?: 'active' | 'completed' | 'dropped';
}) {
  return useQuery({
    queryKey: studentKeys.enrollments.list(params),
    queryFn: () => studentApi.enrollments.getMine(params),
    select: (res): EnrollmentsData => {
      const enrollments = res.data;
      const defaultSummary = {
        totalEnrollments: enrollments.length,
        active: enrollments.filter(e => e.enrollment_status === 'active').length,
        completed: enrollments.filter(e => e.enrollment_status === 'completed').length,
        certificatesEarned: enrollments.filter(e => e.certificate_issued).length,
      };
      return {
        enrollments,
        summary: (res.meta?.summary as EnrollmentsData['summary']) || defaultSummary,
      };
    },
    staleTime: CACHE_TTL.SHORT,
  });
}

export function useStudentDashboard() {
  return useQuery({
    queryKey: studentKeys.dashboard.all,
    queryFn: () => studentApi.dashboard.getData(),
    staleTime: CACHE_TTL.SHORT,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useUpdateLessonProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: number;
      data: { status?: 'not_started' | 'in_progress' | 'completed'; progress_percentage?: number };
    }) => studentApi.progress.updateLesson(lessonId, data),

    onMutate: async ({ lessonId, data }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: studentKeys.progress.all });

      // Snapshot the previous progress data across all cached queries
      const previousQueries = queryClient.getQueriesData<{ data: UserProgress[] }>({
        queryKey: studentKeys.progress.all,
      });

      // Optimistically update all cached progress lists
      queryClient.setQueriesData<{ data: UserProgress[] }>(
        { queryKey: studentKeys.progress.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((p) =>
              p.lesson?.id === lessonId
                ? { ...p, ...data }
                : p
            ),
          };
        }
      );

      return { previousQueries };
    },

    onError: (_err, _vars, context) => {
      // Rollback from snapshot on error
      if (context?.previousQueries) {
        for (const [queryKey, data] of context.previousQueries) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },

    onSettled: () => {
      // Invalidate all related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: studentKeys.progress.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.enrollments.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.dashboard.all });
    },
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      answers,
    }: {
      quizId: number;
      answers: Record<string, number | boolean>;
    }) => studentApi.progress.submitQuiz(quizId, answers),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.progress.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.enrollments.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.dashboard.all });
    },
  });
}

export function useEnrollInCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => studentApi.enrollments.enroll(courseId),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.enrollments.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.dashboard.all });
    },
  });
}

export function useDropCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: number) =>
      studentApi.enrollments.updateStatus(enrollmentId, 'dropped'),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.enrollments.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.dashboard.all });
    },
  });
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
