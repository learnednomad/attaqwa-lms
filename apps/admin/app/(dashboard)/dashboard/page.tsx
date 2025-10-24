/**
 * Dashboard Home Page
 * Overview statistics and quick actions
 */

'use client';

import { BookOpen, Clock, Trophy, Users } from 'lucide-react';

import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  // TODO: Replace with real data from API
  const stats = {
    totalStudents: 1247,
    activeCourses: 24,
    totalLessons: 156,
    averageProgress: 67,
  };

  const recentActivity = [
    {
      id: 1,
      student: 'Ahmed Hassan',
      action: 'Completed',
      course: 'Quran Recitation Basics',
      time: '2 hours ago',
    },
    {
      id: 2,
      student: 'Fatima Ali',
      action: 'Started',
      course: 'Hadith Studies',
      time: '5 hours ago',
    },
    {
      id: 3,
      student: 'Omar Ibrahim',
      action: 'Achieved 100% on',
      course: 'Arabic Grammar Quiz',
      time: '1 day ago',
    },
    {
      id: 4,
      student: 'Aisha Mohammed',
      action: 'Enrolled in',
      course: 'Islamic History',
      time: '1 day ago',
    },
  ];

  const popularCourses = [
    {
      id: 1,
      title: 'Quran Recitation Basics',
      students: 342,
      completion: 78,
      category: 'Quran',
    },
    {
      id: 2,
      title: 'Hadith Studies',
      students: 256,
      completion: 65,
      category: 'Hadith',
    },
    {
      id: 3,
      title: 'Islamic History',
      students: 198,
      completion: 82,
      category: 'Seerah',
    },
    {
      id: 4,
      title: 'Arabic Grammar',
      students: 176,
      completion: 71,
      category: 'General',
    },
  ];

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
          value={stats.totalStudents}
          icon={<Users className="h-6 w-6 text-primary-600" />}
          trend={{
            value: 12,
            isPositive: true,
          }}
        />
        <StatsCard
          title="Active Courses"
          value={stats.activeCourses}
          icon={<BookOpen className="h-6 w-6 text-secondary-600" />}
          iconClassName="bg-secondary-100"
          trend={{
            value: 8,
            isPositive: true,
          }}
        />
        <StatsCard
          title="Total Lessons"
          value={stats.totalLessons}
          icon={<Clock className="h-6 w-6 text-blue-600" />}
          iconClassName="bg-blue-100"
          trend={{
            value: 15,
            isPositive: true,
          }}
        />
        <StatsCard
          title="Avg. Progress"
          value={`${stats.averageProgress}%`}
          icon={<Trophy className="h-6 w-6 text-green-600" />}
          iconClassName="bg-green-100"
          trend={{
            value: 5,
            isPositive: true,
          }}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest student actions and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 rounded-lg border border-charcoal-200 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                    {activity.student.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-charcoal-900">
                      <span className="font-medium">{activity.student}</span>{' '}
                      <span className="text-charcoal-600">{activity.action}</span>{' '}
                      <span className="font-medium">{activity.course}</span>
                    </p>
                    <p className="mt-1 text-xs text-charcoal-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Courses</CardTitle>
            <CardDescription>Most enrolled courses this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg border border-charcoal-200 p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-charcoal-900">
                      {course.title}
                    </p>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-charcoal-500">
                      <span>{course.students} students</span>
                      <span>•</span>
                      <span>{course.completion}% completion</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700">
                    {course.category}
                  </span>
                </div>
              ))}
            </div>
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
            <button className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-charcoal-300 p-4 transition-colors hover:border-primary-500 hover:bg-primary-50">
              <div className="rounded-lg bg-primary-100 p-2">
                <BookOpen className="h-5 w-5 text-primary-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal-900">Create Course</p>
                <p className="text-sm text-charcoal-600">Add new course</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-charcoal-300 p-4 transition-colors hover:border-primary-500 hover:bg-primary-50">
              <div className="rounded-lg bg-secondary-100 p-2">
                <Users className="h-5 w-5 text-secondary-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal-900">View Students</p>
                <p className="text-sm text-charcoal-600">Manage enrollments</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 rounded-lg border-2 border-dashed border-charcoal-300 p-4 transition-colors hover:border-primary-500 hover:bg-primary-50">
              <div className="rounded-lg bg-blue-100 p-2">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal-900">Analytics</p>
                <p className="text-sm text-charcoal-600">View reports</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
