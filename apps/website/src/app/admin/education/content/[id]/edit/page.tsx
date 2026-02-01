'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Trash2, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

// Mock data simulating fetched content
const mockContent = {
  id: '1',
  title: 'Introduction to Quran',
  description: 'A comprehensive introduction to Quran recitation and understanding for beginners.',
  subject: 'quran',
  type: 'lesson',
  ageTier: 'children',
  difficulty: 'beginner',
  status: 'Published',
  body: 'The Quran is the holy book of Islam, revealed to Prophet Muhammad (peace be upon him) over a period of 23 years.\n\nIn this lesson, we will cover:\n1. The importance of learning Quran\n2. Basic etiquette of handling the Quran\n3. Introduction to Arabic letters\n4. The significance of Surah Al-Fatiha',
  students: 24,
  avgScore: 88,
  createdAt: '2024-01-15',
  updatedAt: '2025-01-20',
};

export default function AdminEditContentPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
            <p className="text-gray-600 mt-1">Modify existing educational content</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" /> Preview
          </Button>
          <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>Edit basic information about the content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" defaultValue={mockContent.title} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  defaultValue={mockContent.description}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subject</Label>
                  <Select defaultValue={mockContent.subject}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quran">Quran</SelectItem>
                      <SelectItem value="hadith">Hadith</SelectItem>
                      <SelectItem value="fiqh">Fiqh</SelectItem>
                      <SelectItem value="seerah">Seerah</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                      <SelectItem value="aqidah">Aqidah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Content Type</Label>
                  <Select defaultValue={mockContent.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lesson">Lesson</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Age Tier</Label>
                  <Select defaultValue={mockContent.ageTier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Children (5-10)</SelectItem>
                      <SelectItem value="youth">Youth (11-17)</SelectItem>
                      <SelectItem value="adults">Adults (18+)</SelectItem>
                      <SelectItem value="all">All Ages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Difficulty Level</Label>
                  <Select defaultValue={mockContent.difficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Body */}
          <Card>
            <CardHeader>
              <CardTitle>Content Body</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[300px] px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                defaultValue={mockContent.body}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Current Status</span>
                <Badge className="bg-green-100 text-green-700">{mockContent.status}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Students</span>
                <span className="text-sm font-medium">{mockContent.students}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Avg Score</span>
                <span className="text-sm font-medium">{mockContent.avgScore}%</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1 mt-2">
                <p>Created: {mockContent.createdAt}</p>
                <p>Last updated: {mockContent.updatedAt}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-islamic-green-600 hover:bg-islamic-green-700">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
              <Button variant="outline" className="w-full">
                Unpublish
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" /> Delete Content
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
