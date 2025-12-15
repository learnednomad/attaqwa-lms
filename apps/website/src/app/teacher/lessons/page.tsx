'use client';

import React, { useState } from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText, Search, Plus, MoreVertical, Edit, Eye, Trash2,
  Clock, BookOpen, Video, FileQuestion, GripVertical
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

interface LessonData {
  id: number;
  title: string;
  course: string;
  courseId: number;
  order: number;
  duration: string;
  type: 'text' | 'video' | 'quiz';
  status: 'published' | 'draft';
  views: number;
  completions: number;
}

const mockLessons: LessonData[] = [
  { id: 1, title: 'Introduction to Fiqh and Taharah', course: 'Fiqh of Worship', courseId: 1, order: 1, duration: '35 min', type: 'text', status: 'published', views: 156, completions: 142 },
  { id: 2, title: 'Wudu - Obligatory Acts', course: 'Fiqh of Worship', courseId: 1, order: 2, duration: '40 min', type: 'video', status: 'published', views: 148, completions: 135 },
  { id: 3, title: 'Taharah Quiz 1', course: 'Fiqh of Worship', courseId: 1, order: 3, duration: '15 min', type: 'quiz', status: 'published', views: 145, completions: 140 },
  { id: 4, title: 'Hadith #1 - Actions by Intentions', course: 'Hadith Studies', courseId: 2, order: 1, duration: '45 min', type: 'text', status: 'published', views: 98, completions: 85 },
  { id: 5, title: 'Hadith #2 - Islam, Iman, Ihsan', course: 'Hadith Studies', courseId: 2, order: 2, duration: '50 min', type: 'video', status: 'published', views: 92, completions: 78 },
  { id: 6, title: 'Arabic Letters - Introduction', course: 'Arabic Grammar Level 2', courseId: 3, order: 1, duration: '30 min', type: 'text', status: 'draft', views: 0, completions: 0 },
];

export default function TeacherLessonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredLessons = mockLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || lesson.course === courseFilter;
    const matchesType = typeFilter === 'all' || lesson.type === typeFilter;
    return matchesSearch && matchesCourse && matchesType;
  });

  const uniqueCourses = [...new Set(mockLessons.map(l => l.course))];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-purple-500" />;
      case 'quiz': return <FileQuestion className="h-4 w-4 text-amber-500" />;
      default: return <FileText className="h-4 w-4 text-indigo-500" />;
    }
  };

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
                <p className="text-2xl font-bold text-gray-900">{mockLessons.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {mockLessons.filter(l => l.status === 'published').length}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {mockLessons.filter(l => l.status === 'draft').length}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {mockLessons.filter(l => l.type === 'video').length}
                </p>
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
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" /> Create Lesson
        </Button>
      </div>

      {/* Lessons List */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-1">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
                    {lesson.status === 'published' && (
                      <>
                        <span>{lesson.views} views</span>
                        <span>{lesson.completions} completions</span>
                      </>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
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
              <p className="text-gray-500 mb-4">Create your first lesson to get started</p>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" /> Create Lesson
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TeacherLayout>
  );
}
