'use client';

import React, { useState } from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Clock, CheckCircle2, AlertCircle, Upload, Calendar } from 'lucide-react';

const assignments = [
  {
    id: 1,
    title: 'Surah An-Naba Recitation',
    course: 'Quran Memorization',
    dueDate: '2024-12-15',
    status: 'pending',
    type: 'Recitation',
    points: 100,
  },
  {
    id: 2,
    title: 'Fiqh of Salah Essay',
    course: 'Islamic Studies - Fiqh',
    dueDate: '2024-12-18',
    status: 'pending',
    type: 'Essay',
    points: 50,
  },
  {
    id: 3,
    title: 'Arabic Verb Conjugation Worksheet',
    course: 'Arabic Language',
    dueDate: '2024-12-14',
    status: 'pending',
    type: 'Worksheet',
    points: 30,
  },
  {
    id: 4,
    title: 'Hadith Analysis Paper',
    course: 'Hadith Studies',
    dueDate: '2024-12-20',
    status: 'pending',
    type: 'Research',
    points: 75,
  },
  {
    id: 5,
    title: 'Surah Al-Mulk Memorization',
    course: 'Quran Memorization',
    dueDate: '2024-12-10',
    status: 'submitted',
    submittedDate: '2024-12-09',
    type: 'Recitation',
    points: 100,
    earnedPoints: 95,
  },
  {
    id: 6,
    title: 'Wudu Practical Assessment',
    course: 'Islamic Studies - Fiqh',
    dueDate: '2024-12-08',
    status: 'graded',
    submittedDate: '2024-12-07',
    type: 'Practical',
    points: 50,
    earnedPoints: 48,
    feedback: 'Excellent demonstration of wudu steps. Minor improvement needed in sequence.',
  },
  {
    id: 7,
    title: 'Arabic Reading Comprehension',
    course: 'Arabic Language',
    dueDate: '2024-12-05',
    status: 'graded',
    submittedDate: '2024-12-05',
    type: 'Quiz',
    points: 40,
    earnedPoints: 36,
    feedback: 'Good understanding. Practice more vocabulary.',
  },
  {
    id: 8,
    title: 'Seerah Timeline Project',
    course: 'Seerah Studies',
    dueDate: '2024-12-01',
    status: 'late',
    type: 'Project',
    points: 100,
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  submitted: 'bg-blue-100 text-blue-700',
  graded: 'bg-emerald-100 text-emerald-700',
  late: 'bg-red-100 text-red-700',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  submitted: <Upload className="h-4 w-4" />,
  graded: <CheckCircle2 className="h-4 w-4" />,
  late: <AlertCircle className="h-4 w-4" />,
};

export default function AssignmentsPage() {
  const [filter, setFilter] = useState('all');

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');
  const gradedAssignments = assignments.filter(a => a.status === 'graded');

  return (
    <StudentLayout title="Assignments" subtitle="Track and submit your coursework">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingAssignments.length}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{submittedAssignments.length}</p>
                <p className="text-sm text-gray-500">Submitted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{gradedAssignments.length}</p>
                <p className="text-sm text-gray-500">Graded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{assignments.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({gradedAssignments.length})</TabsTrigger>
          <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAssignments.map((assignment) => {
                  const daysRemaining = getDaysRemaining(assignment.dueDate);
                  return (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                          <p className="text-sm text-gray-500">{assignment.course}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            <Badge variant="outline">{assignment.type}</Badge>
                            <span className="text-gray-500">{assignment.points} points</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={daysRemaining <= 2 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                          {daysRemaining <= 0 ? 'Overdue' : `${daysRemaining} days left`}
                        </Badge>
                        <Button className="mt-2 bg-emerald-600 hover:bg-emerald-700">Submit</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submitted">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submittedAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Upload className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-gray-500">Submitted: {new Date(assignment.submittedDate!).toLocaleDateString()}</span>
                          <Badge variant="outline">{assignment.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Awaiting Grade</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graded">
          <Card>
            <CardHeader>
              <CardTitle>Graded Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradedAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-xl hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                          <p className="text-sm text-gray-500">{assignment.course}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <Badge variant="outline">{assignment.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">{assignment.earnedPoints}/{assignment.points}</p>
                        <p className="text-sm text-gray-500">{((assignment.earnedPoints! / assignment.points) * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    {assignment.feedback && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600"><strong>Feedback:</strong> {assignment.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Assignment</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Course</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Due Date</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Points</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr key={assignment.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{assignment.title}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{assignment.course}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{assignment.type}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 text-center">
                          {assignment.earnedPoints !== undefined ? `${assignment.earnedPoints}/${assignment.points}` : assignment.points}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={statusColors[assignment.status]}>
                            <span className="flex items-center gap-1">
                              {statusIcons[assignment.status]}
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </span>
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </StudentLayout>
  );
}
