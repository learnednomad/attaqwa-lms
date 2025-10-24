/**
 * Student Profile Page
 * View detailed student information and progress
 */

'use client';

import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils/formatters';

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id as string;

  // TODO: Replace with real data from API
  const [student] = useState({
    id: studentId,
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    avatar: null,
    bio: 'Passionate about learning Islamic sciences and improving my Quran recitation.',
    joinedAt: '2024-06-15',
    lastActive: '2025-01-15T14:30:00Z',
    status: 'active',

    // Stats
    enrolledCourses: 5,
    completedCourses: 2,
    inProgressCourses: 3,
    averageProgress: 78,
    totalPoints: 2450,
    level: 12,
    currentStreak: 15,
    longestStreak: 28,
    totalDaysActive: 124,

    // Achievements
    achievements: [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        type: 'bronze',
        earnedAt: '2024-06-16',
      },
      {
        id: '2',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        type: 'silver',
        earnedAt: '2024-07-05',
      },
      {
        id: '3',
        name: 'Course Master',
        description: 'Complete a course with 95%+ score',
        icon: '🏆',
        type: 'gold',
        earnedAt: '2024-08-20',
      },
    ],

    // Course Enrollments
    enrollments: [
      {
        id: '1',
        courseTitle: 'Quran Recitation Basics',
        courseCategory: 'quran',
        progress: 100,
        status: 'completed',
        enrolledAt: '2024-06-15',
        completedAt: '2024-08-20',
        lastAccessedAt: '2024-08-20',
        completedLessons: 12,
        totalLessons: 12,
        averageQuizScore: 92,
      },
      {
        id: '2',
        courseTitle: 'Hadith Studies - Introduction',
        courseCategory: 'hadith',
        progress: 85,
        status: 'in_progress',
        enrolledAt: '2024-07-01',
        completedAt: null,
        lastAccessedAt: '2025-01-15',
        completedLessons: 15,
        totalLessons: 18,
        averageQuizScore: 88,
      },
      {
        id: '3',
        courseTitle: 'Islamic History & Seerah',
        courseCategory: 'seerah',
        progress: 65,
        status: 'in_progress',
        enrolledAt: '2024-08-10',
        completedAt: null,
        lastAccessedAt: '2025-01-14',
        completedLessons: 10,
        totalLessons: 15,
        averageQuizScore: 85,
      },
      {
        id: '4',
        courseTitle: 'Arabic Grammar Fundamentals',
        courseCategory: 'general',
        progress: 100,
        status: 'completed',
        enrolledAt: '2024-09-01',
        completedAt: '2024-11-15',
        lastAccessedAt: '2024-11-15',
        completedLessons: 10,
        totalLessons: 10,
        averageQuizScore: 95,
      },
      {
        id: '5',
        courseTitle: 'Fiqh - Prayer Rulings',
        courseCategory: 'fiqh',
        progress: 45,
        status: 'in_progress',
        enrolledAt: '2024-11-20',
        completedAt: null,
        lastAccessedAt: '2025-01-12',
        completedLessons: 8,
        totalLessons: 18,
        averageQuizScore: 82,
      },
    ],

    // Recent Activity
    recentActivity: [
      {
        id: '1',
        type: 'lesson_completed',
        title: 'Completed "Types of Hadith"',
        course: 'Hadith Studies',
        timestamp: '2025-01-15T14:30:00Z',
      },
      {
        id: '2',
        type: 'quiz_passed',
        title: 'Passed quiz with 95%',
        course: 'Hadith Studies',
        timestamp: '2025-01-15T14:00:00Z',
      },
      {
        id: '3',
        type: 'achievement_earned',
        title: 'Earned "Week Warrior" badge',
        course: null,
        timestamp: '2025-01-14T09:00:00Z',
      },
      {
        id: '4',
        type: 'lesson_completed',
        title: 'Completed "The Battle of Badr"',
        course: 'Islamic History',
        timestamp: '2025-01-14T16:20:00Z',
      },
    ],
  });

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getEnrollmentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      default:
        return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'quiz_passed':
        return <Trophy className="h-5 w-5 text-amber-600" />;
      case 'achievement_earned':
        return <Award className="h-5 w-5 text-primary-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-charcoal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/students"
          className="rounded-lg p-2 text-charcoal-600 transition-colors hover:bg-charcoal-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-charcoal-900">Student Profile</h1>
          <p className="mt-2 text-charcoal-600">
            View detailed information and progress tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
        </div>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-charcoal-900">
                  {student.name}
                </h2>
                <Badge variant={getStatusBadge(student.status) as any}>
                  {student.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="mt-2 flex items-center space-x-4 text-sm text-charcoal-600">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(student.joinedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Last active {formatDate(student.lastActive)}</span>
                </div>
              </div>

              {student.bio && (
                <p className="mt-3 text-charcoal-700">{student.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Total Points</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">
                {student.totalPoints.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-amber-100 p-3">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Level</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">
                {student.level}
              </p>
            </div>
            <div className="rounded-lg bg-primary-100 p-3">
              <TrendingUp className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Current Streak</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">
                {student.currentStreak} days
              </p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Avg. Progress</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">
                {student.averageProgress}%
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Enrollments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Enrollments</CardTitle>
            <CardDescription>
              {student.enrolledCourses} courses ({student.completedCourses} completed)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="rounded-lg border border-charcoal-200 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-charcoal-900">
                          {enrollment.courseTitle}
                        </h3>
                        <Badge
                          variant={
                            getEnrollmentStatusBadge(enrollment.status) as any
                          }
                        >
                          {enrollment.status === 'completed'
                            ? 'Completed'
                            : 'In Progress'}
                        </Badge>
                      </div>

                      <div className="mt-2 flex items-center space-x-4 text-xs text-charcoal-600">
                        <span>
                          {enrollment.completedLessons}/{enrollment.totalLessons}{' '}
                          lessons
                        </span>
                        <span>•</span>
                        <span>Avg. score: {enrollment.averageQuizScore}%</span>
                        <span>•</span>
                        <span>Last accessed {formatDate(enrollment.lastAccessedAt)}</span>
                      </div>

                      <div className="mt-3 flex items-center space-x-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-charcoal-200">
                          <div
                            className="h-full bg-primary-500"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-primary-600">
                          {enrollment.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                {student.achievements.length} badges earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 rounded-lg border border-charcoal-200 p-3"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal-900">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-charcoal-600">
                        {achievement.description}
                      </p>
                      <p className="mt-1 text-xs text-charcoal-500">
                        {formatDate(achievement.earnedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest learning actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3"
                  >
                    <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm text-charcoal-900">
                        {activity.title}
                      </p>
                      {activity.course && (
                        <p className="text-xs text-charcoal-600">
                          {activity.course}
                        </p>
                      )}
                      <p className="text-xs text-charcoal-500">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Total Days Active</span>
                  <span className="font-medium text-charcoal-900">
                    {student.totalDaysActive}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Longest Streak</span>
                  <span className="font-medium text-charcoal-900">
                    {student.longestStreak} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Courses Completed</span>
                  <span className="font-medium text-charcoal-900">
                    {student.completedCourses}/{student.enrolledCourses}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">In Progress</span>
                  <span className="font-medium text-charcoal-900">
                    {student.inProgressCourses}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
