'use client';

import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search, Filter, MoreVertical, Clock, CheckCircle, XCircle,
  Loader2, AlertCircle, FileText, PenTool, Eye, MessageSquare,
  ChevronRight, Star, Award
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface SubmissionData {
  id: number;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  assignmentTitle: string;
  course: string;
  submittedAt: string;
  status: 'pending' | 'graded' | 'returned';
  grade?: number;
  feedback?: string;
  fileUrl?: string;
}

interface QuizResultData {
  id: number;
  studentName: string;
  studentEmail: string;
  quizTitle: string;
  course: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: string;
}


export default function TeacherGradesPage() {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  useEffect(() => {
    // Fetch real submissions when the grading API is available
    setSubmissions([]);
    setQuizResults([]);
    setLoading(false);
  }, []);

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const gradedSubmissions = submissions.filter(s => s.status === 'graded' || s.status === 'returned');
  const uniqueCourses = [...new Set([...submissions.map(s => s.course), ...quizResults.map(q => q.course)])];

  const filteredPending = pendingSubmissions.filter(s => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || s.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const filteredGraded = gradedSubmissions.filter(s => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || s.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const filteredQuizzes = quizResults.filter(q => {
    const matchesSearch = q.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.quizTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || q.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const handleOpenGrading = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
    setGradeInput(submission.grade?.toString() || '');
    setFeedbackInput(submission.feedback || '');
    setGradingDialogOpen(true);
  };

  const handleSubmitGrade = () => {
    if (!selectedSubmission) return;

    const grade = parseInt(gradeInput);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      alert('Please enter a valid grade between 0 and 100');
      return;
    }

    setSubmissions(prev => prev.map(s =>
      s.id === selectedSubmission.id
        ? { ...s, status: 'graded', grade, feedback: feedbackInput }
        : s
    ));

    setGradingDialogOpen(false);
    setSelectedSubmission(null);
    setGradeInput('');
    setFeedbackInput('');
  };

  if (loading) {
    return (
      <TeacherLayout title="Grades & Assessment" subtitle="Review and grade student work">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-islamic-green-600" />
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Grades & Assessment" subtitle="Review and grade student work">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingSubmissions.length}</p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{gradedSubmissions.length}</p>
                <p className="text-sm text-gray-500">Graded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-islamic-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-islamic-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{quizResults.length}</p>
                <p className="text-sm text-gray-500">Quiz Results</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {quizResults.length > 0
                    ? Math.round(quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length)
                    : 0}%
                </p>
                <p className="text-sm text-gray-500">Avg Quiz Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students or assignments..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {uniqueCourses.map(course => (
                <SelectItem key={course} value={course}>{course}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending ({filteredPending.length})
          </TabsTrigger>
          <TabsTrigger value="graded" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Graded ({filteredGraded.length})
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="gap-2">
            <FileText className="h-4 w-4" />
            Quiz Results ({filteredQuizzes.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Submissions */}
        <TabsContent value="pending">
          <div className="space-y-4">
            {filteredPending.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-500">No pending submissions to review</p>
              </Card>
            ) : (
              filteredPending.map((submission) => (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={submission.studentAvatar} />
                          <AvatarFallback className="bg-islamic-green-100 text-islamic-green-700">
                            {submission.studentName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{submission.assignmentTitle}</h3>
                          <p className="text-sm text-gray-600">{submission.studentName}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{submission.course}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" /> {submission.submittedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-islamic-green-600 hover:bg-islamic-green-700"
                          onClick={() => handleOpenGrading(submission)}
                        >
                          <PenTool className="h-4 w-4 mr-1" /> Grade
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Graded Submissions */}
        <TabsContent value="graded">
          <div className="space-y-4">
            {filteredGraded.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No graded submissions</h3>
                <p className="text-gray-500">Grade some pending submissions to see them here</p>
              </Card>
            ) : (
              filteredGraded.map((submission) => (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={submission.studentAvatar} />
                          <AvatarFallback className="bg-islamic-green-100 text-islamic-green-700">
                            {submission.studentName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{submission.assignmentTitle}</h3>
                          <p className="text-sm text-gray-600">{submission.studentName}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{submission.course}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" /> {submission.submittedAt}
                            </span>
                          </div>
                          {submission.feedback && (
                            <p className="mt-2 text-sm text-gray-600 italic">&quot;{submission.feedback}&quot;</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl font-bold ${
                          (submission.grade || 0) >= 80 ? 'text-emerald-600' :
                          (submission.grade || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {submission.grade}%
                        </div>
                        <Badge className={
                          submission.status === 'graded' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-amber-100 text-amber-700'
                        }>
                          {submission.status === 'graded' ? 'Graded' : 'Returned'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Quiz Results */}
        <TabsContent value="quizzes">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Student</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Quiz</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Course</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Score</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Questions</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Time</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredQuizzes.map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-islamic-green-100 text-islamic-green-700 text-xs">
                                {quiz.studentName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{quiz.studentName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{quiz.quizTitle}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{quiz.course}</td>
                        <td className="px-4 py-3">
                          <span className={`font-bold ${
                            quiz.score >= 80 ? 'text-emerald-600' :
                            quiz.score >= 60 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {quiz.score}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {quiz.correctAnswers}/{quiz.totalQuestions}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{quiz.timeSpent}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{quiz.completedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredQuizzes.length === 0 && (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz results</h3>
                  <p className="text-gray-500">Quiz results will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Grading Dialog */}
      <Dialog open={gradingDialogOpen} onOpenChange={setGradingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">{selectedSubmission.assignmentTitle}</p>
                <p className="text-sm text-gray-600">{selectedSubmission.studentName}</p>
                <p className="text-sm text-gray-500">{selectedSubmission.course}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade (0-100)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  placeholder="Enter grade..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback (Optional)
                </label>
                <Textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Provide feedback to the student..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setGradingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitGrade} className="bg-islamic-green-600 hover:bg-islamic-green-700">
              Submit Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  );
}
