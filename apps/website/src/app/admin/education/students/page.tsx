'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Users, Search, Download, TrendingUp,
  TrendingDown, BookOpen, Award, ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

const mockStudents = [
  { id: '1', name: 'Aisha Mohamed', email: 'aisha@student.attaqwa.edu', ageTier: 'Youth', courses: 3, completion: 92, avgScore: 88, status: 'active', lastActive: '2 hours ago' },
  { id: '2', name: 'Ahmad Hassan', email: 'ahmad@student.attaqwa.edu', ageTier: 'Youth', courses: 2, completion: 78, avgScore: 75, status: 'active', lastActive: '1 day ago' },
  { id: '3', name: 'Fatima Ali', email: 'fatima@student.attaqwa.edu', ageTier: 'Adults', courses: 4, completion: 31, avgScore: 65, status: 'at-risk', lastActive: '5 days ago' },
  { id: '4', name: 'Ibrahim Ahmed', email: 'ibrahim@student.attaqwa.edu', ageTier: 'Youth', courses: 3, completion: 85, avgScore: 90, status: 'active', lastActive: '5 hours ago' },
  { id: '5', name: 'Sara Hassan', email: 'sara@student.attaqwa.edu', ageTier: 'Children', courses: 2, completion: 45, avgScore: 70, status: 'at-risk', lastActive: '1 week ago' },
  { id: '6', name: 'Omar Khalid', email: 'omar@student.attaqwa.edu', ageTier: 'Adults', courses: 5, completion: 72, avgScore: 82, status: 'active', lastActive: '12 hours ago' },
  { id: '7', name: 'Maryam Yusuf', email: 'maryam@student.attaqwa.edu', ageTier: 'Youth', courses: 3, completion: 95, avgScore: 95, status: 'active', lastActive: '1 hour ago' },
  { id: '8', name: 'Omar Mahmoud', email: 'omar.m@student.attaqwa.edu', ageTier: 'Adults', courses: 2, completion: 18, avgScore: 55, status: 'inactive', lastActive: '2 weeks ago' },
];

export default function AdminEducationStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = mockStudents.filter(s => s.status === 'active').length;
  const atRiskCount = mockStudents.filter(s => s.status === 'at-risk').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Education Students</h1>
          <p className="text-gray-600 mt-1">Monitor student progress across Islamic education programs</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold">{mockStudents.length}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Learners</p>
                <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">At Risk</p>
                <p className="text-2xl font-bold text-amber-600">{atRiskCount}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Completion</p>
                <p className="text-2xl font-bold">
                  {Math.round(mockStudents.reduce((s, st) => s + st.completion, 0) / mockStudents.length)}%
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>{filtered.length} Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Student</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Age Tier</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Courses</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Progress</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Avg Score</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Last Active</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{student.ageTier}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        {student.courses}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 w-32">
                        <Progress value={student.completion} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{student.completion}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{student.avgScore}%</td>
                    <td className="px-4 py-3">
                      <Badge className={
                        student.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        student.status === 'at-risk' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {student.status}
                      </Badge>
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
    </div>
  );
}
