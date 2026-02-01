'use client';

import React from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3, TrendingUp, TrendingDown, Users,
  Download, Search, ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const studentProgress = [
  { name: 'Aisha Mohamed', course: 'Fiqh of Worship', progress: 92, grade: 'A', trend: 'up', lastActive: '2 hours ago' },
  { name: 'Ahmad Hassan', course: 'Hadith Studies', progress: 78, grade: 'B+', trend: 'up', lastActive: '1 day ago' },
  { name: 'Fatima Ali', course: 'Arabic Grammar Level 2', progress: 65, grade: 'B', trend: 'down', lastActive: '3 days ago' },
  { name: 'Ibrahim Ahmed', course: 'Fiqh of Worship', progress: 88, grade: 'A-', trend: 'up', lastActive: '5 hours ago' },
  { name: 'Sara Hassan', course: 'Hadith Studies', progress: 45, grade: 'C+', trend: 'down', lastActive: '1 week ago' },
  { name: 'Omar Khalid', course: 'Arabic Grammar Level 2', progress: 72, grade: 'B', trend: 'up', lastActive: '12 hours ago' },
  { name: 'Maryam Yusuf', course: 'Fiqh of Worship', progress: 95, grade: 'A+', trend: 'up', lastActive: '1 hour ago' },
  { name: 'Yusuf Ibrahim', course: 'Hadith Studies', progress: 58, grade: 'C+', trend: 'down', lastActive: '4 days ago' },
];

export default function TeacherProgressPage() {
  return (
    <TeacherLayout title="Progress Reports" subtitle="Monitor individual student progress and performance">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search students..." className="pl-9 w-64" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by course" />
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
          <Download className="h-4 w-4 mr-2" /> Export Reports
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">57</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">74%</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +5% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">On Track</p>
                <p className="text-2xl font-bold text-emerald-600">42</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Needs Attention</p>
                <p className="text-2xl font-bold text-amber-600">15</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <TrendingDown className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Student</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Course</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Progress</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Grade</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Trend</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Last Active</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentProgress.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                    <td className="px-4 py-3 text-gray-700">{student.course}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 w-40">
                        <Progress value={student.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium text-gray-700">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={
                        student.grade.startsWith('A') ? 'border-emerald-200 text-emerald-700' :
                        student.grade.startsWith('B') ? 'border-blue-200 text-blue-700' :
                        'border-amber-200 text-amber-700'
                      }>
                        {student.grade}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {student.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{student.lastActive}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
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
