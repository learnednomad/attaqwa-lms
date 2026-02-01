/**
 * React Query hooks for Strapi LMS API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  coursesApi,
  lessonsApi,
  quizzesApi,
  enrollmentsApi,
  lessonProgressApi,
  type Course,
  type Lesson,
  type Quiz,
  type Enrollment,
  type LessonProgress,
  type StrapiResponse,
} from '@/lib/strapi-api';

// ============================================================================
// Query Keys
// ============================================================================

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters?: any) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (slug: string) => [...courseKeys.details(), slug] as const,
  detailById: (id: string) => [...courseKeys.details(), 'id', id] as const,
};

export const lessonKeys = {
  all: ['lessons'] as const,
  lists: () => [...lessonKeys.all, 'list'] as const,
  list: (courseSlug: string) => [...lessonKeys.lists(), courseSlug] as const,
  details: () => [...lessonKeys.all, 'detail'] as const,
  detail: (slug: string) => [...lessonKeys.details(), slug] as const,
  detailById: (id: string) => [...lessonKeys.details(), 'id', id] as const,
};

export const quizKeys = {
  all: ['quizzes'] as const,
  details: () => [...quizKeys.all, 'detail'] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  byLesson: (lessonSlug: string) => [...quizKeys.all, 'lesson', lessonSlug] as const,
};

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  my: (userId: string) => [...enrollmentKeys.all, 'my', userId] as const,
  byCourse: (userId: string, courseSlug: string) =>
    [...enrollmentKeys.all, 'course', userId, courseSlug] as const,
};

export const progressKeys = {
  all: ['lesson-progress'] as const,
  detail: (enrollmentId: string, lessonId: string) =>
    [...progressKeys.all, enrollmentId, lessonId] as const,
};

// ============================================================================
// Course Hooks
// ============================================================================

export interface CoursesFilters {
  subject?: string;
  age_tier?: string;
  difficulty?: string; // Changed from difficulty_level to match Strapi
  search?: string;
}

/**
 * Fetch all courses with optional filtering
 */
export function useCourses(filters?: CoursesFilters) {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: () => coursesApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single course by slug
 */
export function useCourse(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: courseKeys.detail(slug),
    queryFn: () => coursesApi.getBySlug(slug),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch course by ID
 */
export function useCourseById(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: courseKeys.detailById(id),
    queryFn: () => coursesApi.getById(id),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch course with full details (lessons + quizzes)
 */
export function useCourseWithDetails(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...courseKeys.detail(slug), 'full'] as const,
    queryFn: () => coursesApi.getWithDetails(slug),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Lesson Hooks
// ============================================================================

/**
 * Fetch all lessons for a course
 */
export function useLessonsByCourse(courseSlug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: lessonKeys.list(courseSlug),
    queryFn: () => lessonsApi.getByCourse(courseSlug),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch single lesson by slug
 */
export function useLesson(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: lessonKeys.detail(slug),
    queryFn: () => lessonsApi.getBySlug(slug),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch lesson by ID
 */
export function useLessonById(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: lessonKeys.detailById(id),
    queryFn: () => lessonsApi.getById(id),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Quiz Hooks
// ============================================================================

/**
 * Fetch quiz by ID
 */
export function useQuiz(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: () => quizzesApi.getById(id),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch quiz for a lesson
 */
export function useQuizByLesson(lessonSlug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: quizKeys.byLesson(lessonSlug),
    queryFn: () => quizzesApi.getByLesson(lessonSlug),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Enrollment Hooks
// ============================================================================

/**
 * Fetch user's enrollments
 */
export function useMyEnrollments(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: enrollmentKeys.my(userId),
    queryFn: () => enrollmentsApi.getMy(userId),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch enrollment for specific course
 */
export function useEnrollmentByCourse(
  userId: string,
  courseSlug: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: enrollmentKeys.byCourse(userId, courseSlug),
    queryFn: () => enrollmentsApi.getByCourse(userId, courseSlug),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Create new enrollment mutation
 */
export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, courseId }: { userId: string; courseId: string }) =>
      enrollmentsApi.create(userId, courseId),
    onSuccess: (data, variables) => {
      // Invalidate enrollments queries
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.my(variables.userId) });
    },
  });
}

// ============================================================================
// Lesson Progress Hooks
// ============================================================================

/**
 * Fetch progress for specific lesson
 */
export function useLessonProgress(
  enrollmentId: string,
  lessonId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: progressKeys.detail(enrollmentId, lessonId),
    queryFn: () => lessonProgressApi.getByLesson(enrollmentId, lessonId),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Update lesson progress mutation
 */
export function useUpdateLessonProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      progressId,
      updates,
    }: {
      progressId: string;
      updates: Partial<{
        completed: boolean;
        time_spent_minutes: number;
        quiz_score: number;
        quiz_attempts: number;
      }>;
    }) => lessonProgressApi.update(progressId, updates),
    onSuccess: (data, variables) => {
      // Invalidate progress queries
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      // Invalidate enrollments to update overall progress
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
    },
  });
}

/**
 * Create lesson progress mutation
 */
export function useCreateLessonProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId, lessonId }: { enrollmentId: string; lessonId: string }) =>
      lessonProgressApi.create(enrollmentId, lessonId),
    onSuccess: () => {
      // Invalidate progress queries
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
    },
  });
}

// ============================================================================
// Helper Hooks
// ============================================================================

/**
 * Check if user is enrolled in a course
 */
export function useIsEnrolled(userId: string | undefined, courseSlug: string | undefined) {
  const { data: enrollment, isLoading } = useEnrollmentByCourse(
    userId || '',
    courseSlug || '',
    !!userId && !!courseSlug
  );

  return {
    isEnrolled: !!enrollment,
    enrollment: enrollment || null,
    isLoading,
  };
}

/**
 * Get course progress percentage
 */
export function useCourseProgress(userId: string | undefined, courseSlug: string | undefined) {
  const { enrollment, isEnrolled, isLoading } = useIsEnrolled(userId, courseSlug);

  return {
    progress: enrollment?.progress_percentage || 0,
    isEnrolled,
    isLoading,
  };
}
