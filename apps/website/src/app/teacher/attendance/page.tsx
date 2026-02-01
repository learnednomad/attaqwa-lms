'use client';

import React from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, CheckCircle2, XCircle, Clock,
  Download, Calendar
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const classAttendance = [
  {
    className: 'Fiqh of Worship - Section A',
    date: '2025-01-27',
    total: 24,
    present: 21,
    absent: 2,
    late: 1,
    students: [
      { name: 'Aisha Mohamed', status: 'present' },
      { name: 'Ahmad Hassan', status: 'present' },
      { name: 'Fatima Ali', status: 'absent' },
      { name: 'Ibrahim Ahmed', status: 'present' },
      { name: 'Sara Hassan', status: 'late' },
      { name: 'Omar Khalid', status: 'present' },
      { name: 'Maryam Yusuf', status: 'present' },
      { name: 'Yusuf Ibrahim', status: 'absent' },
    ],
  },
  {
    className: 'Hadith Studies - Section B',
    date: '2025-01-27',
    total: 18,
    present: 16,
    absent: 1,
    late: 1,
    students: [
      { name: 'Khadija Omar', status: 'present' },
      { name: 'Ali Mustafa', status: 'present' },
      { name: 'Zainab Ahmed', status: 'late' },
      { name: 'Hassan Ali', status: 'absent' },
    ],
  },
];

const statusColors: Record<string, string> = {
  present: 'bg-emerald-100 text-emerald-700',
  absent: 'bg-red-100 text-red-700',
  late: 'bg-amber-100 text-amber-700',
};

const statusIcons: Record<string, React.ElementType> = {
  present: CheckCircle2,
  absent: XCircle,
  late: Clock,
};

export default function TeacherAttendancePage() {
  return (
    <TeacherLayout title="Attendance" subtitle="Track and manage class attendance records">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Select defaultValue="today">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="fiqh-a">Fiqh - Section A</SelectItem>
              <SelectItem value="hadith-b">Hadith - Section B</SelectItem>
              <SelectItem value="arabic">Arabic Grammar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
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
                <p className="text-sm text-gray-500">Present Today</p>
                <p className="text-2xl font-bold text-emerald-600">37</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Absent Today</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Late Arrivals</p>
                <p className="text-2xl font-bold text-amber-600">2</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Attendance Cards */}
      <div className="space-y-6">
        {classAttendance.map((cls, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">{cls.className}</CardTitle>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4" /> {cls.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                    {cls.present} Present
                  </Badge>
                  <Badge variant="outline" className="border-red-200 text-red-700">
                    {cls.absent} Absent
                  </Badge>
                  <Badge variant="outline" className="border-amber-200 text-amber-700">
                    {cls.late} Late
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {cls.students.map((student, sIndex) => {
                  const StatusIcon = statusIcons[student.status];
                  return (
                    <div
                      key={sIndex}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <StatusIcon className={`h-5 w-5 ${
                        student.status === 'present' ? 'text-emerald-500' :
                        student.status === 'absent' ? 'text-red-500' :
                        'text-amber-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <Badge className={`text-xs ${statusColors[student.status]}`}>
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TeacherLayout>
  );
}
