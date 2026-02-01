'use client';

import React, { useState } from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ClipboardList, Search, Plus, MoreVertical, Edit, Eye, Trash2,
  Clock, Calendar, Users, CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AssignmentData {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: 'active' | 'closed' | 'draft';
  totalSubmissions: number;
  totalStudents: number;
  graded: number;
}

const mockAssignments: AssignmentData[] = [
  { id: 1, title: 'Wudu Practice Report', course: 'Fiqh of Worship', dueDate: 'Dec 15, 2024', status: 'active', totalSubmissions: 18, totalStudents: 24, graded: 10 },
  { id: 2, title: 'Salah Steps Diagram', course: 'Fiqh of Worship', dueDate: 'Dec 20, 2024', status: 'active', totalSubmissions: 12, totalStudents: 24, graded: 5 },
  { id: 3, title: 'Hadith Analysis - Hadith #5', course: 'Hadith Studies', dueDate: 'Dec 18, 2024', status: 'active', totalSubmissions: 14, totalStudents: 18, graded: 8 },
  { id: 4, title: 'Arabic Grammar Exercise 5', course: 'Arabic Grammar Level 2', dueDate: 'Dec 10, 2024', status: 'closed', totalSubmissions: 15, totalStudents: 15, graded: 15 },
  { id: 5, title: 'Hadith Memorization Recording', course: 'Hadith Studies', dueDate: 'Dec 25, 2024', status: 'draft', totalSubmissions: 0, totalStudents: 18, graded: 0 },
];

export default function TeacherAssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || assignment.course === courseFilter;
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const uniqueCourses = [...new Set(mockAssignments.map(a => a.course))];
  const pendingGrading = mockAssignments.reduce((sum, a) => sum + (a.totalSubmissions - a.graded), 0);

  return (
    <TeacherLayout title="Assignments" subtitle="Create and manage course assignments">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockAssignments.length}</p>
                <p className="text-sm text-gray-500">Total Assignments</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {mockAssignments.filter(a => a.status === 'active').length}
                </p>
                <p className="text-sm text-gray-500">Active</p>
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
                <p className="text-2xl font-bold text-gray-900">{pendingGrading}</p>
                <p className="text-sm text-gray-500">Pending Grading</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {mockAssignments.reduce((sum, a) => sum + a.totalSubmissions, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Submissions</p>
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
              placeholder="Search assignments..."
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
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" /> Create Assignment
        </Button>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{assignment.title}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{assignment.course}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> View Submissions</DropdownMenuItem>
                    <DropdownMenuItem><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Due: {assignment.dueDate}</span>
                <Badge className={
                  assignment.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                  assignment.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                  'bg-amber-100 text-amber-700 hover:bg-amber-100'
                }>
                  {assignment.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Submissions</span>
                  <span className="font-medium">{assignment.totalSubmissions}/{assignment.totalStudents}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(assignment.totalSubmissions / assignment.totalStudents) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Graded</span>
                  <span className="font-medium">{assignment.graded}/{assignment.totalSubmissions}</span>
                </div>
              </div>

              {assignment.status === 'active' && assignment.totalSubmissions > assignment.graded && (
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Grade Submissions ({assignment.totalSubmissions - assignment.graded} pending)
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card className="p-8 text-center">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-500 mb-4">Create your first assignment to get started</p>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" /> Create Assignment
          </Button>
        </Card>
      )}
    </TeacherLayout>
  );
}
