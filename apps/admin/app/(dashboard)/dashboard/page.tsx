/**
 * Dashboard Home Page
 * Overview statistics and quick actions — all data from real APIs
 */

'use client';

import { BookOpen, Clock, Loader2, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getDashboardStats,
  getCoursesWithStats,
  getRecentEnrollments,
  type DashboardStats,
  type CourseWithStats,
} from '@/lib/api/admin-stats';
import { formatCategoryLabel } from '@/lib/utils/formatters';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, c, e] = await Promise.all([
          getDashboardStats(),
          getCoursesWithStats(),
          getRecentEnrollments(),
        ]);
        setStats(s);
        setCourses(c);
        setRecentEnrollments(e);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500 mr-2" />
        <span className="text-charcoal-500">Loading dashboard...</span>
      </div>
    );
  }

  const publishedCourses = courses.filter((c) => c.publishedAt);
  const totalLessons = courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-900">Dashboard</h1>
        <p className="mt-2 text-charcoal-600">
          Welcome back! Here's what's happening with your courses.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={stats?.totalUsers ?? 0}
          icon={<Users className="h-6 w-6 text-primary-600" />}
        />
        <StatsCard
          title="Published Courses"
          value={publishedCourses.length}
          icon={<BookOpen className="h-6 w-6 text-secondary-600" />}
          iconClassName="bg-secondary-100"
        />
        <StatsCard
          title="Total Lessons"
          value={totalLessons}
          icon={<Clock className="h-6 w-6 text-blue-600" />}
          iconClassName="bg-blue-100"
        />
        <StatsCard
          title="Enrollments"
          value={stats?.totalEnrollments ?? 0}
          icon={<Trophy className="h-6 w-6 text-green-600" />}
          iconClassName="bg-green-100"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest enrollments and student actions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEnrollments.length === 0 ? (
              <div className="py-8 text-center">
                <Users className="mx-auto h-10 w-10 text-charcoal-300" />
                <p className="mt-3 text-sm text-charcoal-500">No enrollments yet</p>
                <p className="text-xs text-charcoal-400">
                  Student activity will appear here once students start enrolling
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEnrollments.map((enrollment: any) => (
                  <div
                    key={enrollment.id}
                    className="flex items-start space-x-3 rounded-lg border border-charcoal-200 p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                      {(enrollment.user?.name || 'U').charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-charcoal-900">
                        <span className="font-medium">{enrollment.user?.name || 'Unknown'}</span>{' '}
                        <span className="text-charcoal-600">enrolled in</span>{' '}
                        <span className="font-medium">{enrollment.course?.title || 'Unknown Course'}</span>
                      </p>
                      <p className="mt-1 text-xs text-charcoal-500">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Courses Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>All published courses</CardDescription>
          </CardHeader>
          <CardContent>
            {publishedCourses.length === 0 ? (
              <div className="py-8 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-charcoal-300" />
                <p className="mt-3 text-sm text-charcoal-500">No courses published yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {publishedCourses.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between rounded-lg border border-charcoal-200 p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-charcoal-900">
                        {course.title}
                      </p>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-charcoal-500">
                        <span>{course.current_enrollments} students</span>
                        <span>•</span>
                        <span>{course.lessons?.length || 0} lessons</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700">
                      {formatCategoryLabel(course.subject)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/courses/new">
              <button className="flex w-full items-center space-x-3 rounded-lg border-2 border-dashed border-charcoal-300 p-4 transition-colors hover:border-primary-500 hover:bg-primary-50">
                <div className="rounded-lg bg-primary-100 p-2">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-charcoal-900">Create Course</p>
                  <p className="text-sm text-charcoal-600">Add new course</p>
                </div>
              </button>
            </Link>

            <Link href="/students">
              <button className="flex w-full items-center space-x-3 rounded-lg border-2 border-dashed border-charcoal-300 p-4 transition-colors hover:border-primary-500 hover:bg-primary-50">
                <div className="rounded-lg bg-secondary-100 p-2">
                  <Users className="h-5 w-5 text-secondary-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-charcoal-900">View Students</p>
                  <p className="text-sm text-charcoal-600">Manage enrollments</p>
                </div>
              </button>
            </Link>

            <Link href="/analytics">
              <button className="flex w-full items-center space-x-3 rounded-lg border-2 border-dashed border-charcoal-300 p-4 transition-colors hover:border-primary-500 hover:bg-primary-50">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-charcoal-900">Analytics</p>
                  <p className="text-sm text-charcoal-600">View reports</p>
                </div>
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
