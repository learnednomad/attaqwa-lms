'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp, TrendingDown, Users, BookOpen,
  Award, Clock, Download, BarChart3, Eye
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const subjectPerformance = [
  { subject: 'Quran', students: 124, avgCompletion: 78, avgScore: 85, trend: 'up' },
  { subject: 'Hadith', students: 98, avgCompletion: 65, avgScore: 79, trend: 'up' },
  { subject: 'Fiqh', students: 87, avgCompletion: 72, avgScore: 82, trend: 'down' },
  { subject: 'Seerah', students: 65, avgCompletion: 81, avgScore: 88, trend: 'up' },
  { subject: 'Arabic', students: 110, avgCompletion: 58, avgScore: 74, trend: 'down' },
  { subject: 'Aqidah', students: 76, avgCompletion: 85, avgScore: 90, trend: 'up' },
];

const ageTierData = [
  { tier: 'Children (5-10)', students: 82, avgCompletion: 75, topSubject: 'Quran' },
  { tier: 'Youth (11-17)', students: 96, avgCompletion: 68, topSubject: 'Seerah' },
  { tier: 'Adults (18+)', students: 70, avgCompletion: 82, topSubject: 'Fiqh' },
];

const weeklyTrends = [
  { week: 'Week 1', enrollments: 28, completions: 15, quizzesTaken: 42 },
  { week: 'Week 2', enrollments: 35, completions: 22, quizzesTaken: 56 },
  { week: 'Week 3', enrollments: 21, completions: 18, quizzesTaken: 48 },
  { week: 'Week 4', enrollments: 42, completions: 31, quizzesTaken: 65 },
];

export default function AdminEducationAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Education Analytics</h1>
          <p className="text-gray-600 mt-1">Overview of Islamic education platform performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last quarter</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Enrollments</p>
                <p className="text-2xl font-bold">248</p>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% vs last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Content Pieces</p>
                <p className="text-2xl font-bold">126</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +8 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Completion Rate</p>
                <p className="text-2xl font-bold">73%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +5% improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Certificates Issued</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +8 this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Performance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Performance by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectPerformance.map((subject, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">{subject.subject}</h3>
                        <Badge variant="outline">{subject.students} students</Badge>
                      </div>
                      {subject.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Avg Completion</p>
                        <div className="flex items-center gap-2">
                          <Progress value={subject.avgCompletion} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{subject.avgCompletion}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Avg Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={subject.avgScore} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{subject.avgScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Age Tier Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Age Tier Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ageTierData.map((tier, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 text-sm">{tier.tier}</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Students</span>
                      <span className="font-medium">{tier.students}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Completion</span>
                        <span className="font-medium">{tier.avgCompletion}%</span>
                      </div>
                      <Progress value={tier.avgCompletion} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Top Subject</span>
                      <Badge variant="outline" className="text-xs">{tier.topSubject}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Period</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">New Enrollments</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Course Completions</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Quizzes Taken</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {weeklyTrends.map((week, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{week.week}</td>
                    <td className="px-4 py-3 text-gray-700">{week.enrollments}</td>
                    <td className="px-4 py-3 text-gray-700">{week.completions}</td>
                    <td className="px-4 py-3 text-gray-700">{week.quizzesTaken}</td>
                    <td className="px-4 py-3">
                      {index > 0 && week.enrollments > weeklyTrends[index - 1].enrollments ? (
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
    </div>
  );
}
