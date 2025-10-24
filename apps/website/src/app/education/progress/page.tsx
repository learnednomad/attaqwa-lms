'use client';

import React, { useState } from 'react';
import { FeatureFlagService } from '@attaqwa/shared/feature-flags';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  BookOpen,
  Brain,
  Star,
  Calendar,
  CheckCircle,
  BarChart3,
  Eye,
  ArrowRight
} from 'lucide-react';

// Mock progress data
const progressData = {
  overallProgress: 73,
  totalTimeSpent: 1250, // minutes
  completedLessons: 24,
  totalLessons: 33,
  quizzesPassed: 18,
  totalQuizzes: 21,
  currentStreak: 7,
  longestStreak: 14,
  certificatesEarned: 3,
  averageScore: 85
};

const subjectProgress = [
  { subject: 'Quran', completed: 8, total: 12, progress: 67, color: 'bg-islamic-green-500' },
  { subject: 'Hadith', completed: 5, total: 8, progress: 63, color: 'bg-islamic-gold-500' },
  { subject: 'Fiqh', completed: 3, total: 6, progress: 50, color: 'bg-blue-500' },
  { subject: 'Aqidah', completed: 4, total: 4, progress: 100, color: 'bg-purple-500' },
  { subject: 'Seerah', completed: 2, total: 5, progress: 40, color: 'bg-indigo-500' },
  { subject: 'Worship', completed: 2, total: 3, progress: 67, color: 'bg-emerald-500' }
];

const recentActivity = [
  {
    id: '1',
    type: 'lesson',
    title: 'Prayer Fundamentals',
    subject: 'Worship',
    completedAt: '2 hours ago',
    score: null,
    icon: BookOpen
  },
  {
    id: '2',
    type: 'quiz',
    title: 'Five Pillars Quiz',
    subject: 'Aqidah',
    completedAt: '1 day ago',
    score: 92,
    icon: Brain
  },
  {
    id: '3',
    type: 'lesson',
    title: 'Stories of Prophet Ibrahim',
    subject: 'Seerah',
    completedAt: '2 days ago',
    score: null,
    icon: BookOpen
  },
  {
    id: '4',
    type: 'quiz',
    title: 'Quran Basics Quiz',
    subject: 'Quran',
    completedAt: '3 days ago',
    score: 88,
    icon: Brain
  }
];

const achievements = [
  {
    id: '1',
    title: 'Quran Explorer',
    description: 'Completed 5 Quran lessons',
    icon: '📖',
    earnedAt: '3 days ago',
    rarity: 'common'
  },
  {
    id: '2',
    title: 'Prayer Master',
    description: 'Scored 90% or higher on worship quizzes',
    icon: '🤲',
    earnedAt: '1 week ago',
    rarity: 'rare'
  },
  {
    id: '3',
    title: '7-Day Streak',
    description: 'Learned for 7 consecutive days',
    icon: '🔥',
    earnedAt: 'Today',
    rarity: 'epic'
  }
];

const upcomingContent = [
  {
    id: '1',
    title: 'Advanced Tajweed Rules',
    subject: 'Quran',
    type: 'lesson',
    duration: 45,
    difficulty: 'Intermediate'
  },
  {
    id: '2',
    title: 'Hadith Authentication Quiz',
    subject: 'Hadith',
    type: 'quiz',
    duration: 20,
    difficulty: 'Advanced'
  },
  {
    id: '3',
    title: 'Islamic Finance Principles',
    subject: 'Fiqh',
    type: 'lesson',
    duration: 60,
    difficulty: 'Intermediate'
  }
];

export default function ProgressPage() {
  // Feature flag protection
  if (!FeatureFlagService.canAccessEducationUI()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-islamic-navy-800 mb-4">Learning Progress</h1>
          <div className="bg-islamic-gold-50 border border-islamic-gold-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-islamic-gold-800 mb-2">🚧 Under Development</h2>
            <p className="text-islamic-gold-700">Progress tracking system is being enhanced.</p>
          </div>
          <Link href="/"><Button className="bg-islamic-green-600 hover:bg-islamic-green-700">Return to Home</Button></Link>
        </div>
      </div>
    );
  }

  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-gold-300 bg-gold-50'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-islamic-navy-800 mb-4">
          Your Learning Progress
        </h1>
        <p className="text-lg text-gray-600">
          Track your Islamic education journey and celebrate your achievements.
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-3xl font-bold text-islamic-green-600">{progressData.overallProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-islamic-green-500" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-islamic-green-600 h-2 rounded-full"
                  style={{ width: `${progressData.overallProgress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-3xl font-bold text-islamic-navy-800">{formatTime(progressData.totalTimeSpent)}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Learning time this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-3xl font-bold text-orange-600">{progressData.currentStreak}</p>
              </div>
              <Star className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-3xl font-bold text-purple-600">{progressData.certificatesEarned}</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Earned this year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Progress */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Subject Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectProgress.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-islamic-navy-800">{subject.subject}</span>
                      <span className="text-sm text-gray-600">
                        {subject.completed}/{subject.total} lessons
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${subject.color} h-3 rounded-full transition-all duration-300`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {subject.progress}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className="bg-islamic-green-100 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-islamic-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-islamic-navy-800">{activity.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {activity.subject}
                          </Badge>
                          <span>{activity.completedAt}</span>
                          {activity.score && (
                            <span className="text-green-600 font-medium">Score: {activity.score}%</span>
                          )}
                        </div>
                      </div>
                      <Link href={`/education/content/${activity.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-3 rounded-lg border-2 ${getRarityColor(achievement.rarity)}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.earnedAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/education/achievements">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Achievements
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Study Goal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#059669"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.7)}`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-islamic-green-600">70%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">21/30 minutes today</p>
                <p className="text-xs text-gray-500">Goal: 30 minutes daily</p>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingContent.map((content) => (
                  <div key={content.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-semibold text-sm text-islamic-navy-800 mb-1">
                      {content.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Badge variant="outline" className="text-xs">
                        {content.subject}
                      </Badge>
                      <span>{content.duration} min</span>
                      <span>{content.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/education/browse">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Browse More Content
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Progress Chart Placeholder */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Learning Activity
            </CardTitle>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className="capitalize"
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Learning activity chart would be displayed here</p>
              <p className="text-sm">Shows daily learning time and completion rates</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-islamic-green-600" />
            <p className="text-2xl font-bold text-islamic-navy-800">
              {progressData.completedLessons}
            </p>
            <p className="text-sm text-gray-600">Lessons Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-islamic-navy-800">
              {progressData.quizzesPassed}
            </p>
            <p className="text-sm text-gray-600">Quizzes Passed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-islamic-navy-800">
              {progressData.averageScore}%
            </p>
            <p className="text-sm text-gray-600">Average Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-islamic-navy-800">
              {progressData.certificatesEarned}
            </p>
            <p className="text-sm text-gray-600">Certificates</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}