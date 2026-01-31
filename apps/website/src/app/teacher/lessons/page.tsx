'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText, Search, Plus, MoreVertical, Edit, Eye, Trash2,
  Clock, BookOpen, Video, FileQuestion, GripVertical, Loader2, AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { teacherApi } from '@/lib/teacher-api';

interface LessonData {
  id: number;
  documentId: string;
  title: string;
  course: string;
  courseDocumentId: string;
  order: number;
  duration: string;
  type: 'reading' | 'video' | 'quiz' | 'interactive';
  status: 'published' | 'draft';
}

export default function TeacherLessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await teacherApi.lessons.getAllLessons();
        const apiLessons: LessonData[] = (result.data || []).map((lesson: any) => ({
          id: lesson.id,
          documentId: lesson.documentId,
          title: lesson.title,
          course: lesson.course?.title || 'Unassigned',
          courseDocumentId: lesson.course?.documentId || '',
          order: lesson.lesson_order || 0,
          duration: lesson.duration_minutes ? `${lesson.duration_minutes} min` : 'N/A',
          type: lesson.lesson_type || 'reading',
          status: lesson.publishedAt ? 'published' : 'draft',
        }));
        setLessons(apiLessons);
      } catch (err) {
        console.error('Failed to fetch lessons:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lessons');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || lesson.course === courseFilter;
    const matchesType = typeFilter === 'all' || lesson.type === typeFilter;
    return matchesSearch && matchesCourse && matchesType;
  });

  const uniqueCourses = [...new Set(lessons.map(l => l.course))].sort();
  const uniqueTypes = [...new Set(lessons.map(l => l.type))].sort();

  const publishedCount = lessons.filter(l => l.status === 'published').length;
  const draftCount = lessons.filter(l => l.status === 'draft').length;
  const videoCount = lessons.filter(l => l.type === 'video').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-purple-500" />;
      case 'quiz': return <FileQuestion className="h-4 w-4 text-amber-500" />;
      case 'interactive': return <BookOpen className="h-4 w-4 text-emerald-500" />;
      default: return <FileText className="h-4 w-4 text-indigo-500" />;
    }
  };

  if (loading) {
    return (
      <TeacherLayout title="Lesson Content" subtitle="Create and manage your lesson materials">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout title="Lesson Content" subtitle="Create and manage your lesson materials">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load lessons</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </Card>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Lesson Content" subtitle="Create and manage your lesson materials">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
                <p className="text-sm text-gray-500">Total Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
                <p className="text-sm text-gray-500">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
                <p className="text-sm text-gray-500">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{videoCount}</p>
                <p className="text-sm text-gray-500">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search lessons..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {uniqueCourses.map(course => (
                <SelectItem key={course} value={course}>{course}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Link href="/teacher/lessons/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" /> Create Lesson
          </Button>
        </Link>
      </div>

      {/* Lessons List */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-1">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/teacher/lessons/${lesson.documentId}`)}
              >
                <GripVertical className="h-5 w-5 text-gray-300 cursor-grab" />
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getTypeIcon(lesson.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                    <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'} className={
                      lesson.status === 'published' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''
                    }>
                      {lesson.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{lesson.course}</span>
                    <span>Lesson {lesson.order}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {lesson.duration}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/teacher/lessons/${lesson.documentId}`)}>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/teacher/lessons/${lesson.documentId}/edit`)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Add delete confirmation dialog
                      console.log('Delete lesson:', lesson.documentId);
                    }}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || courseFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first lesson to get started'}
              </p>
              <Link href="/teacher/lessons/new">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" /> Create Lesson
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </TeacherLayout>
  );
}
