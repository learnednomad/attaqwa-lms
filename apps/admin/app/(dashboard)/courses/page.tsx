/**
 * Courses List Page
 * View and manage all courses
 */

'use client';

import { Edit, Eye, LayoutGrid, List, Loader2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { CourseCard, type CourseCardData } from '@/components/courses/course-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils/cn';
import { formatCategoryLabel, formatDate, formatDuration } from '@/lib/utils/formatters';

import { strapiClient, adminApiEndpoints } from '@/lib/api/strapi-client';

interface StrapiCourse {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  subject: string;
  difficulty: string;
  age_tier: string;
  duration_weeks: number;
  schedule: string;
  instructor: string;
  is_featured: boolean;
  max_students: number | null;
  current_enrollments: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lessons?: { id: number; lesson_type?: string | null; duration_minutes?: number | null; updatedAt?: string | null }[];
  thumbnail?: CourseCardData['thumbnail'];
}

type ViewMode = 'grid' | 'table';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [courses, setCourses] = useState<StrapiCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('grid');

  // Persist view preference per-user
  useEffect(() => {
    try {
      const stored = localStorage.getItem('courses-view-mode');
      if (stored === 'grid' || stored === 'table') setView(stored);
    } catch {
      // ignore
    }
  }, []);
  const changeView = (next: ViewMode) => {
    setView(next);
    try {
      localStorage.setItem('courses-view-mode', next);
    } catch {
      // ignore
    }
  };

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        'pagination[pageSize]': '100',
        'sort': 'createdAt:desc',
        'populate[lessons][fields][0]': 'lesson_type',
        'populate[lessons][fields][1]': 'duration_minutes',
        'populate[lessons][fields][2]': 'updatedAt',
        'populate[thumbnail]': 'true',
      });

      if (selectedCategory !== 'all') {
        params.set('filters[subject][$eq]', selectedCategory);
      }
      if (selectedDifficulty !== 'all') {
        params.set('filters[difficulty][$eq]', selectedDifficulty);
      }
      if (searchQuery) {
        params.set('filters[title][$containsi]', searchQuery);
      }

      // Fetch both published and draft - admin sees all
      params.set('publicationState', 'preview');

      const { data } = await strapiClient.get<StrapiCourse[]>(
        `${adminApiEndpoints.courses}?${params}`
      );
      setCourses((data as any)?.data || data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  useEffect(() => {
    const timer = setTimeout(fetchCourses, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchCourses]);

  const deleteCourse = async (course: StrapiCourse) => {
    if (!confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    try {
      const identifier = course.documentId || course.id;
      await strapiClient.delete(`${adminApiEndpoints.courses}/${identifier}`);
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'All Subjects' },
    { value: 'quran', label: 'Quran' },
    { value: 'hadith', label: 'Hadith' },
    { value: 'fiqh', label: 'Fiqh' },
    { value: 'seerah', label: 'Seerah' },
    { value: 'aqeedah', label: 'Aqeedah' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'akhlaq', label: 'Akhlaq' },
    { value: 'tajweed', label: 'Tajweed' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const getDifficultyBadge = (difficulty: string) => {
    const variants = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger',
    };
    return variants[difficulty as keyof typeof variants] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Courses</h1>
          <p className="mt-2 text-charcoal-600">
            Manage your courses and learning content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Toggle view"
            className="inline-flex overflow-hidden rounded-lg border border-charcoal-300 bg-white"
          >
            <button
              type="button"
              onClick={() => changeView('grid')}
              aria-pressed={view === 'grid'}
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors',
                view === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'text-charcoal-600 hover:bg-charcoal-50'
              )}
              title="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => changeView('table')}
              aria-pressed={view === 'table'}
              className={cn(
                'inline-flex items-center gap-1 border-l border-charcoal-200 px-2.5 py-1.5 text-xs font-medium transition-colors',
                view === 'table'
                  ? 'bg-primary-600 text-white'
                  : 'text-charcoal-600 hover:bg-charcoal-50'
              )}
              title="Table view"
            >
              <List className="h-3.5 w-3.5" />
              Table
            </button>
          </div>
          <Button variant="outline" onClick={fetchCourses}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/courses/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-charcoal-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {difficulties.map((diff) => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Content */}
      {view === 'grid' ? (
        isLoading ? (
          <div className="flex items-center justify-center rounded-lg border border-charcoal-200 bg-white py-16">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary-500" />
            <span className="text-charcoal-500">Loading courses...</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-charcoal-200 bg-white py-16 text-center">
            <p className="text-sm font-medium text-charcoal-800">No courses found</p>
            <p className="mt-1 text-xs text-charcoal-500">
              Create your first course to get started with the virtual library.
            </p>
            <Link href="/courses/new">
              <Button className="mt-4" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course as unknown as CourseCardData}
                onDelete={() => deleteCourse(course)}
              />
            ))}
          </div>
        )
      ) : (
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500 mr-2" />
            <span className="text-charcoal-500">Loading courses...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Age Tier</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Lessons</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => {
                const identifier = course.documentId || course.id;
                const isPublished = !!course.publishedAt;
                const lessonCount = course.lessons?.length || 0;

                return (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-charcoal-900">
                          {course.title}
                        </p>
                        <p className="text-xs text-charcoal-500 truncate max-w-[200px]">
                          {course.instructor}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">
                        {formatCategoryLabel(course.subject)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getDifficultyBadge(course.difficulty) as any}>
                        {formatCategoryLabel(course.difficulty)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-charcoal-600 capitalize">
                      {course.age_tier}
                    </TableCell>
                    <TableCell className="text-charcoal-600">
                      {course.current_enrollments || 0}
                    </TableCell>
                    <TableCell className="text-charcoal-600">
                      {lessonCount}
                    </TableCell>
                    <TableCell className="text-charcoal-600">
                      {course.duration_weeks ? `${course.duration_weeks}w` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isPublished ? 'success' : 'default'}>
                        {isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-charcoal-600">
                      {formatDate(course.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/courses/${identifier}/lessons`}>
                          <button
                            className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
                            aria-label="View lessons"
                            title="View lessons"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/courses/${identifier}/settings`}>
                          <button
                            className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
                            aria-label="Edit course settings"
                            title="Edit course settings"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          aria-label="Delete course"
                          title="Delete course"
                          onClick={() => deleteCourse(course)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {!isLoading && courses.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-charcoal-500 mb-2">No courses found</p>
            <p className="text-sm text-charcoal-400">
              Create your first course to get started with the virtual library.
            </p>
          </div>
        )}
      </Card>
      )}
    </div>
  );
}
