'use client';

import React from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users, TrendingUp, TrendingDown, MessageSquare,
  Eye, BookOpen, Clock, Download, Heart
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const engagementMetrics = [
  { label: 'Active Students', value: 48, total: 57, change: '+3', trend: 'up' },
  { label: 'Avg Session Duration', value: '32 min', change: '+5 min', trend: 'up' },
  { label: 'Discussion Posts', value: 124, change: '+18', trend: 'up' },
  { label: 'Resource Views', value: 856, change: '-12', trend: 'down' },
];

const courseEngagement = [
  { course: 'Fiqh of Worship', activeStudents: 22, totalStudents: 24, avgTime: '35 min', discussions: 45, resourceViews: 312, satisfaction: 92 },
  { course: 'Hadith Studies', activeStudents: 15, totalStudents: 18, avgTime: '28 min', discussions: 38, resourceViews: 245, satisfaction: 88 },
  { course: 'Arabic Grammar Level 2', activeStudents: 11, totalStudents: 15, avgTime: '42 min', discussions: 41, resourceViews: 299, satisfaction: 95 },
];

const topEngaged = [
  { name: 'Maryam Yusuf', score: 98, posts: 15, views: 89, time: '4.2 hrs/wk' },
  { name: 'Aisha Mohamed', score: 95, posts: 12, views: 76, time: '3.8 hrs/wk' },
  { name: 'Ibrahim Ahmed', score: 92, posts: 10, views: 71, time: '3.5 hrs/wk' },
  { name: 'Omar Khalid', score: 87, posts: 8, views: 65, time: '3.1 hrs/wk' },
  { name: 'Ahmad Hassan', score: 84, posts: 7, views: 58, time: '2.9 hrs/wk' },
];

const lowEngaged = [
  { name: 'Sara Hassan', score: 32, daysSinceLogin: 7, course: 'Hadith Studies' },
  { name: 'Yusuf Ibrahim', score: 28, daysSinceLogin: 10, course: 'Hadith Studies' },
  { name: 'Fatima Ali', score: 35, daysSinceLogin: 5, course: 'Arabic Grammar' },
];

export default function TeacherEngagementPage() {
  return (
    <TeacherLayout title="Student Engagement" subtitle="Track how students interact with course content">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="fiqh">Fiqh of Worship</SelectItem>
              <SelectItem value="hadith">Hadith Studies</SelectItem>
              <SelectItem value="arabic">Arabic Grammar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {engagementMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof metric.value === 'number' && metric.total
                      ? `${metric.value}/${metric.total}`
                      : metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${index === 0 ? 'bg-indigo-100' : index === 1 ? 'bg-emerald-100' : index === 2 ? 'bg-purple-100' : 'bg-amber-100'}`}>
                  {index === 0 ? <Users className="h-6 w-6 text-indigo-600" /> :
                   index === 1 ? <Clock className="h-6 w-6 text-emerald-600" /> :
                   index === 2 ? <MessageSquare className="h-6 w-6 text-purple-600" /> :
                   <Eye className="h-6 w-6 text-amber-600" />}
                </div>
              </div>
              <p className={`text-xs mt-2 flex items-center ${metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {metric.trend === 'up'
                  ? <TrendingUp className="h-3 w-3 mr-1" />
                  : <TrendingDown className="h-3 w-3 mr-1" />}
                {metric.change} vs last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Engagement Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Course Engagement Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courseEngagement.map((course, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{course.course}</h3>
                      <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                        <Heart className="h-3 w-3 mr-1" /> {course.satisfaction}% satisfaction
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Active Students</p>
                        <p className="font-semibold">{course.activeStudents}/{course.totalStudents}</p>
                        <Progress value={(course.activeStudents / course.totalStudents) * 100} className="h-1 mt-1" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Avg Time</p>
                        <p className="font-semibold">{course.avgTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Discussions</p>
                        <p className="font-semibold">{course.discussions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Resource Views</p>
                        <p className="font-semibold">{course.resourceViews}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Engaged */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Most Engaged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topEngaged.map((student, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.time}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{student.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Engagement Alert */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-amber-700">
                <TrendingDown className="h-5 w-5" />
                Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowEngaged.map((student, index) => (
                  <div key={index} className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.course}</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Last login: {student.daysSinceLogin} days ago
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}
