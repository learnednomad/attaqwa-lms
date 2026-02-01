'use client';

import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users, Search, Filter, MoreVertical, Mail, MessageSquare,
  TrendingUp, TrendingDown, Minus, Loader2, AlertCircle, CheckCircle,
  BookOpen, Clock, Award, ChevronDown
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

interface StudentData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  course: string;
  courseId: number;
  enrolledDate: string;
  progress: number;
  quizAverage: number;
  lastActive: string;
  status: 'active' | 'at-risk' | 'inactive';
  lessonsCompleted: number;
  totalLessons: number;
  trend: 'up' | 'down' | 'stable';
}

const mockStudents: StudentData[] = [
  {
    id: 1, name: 'Ahmad Hassan', email: 'ahmad.hassan@email.com',
    course: 'Fiqh of Worship', courseId: 1, enrolledDate: '2024-09-01',
    progress: 85, quizAverage: 92, lastActive: '2 hours ago',
    status: 'active', lessonsCompleted: 25, totalLessons: 30, trend: 'up'
  },
  {
    id: 2, name: 'Fatima Ali', email: 'fatima.ali@email.com',
    course: 'Fiqh of Worship', courseId: 1, enrolledDate: '2024-09-01',
    progress: 45, quizAverage: 58, lastActive: '1 day ago',
    status: 'at-risk', lessonsCompleted: 14, totalLessons: 30, trend: 'down'
  },
  {
    id: 3, name: 'Omar Ibrahim', email: 'omar.ibrahim@email.com',
    course: 'Hadith Studies - 40 Nawawi', courseId: 2, enrolledDate: '2024-09-15',
    progress: 70, quizAverage: 78, lastActive: '5 hours ago',
    status: 'active', lessonsCompleted: 29, totalLessons: 42, trend: 'stable'
  },
  {
    id: 4, name: 'Aisha Mohamed', email: 'aisha.mohamed@email.com',
    course: 'Arabic Grammar Level 2', courseId: 3, enrolledDate: '2024-10-01',
    progress: 90, quizAverage: 95, lastActive: '1 hour ago',
    status: 'active', lessonsCompleted: 22, totalLessons: 24, trend: 'up'
  },
  {
    id: 5, name: 'Yusuf Khan', email: 'yusuf.khan@email.com',
    course: 'Fiqh of Worship', courseId: 1, enrolledDate: '2024-09-01',
    progress: 20, quizAverage: 0, lastActive: '2 weeks ago',
    status: 'inactive', lessonsCompleted: 6, totalLessons: 30, trend: 'down'
  },
  {
    id: 6, name: 'Maryam Zahra', email: 'maryam.zahra@email.com',
    course: 'Hadith Studies - 40 Nawawi', courseId: 2, enrolledDate: '2024-09-15',
    progress: 55, quizAverage: 72, lastActive: '3 days ago',
    status: 'at-risk', lessonsCompleted: 23, totalLessons: 42, trend: 'down'
  },
  {
    id: 7, name: 'Ibrahim Ahmed', email: 'ibrahim.ahmed@email.com',
    course: 'Arabic Grammar Level 2', courseId: 3, enrolledDate: '2024-10-01',
    progress: 75, quizAverage: 82, lastActive: '4 hours ago',
    status: 'active', lessonsCompleted: 18, totalLessons: 24, trend: 'up'
  },
  {
    id: 8, name: 'Sara Hassan', email: 'sara.hassan@email.com',
    course: 'Fiqh of Worship', courseId: 1, enrolledDate: '2024-09-01',
    progress: 65, quizAverage: 75, lastActive: '6 hours ago',
    status: 'active', lessonsCompleted: 20, totalLessons: 30, trend: 'stable'
  },
];

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Load mock data in development
    setStudents(mockStudents);
    setLoading(false);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const uniqueCourses = [...new Set(students.map(s => s.course))];
  const activeStudents = students.filter(s => s.status === 'active').length;
  const atRiskStudents = students.filter(s => s.status === 'at-risk').length;
  const avgProgress = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
    : 0;

  if (loading) {
    return (
      <TeacherLayout title="Student Roster" subtitle="Manage and monitor your students">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Student Roster" subtitle="Manage and monitor your students">
      {/* Data Source Badge */}
      <div className="mb-4">
        {dataSource === 'api' ? (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Live Data from Strapi
          </Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Demo Mode (Mock Data)
          </Badge>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                <p className="text-sm text-gray-500">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{atRiskStudents}</p>
                <p className="text-sm text-gray-500">At Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
                <p className="text-sm text-gray-500">Avg Progress</p>
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
              placeholder="Search students..."
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Student</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Course</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Progress</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Quiz Avg</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Last Active</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{student.course}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 w-32">
                        <Progress value={student.progress} className="h-2 flex-1" />
                        <span className="text-sm text-gray-700 w-10">{student.progress}%</span>
                        {student.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                        {student.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                        {student.trend === 'stable' && <Minus className="h-4 w-4 text-gray-400" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        student.quizAverage >= 80 ? 'text-emerald-600' :
                        student.quizAverage >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {student.quizAverage > 0 ? `${student.quizAverage}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{student.lastActive}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={
                        student.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                        student.status === 'at-risk' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                        'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }>
                        {student.status === 'at-risk' ? 'At Risk' :
                         student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Award className="h-4 w-4 mr-2" /> View Progress
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" /> Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </TeacherLayout>
  );
}
