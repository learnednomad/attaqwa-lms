'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Trash2, ArrowLeft, Save,
  GripVertical, CheckCircle2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correctAnswer: string;
}

export default function AdminNewQuizPage() {
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', type: 'multiple_choice', options: ['', '', '', ''], correctAnswer: '' },
  ]);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { id: String(prev.length + 1), text: '', type: 'multiple_choice', options: ['', '', '', ''], correctAnswer: '' },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/education">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
            <p className="text-gray-600 mt-1">Build an assessment for your educational content</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
            <Save className="h-4 w-4 mr-2" /> Publish Quiz
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Basic information about the quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input id="title" placeholder="e.g., Fiqh of Salah - Midterm Quiz" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Describe what this quiz covers..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Associated Course</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiqh">Fiqh of Worship</SelectItem>
                      <SelectItem value="hadith">Hadith Studies</SelectItem>
                      <SelectItem value="arabic">Arabic Grammar</SelectItem>
                      <SelectItem value="seerah">Seerah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Age Tier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Children (5-10)</SelectItem>
                      <SelectItem value="youth">Youth (11-17)</SelectItem>
                      <SelectItem value="adults">Adults (18+)</SelectItem>
                      <SelectItem value="all">All Ages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Questions ({questions.length})</CardTitle>
                <Button variant="outline" size="sm" onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-2" /> Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, qIndex) => (
                <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-5 w-5 text-gray-400 mt-2 cursor-grab" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Question {qIndex + 1}</Badge>
                        <div className="flex items-center gap-2">
                          <Select defaultValue={question.type}>
                            <SelectTrigger className="w-40 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                              <SelectItem value="true_false">True/False</SelectItem>
                              <SelectItem value="short_answer">Short Answer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Input placeholder="Enter your question..." />
                      <div className="space-y-2">
                        {question.options.map((_, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-gray-300 hover:text-emerald-500 cursor-pointer" />
                            <Input placeholder={`Option ${oIndex + 1}`} className="flex-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quiz Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Time Limit (minutes)</Label>
                <Input type="number" defaultValue="30" />
              </div>
              <div>
                <Label>Passing Score (%)</Label>
                <Input type="number" defaultValue="70" />
              </div>
              <div>
                <Label>Max Attempts</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 attempt</SelectItem>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Shuffle Questions</Label>
                <Select defaultValue="yes">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className="bg-yellow-100 text-yellow-700">Draft</Badge>
              </div>
              <Button className="w-full bg-islamic-green-600 hover:bg-islamic-green-700">
                Publish Quiz
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Publication
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
