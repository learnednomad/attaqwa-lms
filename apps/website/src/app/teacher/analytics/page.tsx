'use client';

import React from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3, TrendingUp, TrendingDown, Users, BookOpen,
  Clock, Award, Target, Download
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const courseMetrics = [
  { course: 'Fiqh of Worship', completion: 65, avgScore: 82, engagement: 78, students: 24 },
  { course: 'Hadith Studies', completion: 40, avgScore: 75, engagement: 85, students: 18 },
  { course: 'Arabic Grammar Level 2', completion: 75, avgScore: 88, engagement: 92, students: 15 },
];

const topPerformers = [
  { name: 'Aisha Mohamed', course: 'Arabic Grammar', score: 95, progress: 90 },
  { name: 'Ahmad Hassan', course: 'Fiqh of Worship', score: 92, progress: 85 },
  { name: 'Ibrahim Ahmed', course: 'Arabic Grammar', score: 95, progress: 75 },
  { name: 'Sara Hassan', course: 'Fiqh of Worship', score: 85, progress: 65 },
];

const engagementData = [
  { week: 'Week 1', views: 156, completions: 45, quizzes: 38 },
  { week: 'Week 2', views: 178, completions: 52, quizzes: 44 },
  { week: 'Week 3', views: 145, completions: 48, quizzes: 41 },
  { week: 'Week 4', views: 189, completions: 58, quizzes: 52 },
];

export default function TeacherAnalyticsPage() {
  return (
    <TeacherLayout title="Course Analytics" subtitle="Track student performance and engagement">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="fiqh">Fiqh of Worship</SelectItem>
              <SelectItem value="hadith">Hadith Studies</SelectItem>
              <SelectItem value="arabic">Arabic Grammar</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Completion</p>
                <p className="text-2xl font-bold text-gray-900">60%</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +8% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Quiz Score</p>
                <p className="text-2xl font-bold text-gray-900">82%</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +5% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2 flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" /> -2% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Time/Lesson</p>
                <p className="text-2xl font-bold text-gray-900">28 min</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Target: 30 min</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Performance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Course Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courseMetrics.map((course, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{course.course}</h3>
                        <p className="text-sm text-gray-500">{course.students} students enrolled</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Completion</p>
                        <div className="flex items-center gap-2">
                          <Progress value={course.completion} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{course.completion}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Avg Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={course.avgScore} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{course.avgScore}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Engagement</p>
                        <div className="flex items-center gap-2">
                          <Progress value={course.engagement} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{course.engagement}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((student, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-amber-100 text-amber-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{student.score}%</p>
                    <p className="text-xs text-gray-500">{student.progress}% done</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Over Time */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weekly Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Week</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Lesson Views</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Completions</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Quizzes Taken</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {engagementData.map((week, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{week.week}</td>
                    <td className="px-4 py-3 text-gray-700">{week.views}</td>
                    <td className="px-4 py-3 text-gray-700">{week.completions}</td>
                    <td className="px-4 py-3 text-gray-700">{week.quizzes}</td>
                    <td className="px-4 py-3">
                      {index > 0 && week.views > engagementData[index - 1].views ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : index > 0 ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TeacherLayout>
  );
}
