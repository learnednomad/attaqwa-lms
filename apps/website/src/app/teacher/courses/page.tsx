'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  BookOpen, Users, Clock, Calendar, Search,
  Plus, MoreVertical, Play, Edit, Eye, Loader2,
  AlertCircle, CheckCircle, FileText, BarChart3, Trash2
} from 'lucide-react';
import { teacherApi } from '@/lib/teacher-api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CourseData {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  subject: string;
  difficulty: string;
  ageTier: string;
  students: number;
  lessons: number;
  duration: string;
  progress: number;
  status: 'active' | 'draft' | 'archived';
  nextClass?: string;
  thumbnail?: string;
}

export default function TeacherCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await teacherApi.courses.getMyCourses();
        const apiCourses: CourseData[] = (result.data || []).map((course: any) => ({
          id: course.id,
          documentId: course.documentId,
          title: course.title,
          slug: course.slug,
          description: course.description || '',
          subject: course.subject || 'General',
          difficulty: course.difficulty || 'Beginner',
          ageTier: course.age_tier || 'Adults',
          students: course.current_enrollments || 0,
          lessons: course.lessons?.length || 0,
          duration: `${course.duration_weeks || 0} weeks`,
          progress: 0,
          status: (course.publishedAt ? 'active' : 'draft') as 'active' | 'draft' | 'archived',
          thumbnail: course.thumbnail?.url,
        }));
        setCourses(apiCourses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || course.status === filter;
    return matchesSearch && matchesFilter;
  });

  const activeCourses = courses.filter(c => c.status === 'active').length;
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons, 0);

  if (loading) {
    return (
      <TeacherLayout title="My Courses" subtitle="Manage your course content and students">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout title="My Courses" subtitle="Manage your course content and students">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load courses</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </Card>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="My Courses" subtitle="Manage your course content and students">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                <p className="text-sm text-gray-500">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Play className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeCourses}</p>
                <p className="text-sm text-gray-500">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                <p className="text-sm text-gray-500">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
                <p className="text-sm text-gray-500">Total Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              className="pl-9 w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'active', 'draft', 'archived'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                className={filter === status ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <Link href="/teacher/courses/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              const id = course.documentId || course.id;
              router.push(`/teacher/courses/${id}`);
            }}
          >
            {/* Course Header/Thumbnail */}
            <div className={`h-32 flex items-center justify-center ${
              course.subject === 'Fiqh' ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' :
              course.subject === 'Hadith' ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
              course.subject === 'Arabic' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' :
              course.subject === 'Tajweed' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
              course.subject === 'Quran' ? 'bg-gradient-to-br from-teal-500 to-teal-700' :
              course.subject === 'Seerah' ? 'bg-gradient-to-br from-rose-500 to-rose-700' :
              course.subject === 'Aqeedah' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
              course.subject === 'Akhlaq' ? 'bg-gradient-to-br from-cyan-500 to-cyan-700' :
              'bg-gradient-to-br from-gray-500 to-gray-700'
            }`}>
              <BookOpen className="h-12 w-12 text-white/80" />
            </div>

            <CardContent className="p-4">
              {/* Title and Status */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.subject} | {course.difficulty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={course.status === 'active' ? 'default' : 'secondary'} className={
                    course.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                    course.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                  }>
                    {course.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/teacher/courses/${course.documentId || course.id}`);
                      }}>
                        <Eye className="h-4 w-4 mr-2" /> View Course
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/teacher/courses/${course.documentId || course.id}/edit`);
                      }}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Content
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/teacher/courses/${course.documentId || course.id}/students`);
                      }}>
                        <Users className="h-4 w-4 mr-2" /> Manage Students
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/teacher/courses/${course.documentId || course.id}/analytics`);
                      }}>
                        <BarChart3 className="h-4 w-4 mr-2" /> Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Add delete confirmation dialog
                          console.log('Delete course:', course.documentId || course.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {course.students}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" /> {course.lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {course.duration}
                </span>
              </div>

              {/* Progress (only for active courses) */}
              {course.status === 'active' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-700">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}

              {/* Next Class */}
              {course.nextClass && (
                <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg p-2">
                  <Calendar className="h-4 w-4" />
                  <span>Next: {course.nextClass}</span>
                </div>
              )}

              {/* Draft Actions */}
              {course.status === 'draft' && (
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/teacher/courses/${course.documentId || course.id}/edit`);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement publish functionality
                      console.log('Publish course:', course.documentId || course.id);
                    }}
                  >
                    <Play className="h-4 w-4 mr-1" /> Publish
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search query' : 'Create your first course to get started'}
          </p>
          <Link href="/teacher/courses/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </Link>
        </Card>
      )}
    </TeacherLayout>
  );
}
