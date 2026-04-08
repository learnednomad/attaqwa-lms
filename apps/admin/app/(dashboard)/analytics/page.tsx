/**
 * Analytics Dashboard Page
 * Real data from Strapi API — courses, lessons, enrollments
 */

'use client';

import {
  Award,
  BookOpen,
  Loader2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getCoursesWithStats,
  getLessonsWithStats,
  getDashboardStats,
  type CourseWithStats,
  type DashboardStats,
} from '@/lib/api/admin-stats';
import { formatCategoryLabel } from '@/lib/utils/formatters';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, c, l] = await Promise.all([
          getDashboardStats(),
          getCoursesWithStats(),
          getLessonsWithStats(),
        ]);
        setStats(s);
        setCourses(c);
        setLessons(l);
      } catch (err) {
        console.error('Failed to load analytics:', err);
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
        <span className="text-charcoal-500">Loading analytics...</span>
      </div>
    );
  }

  const publishedCourses = courses.filter((c) => c.publishedAt);
  const totalLessons = courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0);
  const totalEnrollments = courses.reduce((sum, c) => sum + (c.current_enrollments || 0), 0);

  // Group lessons by course for the breakdown
  const courseBreakdown = publishedCourses.map((course) => ({
    ...course,
    lessonCount: course.lessons?.length || 0,
  }));

  // Group courses by subject
  const subjectCounts: Record<string, number> = {};
  publishedCourses.forEach((c) => {
    subjectCounts[c.subject] = (subjectCounts[c.subject] || 0) + 1;
  });

  // Group courses by difficulty
  const difficultyCounts: Record<string, number> = {};
  publishedCourses.forEach((c) => {
    difficultyCounts[c.difficulty] = (difficultyCounts[c.difficulty] || 0) + 1;
  });

  // Group courses by age tier
  const ageTierCounts: Record<string, number> = {};
  publishedCourses.forEach((c) => {
    ageTierCounts[c.age_tier] = (ageTierCounts[c.age_tier] || 0) + 1;
  });

  const getCompletionColor = (rate: number) => {
    if (rate >= 75) return 'bg-green-500';
    if (rate >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-900">Analytics</h1>
        <p className="mt-2 text-charcoal-600">
          Overview of courses, lessons, and platform content
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">
                {stats?.totalUsers ?? 0}
              </p>
            </div>
            <div className="rounded-lg bg-primary-100 p-3">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Published Courses</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">
                {publishedCourses.length}
              </p>
              <p className="mt-1 text-sm text-charcoal-500">
                {courses.length - publishedCourses.length} drafts
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Total Lessons</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">{totalLessons}</p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Enrollments</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">{totalEnrollments}</p>
            </div>
            <div className="rounded-lg bg-amber-100 p-3">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Course Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Course Breakdown</CardTitle>
          <CardDescription>Lessons and enrollments per course</CardDescription>
        </CardHeader>
        <CardContent>
          {courseBreakdown.length === 0 ? (
            <div className="py-8 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-charcoal-300" />
              <p className="mt-3 text-sm text-charcoal-500">No published courses yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-charcoal-200 text-left text-sm">
                    <th className="pb-3 font-medium text-charcoal-600">Course</th>
                    <th className="pb-3 font-medium text-charcoal-600">Subject</th>
                    <th className="pb-3 font-medium text-charcoal-600">Difficulty</th>
                    <th className="pb-3 font-medium text-charcoal-600">Age Tier</th>
                    <th className="pb-3 font-medium text-charcoal-600">Lessons</th>
                    <th className="pb-3 font-medium text-charcoal-600">Enrollments</th>
                    <th className="pb-3 font-medium text-charcoal-600">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {courseBreakdown.map((course) => (
                    <tr key={course.id} className="border-b border-charcoal-100">
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-charcoal-900">{course.title}</p>
                          <p className="text-sm text-charcoal-500">{course.instructor}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="info">{formatCategoryLabel(course.subject)}</Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-charcoal-700 capitalize">{course.difficulty}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-charcoal-700 capitalize">{course.age_tier}</span>
                      </td>
                      <td className="py-4 text-charcoal-900 font-medium">{course.lessonCount}</td>
                      <td className="py-4 text-charcoal-900">{course.current_enrollments}</td>
                      <td className="py-4 text-charcoal-600">
                        {course.duration_weeks ? `${course.duration_weeks} weeks` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distribution Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* By Subject */}
        <Card>
          <CardHeader>
            <CardTitle>By Subject</CardTitle>
            <CardDescription>Course distribution by subject area</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(subjectCounts).length === 0 ? (
              <p className="text-sm text-charcoal-500 text-center py-4">No data</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(subjectCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([subject, count]) => (
                    <div key={subject} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-charcoal-700 capitalize">{formatCategoryLabel(subject)}</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-charcoal-200">
                          <div
                            className="h-full bg-primary-500"
                            style={{ width: `${(count / publishedCourses.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-charcoal-600">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* By Difficulty */}
        <Card>
          <CardHeader>
            <CardTitle>By Difficulty</CardTitle>
            <CardDescription>Course distribution by level</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(difficultyCounts).length === 0 ? (
              <p className="text-sm text-charcoal-500 text-center py-4">No data</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(difficultyCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([difficulty, count]) => (
                    <div key={difficulty} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-charcoal-700 capitalize">{difficulty}</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-charcoal-200">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${(count / publishedCourses.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-charcoal-600">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* By Age Tier */}
        <Card>
          <CardHeader>
            <CardTitle>By Age Tier</CardTitle>
            <CardDescription>Course distribution by audience</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(ageTierCounts).length === 0 ? (
              <p className="text-sm text-charcoal-500 text-center py-4">No data</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(ageTierCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([tier, count]) => (
                    <div key={tier} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-charcoal-700 capitalize">{tier}</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-charcoal-200">
                          <div
                            className="h-full bg-amber-500"
                            style={{ width: `${(count / publishedCourses.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-charcoal-600">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
