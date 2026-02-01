'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Printer, Mail, Award, GraduationCap, Calendar } from 'lucide-react';

const studentInfo = {
  name: 'Ahmed Hassan',
  studentId: 'STU2024001',
  program: 'Islamic Studies Certificate',
  enrollmentDate: 'January 2023',
  expectedGraduation: 'December 2025',
  status: 'Active',
  advisor: 'Sheikh Abdullah Rahman',
};

const transcriptData = [
  {
    semester: 'Fall 2024',
    status: 'In Progress',
    courses: [
      { code: 'QUR-301', name: 'Quran Memorization - Juz 30', credits: 4, grade: 'IP', points: '-' },
      { code: 'FIQ-201', name: 'Islamic Jurisprudence (Fiqh)', credits: 4, grade: 'IP', points: '-' },
      { code: 'ARB-202', name: 'Arabic Language - Level 2', credits: 4, grade: 'IP', points: '-' },
      { code: 'HAD-301', name: 'Hadith Studies', credits: 3, grade: 'IP', points: '-' },
    ],
    gpa: '-',
    totalCredits: 15,
  },
  {
    semester: 'Spring 2024',
    status: 'Completed',
    courses: [
      { code: 'TAJ-101', name: 'Tajweed Fundamentals', credits: 3, grade: 'A', points: 12.0 },
      { code: 'SIR-201', name: 'Seerah of the Prophet', credits: 4, grade: 'A', points: 16.0 },
      { code: 'ARB-101', name: 'Arabic Language - Level 1', credits: 4, grade: 'A-', points: 14.8 },
      { code: 'ETH-101', name: 'Islamic Ethics', credits: 3, grade: 'A', points: 12.0 },
    ],
    gpa: 3.91,
    totalCredits: 14,
  },
  {
    semester: 'Fall 2023',
    status: 'Completed',
    courses: [
      { code: 'ISL-101', name: 'Introduction to Islam', credits: 3, grade: 'A', points: 12.0 },
      { code: 'QUR-101', name: 'Quran Reading Basics', credits: 3, grade: 'B+', points: 9.9 },
      { code: 'HIS-101', name: 'Islamic History', credits: 4, grade: 'A-', points: 14.8 },
    ],
    gpa: 3.67,
    totalCredits: 10,
  },
];

const gradeScale = [
  { grade: 'A', points: '4.00', range: '90-100%' },
  { grade: 'A-', points: '3.70', range: '87-89%' },
  { grade: 'B+', points: '3.30', range: '83-86%' },
  { grade: 'B', points: '3.00', range: '80-82%' },
  { grade: 'B-', points: '2.70', range: '77-79%' },
  { grade: 'C+', points: '2.30', range: '73-76%' },
  { grade: 'C', points: '2.00', range: '70-72%' },
  { grade: 'F', points: '0.00', range: 'Below 70%' },
];

export default function TranscriptPage() {
  const totalCreditsEarned = transcriptData
    .filter(s => s.status === 'Completed')
    .reduce((sum, s) => sum + s.totalCredits, 0);

  const cumulativeGPA = 3.77;

  return (
    <StudentLayout title="Official Transcript" subtitle="Your complete academic record">
      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Request Official Copy
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Transcript */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info Header */}
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{studentInfo.name}</h2>
                    <p className="text-gray-500">Student ID: {studentInfo.studentId}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">{studentInfo.status}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium">{studentInfo.program}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Enrolled</p>
                  <p className="font-medium">{studentInfo.enrollmentDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Graduation</p>
                  <p className="font-medium">{studentInfo.expectedGraduation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Advisor</p>
                  <p className="font-medium">{studentInfo.advisor}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Semester Records */}
          {transcriptData.map((semester) => (
            <Card key={semester.semester}>
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-lg">{semester.semester}</CardTitle>
                  </div>
                  <Badge className={semester.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}>
                    {semester.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Code</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Course Name</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Credits</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Grade</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.courses.map((course) => (
                      <tr key={course.code} className="border-b last:border-b-0">
                        <td className="py-3 px-4 text-sm font-mono text-gray-600">{course.code}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{course.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 text-center">{course.credits}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className={course.grade === 'IP' ? 'bg-blue-50' : ''}>
                            {course.grade}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 text-center">{course.points}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-medium">
                      <td colSpan={2} className="py-3 px-4 text-sm text-gray-900">Semester Totals</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-center">{semester.totalCredits}</td>
                      <td colSpan={2} className="py-3 px-4 text-sm text-emerald-600 text-center">
                        GPA: {semester.gpa}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>
          ))}

          {/* Cumulative Summary */}
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cumulative Record</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{totalCreditsEarned}</p>
                  <p className="text-sm text-gray-600">Credits Earned</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{cumulativeGPA}</p>
                  <p className="text-sm text-gray-600">Cumulative GPA</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">15</p>
                  <p className="text-sm text-gray-600">Credits In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5" />
                Academic Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Cumulative GPA</span>
                <span className="font-bold text-emerald-600">{cumulativeGPA}/4.00</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Credits Completed</span>
                <span className="font-bold">{totalCreditsEarned}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Credits In Progress</span>
                <span className="font-bold">15</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Credits Required</span>
                <span className="font-bold">144</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="font-bold text-emerald-600">{Math.round((totalCreditsEarned / 144) * 100)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Grade Scale */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Grading Scale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left text-gray-500">Grade</th>
                    <th className="py-2 text-center text-gray-500">Points</th>
                    <th className="py-2 text-right text-gray-500">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeScale.map((row) => (
                    <tr key={row.grade} className="border-b last:border-b-0">
                      <td className="py-2 font-medium">{row.grade}</td>
                      <td className="py-2 text-center text-gray-600">{row.points}</td>
                      <td className="py-2 text-right text-gray-600">{row.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> This is an unofficial transcript for student reference only.
                For official transcripts, please submit a request through the Documents office.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
