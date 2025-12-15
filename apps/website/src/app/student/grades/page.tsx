'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Award, BookOpen } from 'lucide-react';

const semesterGrades = [
  {
    semester: 'Fall 2024',
    gpa: 3.75,
    courses: [
      { name: 'Quran Memorization - Juz 30', grade: 'A', credits: 4, score: 88 },
      { name: 'Islamic Studies - Fiqh', grade: 'B+', credits: 4, score: 82 },
      { name: 'Arabic Language - Level 2', grade: 'A', credits: 4, score: 90 },
      { name: 'Hadith Studies', grade: 'A-', credits: 3, score: 86 },
    ],
  },
  {
    semester: 'Spring 2024',
    gpa: 3.85,
    courses: [
      { name: 'Tajweed Fundamentals', grade: 'A', credits: 3, score: 95 },
      { name: 'Seerah of the Prophet', grade: 'A', credits: 4, score: 92 },
      { name: 'Arabic Language - Level 1', grade: 'A-', credits: 4, score: 88 },
      { name: 'Islamic Ethics', grade: 'A', credits: 3, score: 91 },
    ],
  },
  {
    semester: 'Fall 2023',
    gpa: 3.70,
    courses: [
      { name: 'Introduction to Islam', grade: 'A', credits: 3, score: 94 },
      { name: 'Quran Reading Basics', grade: 'B+', credits: 3, score: 85 },
      { name: 'Islamic History', grade: 'A-', credits: 4, score: 87 },
    ],
  },
];

const gradePoints: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

const gradeColors: Record<string, string> = {
  'A+': 'bg-emerald-100 text-emerald-700',
  'A': 'bg-emerald-100 text-emerald-700',
  'A-': 'bg-emerald-100 text-emerald-700',
  'B+': 'bg-blue-100 text-blue-700',
  'B': 'bg-blue-100 text-blue-700',
  'B-': 'bg-blue-100 text-blue-700',
  'C+': 'bg-amber-100 text-amber-700',
  'C': 'bg-amber-100 text-amber-700',
  'C-': 'bg-amber-100 text-amber-700',
  'D+': 'bg-orange-100 text-orange-700',
  'D': 'bg-orange-100 text-orange-700',
  'F': 'bg-red-100 text-red-700',
};

export default function GradesPage() {
  const totalCredits = semesterGrades.flatMap(s => s.courses).reduce((sum, c) => sum + c.credits, 0);
  const cumulativeGPA = 3.77;

  return (
    <StudentLayout title="Grades & Transcript" subtitle="View your academic performance">
      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cumulativeGPA}</p>
                <p className="text-sm text-gray-500">Cumulative GPA</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCredits}</p>
                <p className="text-sm text-gray-500">Total Credits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{semesterGrades[0].gpa}</p>
                <p className="text-sm text-gray-500">Current Semester</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">-0.10</p>
                <p className="text-sm text-gray-500">GPA Change</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GPA Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>GPA Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Cumulative GPA: {cumulativeGPA}/4.0</span>
                <span className="text-sm text-gray-500">{((cumulativeGPA / 4.0) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(cumulativeGPA / 4.0) * 100} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              {semesterGrades.map((sem) => (
                <div key={sem.semester} className="text-center">
                  <p className="text-sm text-gray-500">{sem.semester}</p>
                  <p className="text-xl font-bold text-emerald-600">{sem.gpa}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semester Grades */}
      {semesterGrades.map((semester) => (
        <Card key={semester.semester} className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{semester.semester}</CardTitle>
              <Badge className="bg-emerald-100 text-emerald-700">GPA: {semester.gpa}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Course</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Credits</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Score</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Grade</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.courses.map((course, index) => (
                    <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{course.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-center">{course.credits}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-center">{course.score}%</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={gradeColors[course.grade]}>{course.grade}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-center">
                        {(gradePoints[course.grade] * course.credits).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">Total</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 text-center">
                      {semester.courses.reduce((sum, c) => sum + c.credits, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 text-center">
                      {(semester.courses.reduce((sum, c) => sum + c.score, 0) / semester.courses.length).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4 text-sm font-medium text-emerald-600 text-center">
                      {semester.courses.reduce((sum, c) => sum + gradePoints[c.grade] * c.credits, 0).toFixed(1)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </StudentLayout>
  );
}
