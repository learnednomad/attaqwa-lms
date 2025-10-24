/**
 * Students Management Page
 * View and manage all enrolled students
 */

'use client';

import { Award, BookOpen, Clock, Mail, MoreVertical, Search, TrendingUp, User } from 'lucide-react';
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
import { formatDate } from '@/lib/utils/formatters';

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // TODO: Replace with real data from API
  const students = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      avatar: null,
      enrolledCourses: 5,
      completedCourses: 2,
      averageProgress: 78,
      totalPoints: 2450,
      level: 12,
      currentStreak: 15,
      lastActive: '2025-01-15T14:30:00Z',
      status: 'active',
      joinedAt: '2024-06-15',
    },
    {
      id: '2',
      name: 'Fatima Ali',
      email: 'fatima.ali@example.com',
      avatar: null,
      enrolledCourses: 8,
      completedCourses: 5,
      averageProgress: 92,
      totalPoints: 4320,
      level: 18,
      currentStreak: 42,
      lastActive: '2025-01-15T10:15:00Z',
      status: 'active',
      joinedAt: '2024-03-20',
    },
    {
      id: '3',
      name: 'Omar Ibrahim',
      email: 'omar.ibrahim@example.com',
      avatar: null,
      enrolledCourses: 3,
      completedCourses: 1,
      averageProgress: 45,
      totalPoints: 980,
      level: 6,
      currentStreak: 3,
      lastActive: '2025-01-10T16:45:00Z',
      status: 'inactive',
      joinedAt: '2024-11-05',
    },
    {
      id: '4',
      name: 'Aisha Mohammed',
      email: 'aisha.mohammed@example.com',
      avatar: null,
      enrolledCourses: 6,
      completedCourses: 3,
      averageProgress: 85,
      totalPoints: 3210,
      level: 15,
      currentStreak: 28,
      lastActive: '2025-01-15T09:20:00Z',
      status: 'active',
      joinedAt: '2024-05-12',
    },
    {
      id: '5',
      name: 'Yusuf Ahmad',
      email: 'yusuf.ahmad@example.com',
      avatar: null,
      enrolledCourses: 4,
      completedCourses: 0,
      averageProgress: 23,
      totalPoints: 450,
      level: 3,
      currentStreak: 0,
      lastActive: '2024-12-28T11:30:00Z',
      status: 'inactive',
      joinedAt: '2024-12-01',
    },
  ];

  const statuses = [
    { value: 'all', label: 'All Students' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const courses = [
    { value: 'all', label: 'All Courses' },
    { value: 'quran', label: 'Quran Recitation Basics' },
    { value: 'hadith', label: 'Hadith Studies' },
    { value: 'seerah', label: 'Islamic History & Seerah' },
  ];

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Students</h1>
          <p className="mt-2 text-charcoal-600">
            Manage student enrollments and track progress
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Message Students
          </Button>
          <Button>
            <User className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Total Students</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">1,247</p>
              <div className="mt-2 flex items-center space-x-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+12% this month</span>
              </div>
            </div>
            <div className="rounded-lg bg-primary-100 p-3">
              <User className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Active Students</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">892</p>
              <div className="mt-2 flex items-center space-x-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+8% this week</span>
              </div>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Avg. Completion</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">67%</p>
              <div className="mt-2 flex items-center space-x-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+5% this month</span>
              </div>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Total Points</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">247K</p>
              <div className="mt-2 flex items-center space-x-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+18% this month</span>
              </div>
            </div>
            <div className="rounded-lg bg-amber-100 p-3">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-charcoal-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {courses.map((course) => (
                <option key={course.value} value={course.value}>
                  {course.label}
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
              <TableHead>Student</TableHead>
              <TableHead>Enrollments</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                      {getInitials(student.name)}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">
                        {student.name}
                      </p>
                      <p className="text-sm text-charcoal-500">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-charcoal-900">
                    <span className="font-medium">{student.enrolledCourses}</span>
                    <span className="text-sm text-charcoal-500">
                      {' '}
                      ({student.completedCourses} completed)
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-charcoal-200">
                      <div
                        className="h-full bg-primary-500"
                        style={{ width: `${student.averageProgress}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${getProgressColor(student.averageProgress)}`}
                    >
                      {student.averageProgress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-charcoal-900">
                      {student.totalPoints.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="info">Level {student.level}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {student.currentStreak > 0 ? (
                      <>
                        <span className="text-lg">🔥</span>
                        <span className="font-medium text-orange-600">
                          {student.currentStreak}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-charcoal-500">No streak</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm text-charcoal-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(student.lastActive)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(student.status) as any}>
                    {student.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/students/${student.id}`}>
                      <button
                        className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
                        aria-label="View student"
                        title="View student details"
                      >
                        <User className="h-4 w-4" />
                      </button>
                    </Link>
                    <button
                      className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
                      aria-label="More actions"
                      title="More actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {students.length === 0 && (
          <div className="py-12 text-center">
            <User className="mx-auto h-12 w-12 text-charcoal-400" />
            <p className="mt-4 text-charcoal-500">No students found</p>
          </div>
        )}
      </Card>
    </div>
  );
}
