/**
 * Courses List Page
 * View and manage all courses
 */

'use client';

import { Edit, Eye, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
import { formatCategoryLabel, formatDate, formatDuration } from '@/lib/utils/formatters';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // TODO: Replace with real data from API
  const courses = [
    {
      id: '1',
      title: 'Quran Recitation Basics',
      category: 'quran',
      difficulty: 'beginner',
      students: 342,
      lessons: 12,
      duration: 180,
      isPublished: true,
      createdAt: '2025-01-15',
    },
    {
      id: '2',
      title: 'Hadith Studies - Introduction',
      category: 'hadith',
      difficulty: 'intermediate',
      students: 256,
      lessons: 18,
      duration: 240,
      isPublished: true,
      createdAt: '2025-01-10',
    },
    {
      id: '3',
      title: 'Islamic History & Seerah',
      category: 'seerah',
      difficulty: 'beginner',
      students: 198,
      lessons: 15,
      duration: 200,
      isPublished: true,
      createdAt: '2025-01-05',
    },
    {
      id: '4',
      title: 'Advanced Arabic Grammar',
      category: 'general',
      difficulty: 'advanced',
      students: 87,
      lessons: 24,
      duration: 360,
      isPublished: false,
      createdAt: '2025-01-01',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'quran', label: 'Quran' },
    { value: 'hadith', label: 'Hadith' },
    { value: 'fiqh', label: 'Fiqh' },
    { value: 'seerah', label: 'Seerah' },
    { value: 'aqeedah', label: 'Aqeedah' },
    { value: 'general', label: 'General' },
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
        <Link href="/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
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

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Lessons</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-charcoal-900">
                      {course.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="info">
                    {formatCategoryLabel(course.category)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getDifficultyBadge(course.difficulty) as any}>
                    {formatCategoryLabel(course.difficulty)}
                  </Badge>
                </TableCell>
                <TableCell className="text-charcoal-600">
                  {course.students}
                </TableCell>
                <TableCell className="text-charcoal-600">
                  {course.lessons}
                </TableCell>
                <TableCell className="text-charcoal-600">
                  {formatDuration(course.duration)}
                </TableCell>
                <TableCell>
                  <Badge variant={course.isPublished ? 'success' : 'default'}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-charcoal-600">
                  {formatDate(course.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/courses/${course.id}`}>
                      <button
                        className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
                        aria-label="View course"
                        title="View course details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </Link>
                    <Link href={`/courses/${course.id}`}>
                      <button
                        className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
                        aria-label="Edit course"
                        title="Edit course"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </Link>
                    <button
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      aria-label="Delete course"
                      title="Delete course"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this course?')) {
                          // TODO: Implement delete functionality
                          console.log('Delete course:', course.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {courses.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-charcoal-500">No courses found</p>
          </div>
        )}
      </Card>
    </div>
  );
}
