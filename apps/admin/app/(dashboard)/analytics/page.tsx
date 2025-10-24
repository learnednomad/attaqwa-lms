/**
 * Analytics Dashboard Page
 * Comprehensive analytics and reporting for courses and students
 */

'use client';

import {
  Award,
  BookOpen,
  Download,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils/formatters';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  // TODO: Replace with real data from API
  const stats = {
    totalStudents: 1247,
    activeStudents: 892,
    totalCourses: 24,
    completedEnrollments: 3456,
    averageCompletion: 67,
    averageQuizScore: 82,
    totalPoints: 247000,
    activeStreaks: 234,
  };

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
  ];

  // Course Performance Data
  const coursePerformance = [
    {
      id: '1',
      title: 'Quran Recitation Basics',
      category: 'quran',
      enrollments: 342,
      completions: 267,
      completionRate: 78,
      averageScore: 92,
      averageTime: 180, // minutes
      trend: 'up',
    },
    {
      id: '2',
      title: 'Hadith Studies - Introduction',
      category: 'hadith',
      enrollments: 256,
      completions: 167,
      completionRate: 65,
      averageScore: 88,
      averageTime: 240,
      trend: 'up',
    },
    {
      id: '3',
      title: 'Islamic History & Seerah',
      category: 'seerah',
      enrollments: 198,
      completions: 162,
      completionRate: 82,
      averageScore: 85,
      averageTime: 200,
      trend: 'stable',
    },
    {
      id: '4',
      title: 'Fiqh - Prayer Rulings',
      category: 'fiqh',
      enrollments: 176,
      completions: 98,
      completionRate: 56,
      averageScore: 79,
      averageTime: 220,
      trend: 'down',
    },
    {
      id: '5',
      title: 'Arabic Grammar Fundamentals',
      category: 'general',
      enrollments: 145,
      completions: 121,
      completionRate: 83,
      averageScore: 95,
      averageTime: 150,
      trend: 'up',
    },
  ];

  // Student Engagement Data
  const engagementMetrics = [
    {
      metric: 'Daily Active Users',
      value: 234,
      change: 12,
      trend: 'up',
    },
    {
      metric: 'Weekly Active Users',
      value: 567,
      change: 8,
      trend: 'up',
    },
    {
      metric: 'Average Session Duration',
      value: '24 min',
      change: 5,
      trend: 'up',
    },
    {
      metric: 'Lessons Completed (Today)',
      value: 89,
      change: -3,
      trend: 'down',
    },
  ];

  // Popular Content
  const popularLessons = [
    {
      id: '1',
      title: 'Introduction to Tajweed',
      course: 'Quran Recitation Basics',
      views: 456,
      completions: 398,
      averageRating: 4.8,
    },
    {
      id: '2',
      title: 'Types of Hadith',
      course: 'Hadith Studies',
      views: 389,
      completions: 345,
      averageRating: 4.7,
    },
    {
      id: '3',
      title: 'The Battle of Badr',
      course: 'Islamic History',
      views: 367,
      completions: 312,
      averageRating: 4.9,
    },
    {
      id: '4',
      title: 'Wudu Requirements',
      course: 'Fiqh - Prayer Rulings',
      views: 345,
      completions: 289,
      averageRating: 4.6,
    },
    {
      id: '5',
      title: 'Arabic Verb Conjugation',
      course: 'Arabic Grammar',
      views: 298,
      completions: 267,
      averageRating: 4.5,
    },
  ];

  // Achievement Distribution
  const achievementStats = [
    { type: 'Bronze', count: 892, percentage: 45 },
    { type: 'Silver', count: 567, percentage: 29 },
    { type: 'Gold', count: 234, percentage: 12 },
    { type: 'Platinum', count: 89, percentage: 4 },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-charcoal-600';
    }
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 75) return 'bg-green-500';
    if (rate >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // TODO: Implement export functionality
    console.log(`Exporting analytics as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Analytics</h1>
          <p className="mt-2 text-charcoal-600">
            Comprehensive insights into course performance and student engagement
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">
                Total Students
              </p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">
                {stats.totalStudents.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-green-600">
                {stats.activeStudents} active
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
              <p className="text-sm font-medium text-charcoal-600">
                Total Courses
              </p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">
                {stats.totalCourses}
              </p>
              <p className="mt-1 text-sm text-charcoal-600">
                {stats.completedEnrollments.toLocaleString()} completions
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
              <p className="text-sm font-medium text-charcoal-600">
                Avg. Completion
              </p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">
                {stats.averageCompletion}%
              </p>
              <p className="mt-1 text-sm text-charcoal-600">
                Across all courses
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">
                Avg. Quiz Score
              </p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">
                {stats.averageQuizScore}%
              </p>
              <p className="mt-1 text-sm text-charcoal-600">
                Across all quizzes
              </p>
            </div>
            <div className="rounded-lg bg-amber-100 p-3">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
          <CardDescription>
            Completion rates and student performance by course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-charcoal-200 text-left text-sm">
                  <th className="pb-3 font-medium text-charcoal-600">Course</th>
                  <th className="pb-3 font-medium text-charcoal-600">Enrollments</th>
                  <th className="pb-3 font-medium text-charcoal-600">Completions</th>
                  <th className="pb-3 font-medium text-charcoal-600">Completion Rate</th>
                  <th className="pb-3 font-medium text-charcoal-600">Avg. Score</th>
                  <th className="pb-3 font-medium text-charcoal-600">Avg. Time</th>
                  <th className="pb-3 font-medium text-charcoal-600">Trend</th>
                </tr>
              </thead>
              <tbody>
                {coursePerformance.map((course) => (
                  <tr key={course.id} className="border-b border-charcoal-100">
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-charcoal-900">
                          {course.title}
                        </p>
                        <p className="text-sm text-charcoal-600 capitalize">
                          {course.category}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-charcoal-900">
                      {course.enrollments}
                    </td>
                    <td className="py-4 text-charcoal-900">
                      {course.completions}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-charcoal-200">
                          <div
                            className={`h-full ${getCompletionColor(course.completionRate)}`}
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-charcoal-900">
                          {course.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="info">{course.averageScore}%</Badge>
                    </td>
                    <td className="py-4 text-charcoal-600">
                      {Math.floor(course.averageTime / 60)}h{' '}
                      {course.averageTime % 60}m
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(course.trend)}
                        <span className={`text-sm ${getTrendColor(course.trend)}`}>
                          {course.trend === 'up' && 'Improving'}
                          {course.trend === 'down' && 'Declining'}
                          {course.trend === 'stable' && 'Stable'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Engagement & Popular Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
            <CardDescription>User activity and learning patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagementMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-charcoal-200 p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">
                      {metric.metric}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-charcoal-900">
                      {metric.value}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                      {metric.change > 0 ? '+' : ''}
                      {metric.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Lessons */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Lessons</CardTitle>
            <CardDescription>Most viewed and completed content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-start space-x-3 rounded-lg border border-charcoal-200 p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal-900">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-charcoal-600">{lesson.course}</p>
                    <div className="mt-1 flex items-center space-x-3 text-xs text-charcoal-600">
                      <span>{lesson.views} views</span>
                      <span>•</span>
                      <span>{lesson.completions} completed</span>
                      <span>•</span>
                      <div className="flex items-center space-x-0.5">
                        <span className="text-amber-500">★</span>
                        <span>{lesson.averageRating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Distribution</CardTitle>
          <CardDescription>
            Badge distribution across student population
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {achievementStats.map((stat) => (
              <div
                key={stat.type}
                className="rounded-lg border border-charcoal-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-charcoal-700">
                    {stat.type}
                  </p>
                  <Badge
                    variant={
                      stat.type === 'Bronze'
                        ? 'default'
                        : stat.type === 'Silver'
                          ? 'info'
                          : stat.type === 'Gold'
                            ? 'warning'
                            : 'success'
                    }
                  >
                    {stat.percentage}%
                  </Badge>
                </div>
                <p className="mt-2 text-2xl font-bold text-charcoal-900">
                  {stat.count.toLocaleString()}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-charcoal-200">
                  <div
                    className={
                      stat.type === 'Bronze'
                        ? 'h-full bg-orange-700'
                        : stat.type === 'Silver'
                          ? 'h-full bg-gray-400'
                          : stat.type === 'Gold'
                            ? 'h-full bg-amber-500'
                            : 'h-full bg-purple-500'
                    }
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
          <CardDescription>AI-powered insights from your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="mt-0.5 h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">
                    Strong Course Performance
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    "Arabic Grammar Fundamentals" has an 83% completion rate with
                    95% average score. Consider creating advanced follow-up content.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
              <div className="flex items-start space-x-3">
                <Award className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">
                    Engagement Opportunity
                  </p>
                  <p className="mt-1 text-sm text-amber-700">
                    234 students have active streaks. Send encouragement messages to
                    maintain momentum and boost retention.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex items-start space-x-3">
                <TrendingDown className="mt-0.5 h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Needs Attention</p>
                  <p className="mt-1 text-sm text-red-700">
                    "Fiqh - Prayer Rulings" has only 56% completion rate. Review
                    content difficulty and consider adding supplementary materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
