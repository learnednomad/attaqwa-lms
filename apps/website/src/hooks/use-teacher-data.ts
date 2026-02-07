/**
 * Teacher Portal React Hooks
 * Custom hooks for teacher data fetching and mutations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  teacherApi,
  TeacherDashboardData,
  TeacherCourse,
  StudentEnrollment,
  AssignmentSubmission,
} from '@/lib/teacher-api';
import { Course, Lesson, UserProgress } from '@/lib/student-api';

// Generic state interface for data hooks
interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// TEACHER DASHBOARD HOOK
// ============================================================================
export function useTeacherDashboard(): UseDataState<TeacherDashboardData> {
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.dashboard.getData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard'));
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
// TEACHER COURSES HOOKS
// ============================================================================
export function useTeacherCourses(): UseDataState<TeacherCourse[]> {
  const [data, setData] = useState<TeacherCourse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.courses.getMyCourses();
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch courses'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useTeacherCourse(courseId: string): UseDataState<TeacherCourse & { enrollments: StudentEnrollment[] }> {
  const [data, setData] = useState<(TeacherCourse & { enrollments: StudentEnrollment[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.courses.getCourseDetails(courseId);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch course'));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// TEACHER STUDENTS HOOKS
// ============================================================================
export function useTeacherStudents(courseId?: string): UseDataState<StudentEnrollment[]> {
  const [data, setData] = useState<StudentEnrollment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.students.getMyStudents(courseId);
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch students'));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useStudentProgress(studentId: string, courseId?: string): UseDataState<UserProgress[]> {
  const [data, setData] = useState<UserProgress[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.students.getStudentProgress(studentId, courseId);
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch student progress'));
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// TEACHER GRADES HOOKS
// ============================================================================
export function usePendingSubmissions(): UseDataState<AssignmentSubmission[]> {
  const [data, setData] = useState<AssignmentSubmission[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.grades.getPendingSubmissions();
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch submissions'));
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
// TEACHER LESSONS HOOKS
// ============================================================================
export function useCourseLessons(courseId: string): UseDataState<Lesson[]> {
  const [data, setData] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.lessons.getCourseLessons(courseId);
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch lessons'));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// TEACHER ACTIONS HOOKS
// ============================================================================
export function useTeacherCourseActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCourse = useCallback(async (courseId: string, data: Partial<Course>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.courses.updateCourse(courseId, data as Partial<import('../lib/teacher-api').CourseFormData>);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update course');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateCourse, loading, error };
}

export function useTeacherLessonActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createLesson = useCallback(async (data: Partial<Lesson>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.lessons.createLesson(data);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create lesson');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLesson = useCallback(async (lessonId: string, data: Partial<Lesson>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.lessons.updateLesson(lessonId, data);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update lesson');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createLesson, updateLesson, loading, error };
}

export function useGradingActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const gradeSubmission = useCallback(async (submissionId: string, grade: number, feedback?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.grades.gradeSubmission(submissionId, { grade, feedback });
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to grade submission');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudentGrade = useCallback(async (progressId: string, data: { quiz_score?: number; status?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherApi.grades.updateStudentGrade(progressId, data);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update grade');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { gradeSubmission, updateStudentGrade, loading, error };
}
