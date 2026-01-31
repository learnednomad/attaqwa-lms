'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, Loader2, AlertCircle, Search, Users,
  Download, Mail, TrendingUp, Clock, CheckCircle,
  AlertTriangle, User
} from 'lucide-react';
import { teacherApi, StudentEnrollment, TeacherCourse } from '@/lib/teacher-api';

interface EnrollmentWithProgress {
  id: number;
  documentId: string;
  student?: {
    id?: number;
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  progress?: number;
  overall_progress?: number;
}

interface CourseWithEnrollments {
  id: number;
  documentId: string;
  title: string;
  subject: string;
  enrollments?: EnrollmentWithProgress[];
}

export default function CourseStudentsPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseWithEnrollments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [progressFilter, setProgressFilter] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');

  useEffect(() => {
    const fetchCourseWithStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await teacherApi.courses.getCourseDetails(courseId);
        setCourse(result.data as unknown as CourseWithEnrollments);
      } catch (err) {
        console.error('Failed to fetch course students:', err);
        setError(err instanceof Error ? err.message : 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseWithStudents();
    }
  }, [courseId]);

  const enrollments = course?.enrollments || [];

  // Filter enrollments
  const filteredEnrollments = enrollments.filter(enrollment => {
    // Search filter
    const studentName = enrollment.student?.first_name
      ? `${enrollment.student.first_name} ${enrollment.student.last_name || ''}`
      : enrollment.student?.username || '';
    const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.student?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    // Progress filter
    const progress = enrollment.progress ?? enrollment.overall_progress ?? 0;
    let matchesProgress = true;
    if (progressFilter === 'completed') {
      matchesProgress = progress === 100;
    } else if (progressFilter === 'in-progress') {
      matchesProgress = progress > 0 && progress < 100;
    } else if (progressFilter === 'not-started') {
      matchesProgress = progress === 0;
    }

    return matchesSearch && matchesProgress;
  });

  // Calculate stats
  const totalStudents = enrollments.length;
  const completedCount = enrollments.filter(e => (e.progress || 0) === 100).length;
  const inProgressCount = enrollments.filter(e => {
    const p = e.progress || 0;
    return p > 0 && p < 100;
  }).length;
  const notStartedCount = enrollments.filter(e => (e.progress || 0) === 0).length;
  const averageProgress = totalStudents > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / totalStudents)
    : 0;

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'text-emerald-600';
    if (progress >= 50) return 'text-indigo-600';
    if (progress > 0) return 'text-amber-600';
    return 'text-gray-400';
  };

  const getProgressBadge = (progress: number) => {
    if (progress === 100) {
      return <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>;
    }
    if (progress >= 50) {
      return <Badge className="bg-indigo-100 text-indigo-700">On Track</Badge>;
    }
    if (progress > 0) {
      return <Badge className="bg-amber-100 text-amber-700">In Progress</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-600">Not Started</Badge>;
  };

  if (loading) {
    return (
      <TeacherLayout title="Manage Students" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </TeacherLayout>
    );
  }

  if (error || !course) {
    return (
      <TeacherLayout title="Manage Students" subtitle="Error loading students">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load students</h3>
          <p className="text-gray-500 mb-4">{error || 'Course not found'}</p>
          <Link href="/teacher/courses">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </Card>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout
      title="Manage Students"
      subtitle={`${course.title} - ${totalStudents} enrolled`}
    >
      {/* Back Button */}
      <div className="mb-4">
        <Link href={`/teacher/courses/${courseId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600" />
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
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                <p className="text-sm text-gray-500">Completed</p>
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
                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{notStartedCount}</p>
                <p className="text-sm text-gray-500">Not Started</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageProgress}%</p>
                <p className="text-sm text-gray-500">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Progress Filter */}
              <Select
                value={progressFilter}
                onValueChange={(v) => setProgressFilter(v as typeof progressFilter)}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by progress" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email All
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students ({filteredEnrollments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEnrollments.length > 0 ? (
            <div className="space-y-4">
              {filteredEnrollments.map((enrollment) => {
                const progress = enrollment.progress ?? enrollment.overall_progress ?? 0;
                const studentName = enrollment.student?.first_name
                  ? `${enrollment.student.first_name} ${enrollment.student.last_name || ''}`
                  : enrollment.student?.username || 'Unknown Student';

                return (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{studentName}</p>
                        <p className="text-sm text-gray-500">{enrollment.student?.email}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-6">
                      <div className="w-48">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-500">Progress</span>
                          <span className={`text-sm font-medium ${getProgressColor(progress)}`}>
                            {progress}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      {getProgressBadge(progress)}

                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery || progressFilter !== 'all'
                  ? 'No students match your filters'
                  : 'No students enrolled in this course yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TeacherLayout>
  );
}
