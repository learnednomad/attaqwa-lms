'use client';

import React, { useState } from 'react';
import { FeatureFlagService } from '@attaqwa/shared/feature-flags';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';

// Mock admin data
const adminStats = {
  totalContent: 126,
  totalStudents: 248,
  averageCompletion: 73,
  certificatesIssued: 45,
  newStudentsThisMonth: 28,
  contentCreatedThisMonth: 12
};

const recentContent = [
  {
    id: '1',
    title: 'Introduction to Quran',
    subject: 'Quran',
    ageTier: 'Children',
    type: 'Lesson',
    status: 'Published',
    students: 24,
    avgScore: 88,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Five Pillars Quiz',
    subject: 'Aqidah',
    ageTier: 'Youth',
    type: 'Quiz',
    status: 'Published',
    students: 31,
    avgScore: 85,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Prayer Fundamentals',
    subject: 'Worship',
    ageTier: 'All Ages',
    type: 'Video',
    status: 'Draft',
    students: 0,
    avgScore: null,
    createdAt: '2024-01-08'
  },
  {
    id: '4',
    title: 'Stories of Prophets',
    subject: 'Seerah',
    ageTier: 'Children',
    type: 'Audio',
    status: 'Published',
    students: 18,
    avgScore: 92,
    createdAt: '2024-01-05'
  }
];

const topPerformingContent = [
  { title: 'Prayer Fundamentals', completionRate: 95, students: 45 },
  { title: 'Quran Basics', completionRate: 88, students: 38 },
  { title: 'Islamic Ethics', completionRate: 82, students: 29 },
  { title: 'Hadith Studies', completionRate: 79, students: 33 }
];

const strugglingStudents = [
  { name: 'Ahmed Hassan', completion: 23, lastActive: '3 days ago', struggling: 'Quran' },
  { name: 'Fatima Ali', completion: 31, lastActive: '5 days ago', struggling: 'Fiqh' },
  { name: 'Omar Mahmoud', completion: 18, lastActive: '1 week ago', struggling: 'Arabic' }
];

export default function AdminEducationPage() {
  // Feature flag protection
  if (!FeatureFlagService.canAccessEducationAdmin()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-islamic-navy-800 mb-4">Education Management</h1>
          <div className="bg-islamic-gold-50 border border-islamic-gold-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-islamic-gold-800 mb-2">🚧 Under Development</h2>
            <p className="text-islamic-gold-700">Admin education management is being enhanced.</p>
          </div>
          <Link href="/admin"><Button className="bg-islamic-green-600 hover:bg-islamic-green-700">Return to Admin Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    const colors = {
      'Published': 'bg-green-100 text-green-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Archived': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-islamic-navy-800">Education Management</h1>
          <p className="text-gray-600 mt-2">
            Manage Islamic educational content, monitor student progress, and track learning outcomes.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/admin/education/content/new">
            <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </Link>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-3xl font-bold text-islamic-navy-800">{adminStats.totalContent}</p>
                <p className="text-sm text-green-600">+{adminStats.contentCreatedThisMonth} this month</p>
              </div>
              <BookOpen className="h-8 w-8 text-islamic-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-3xl font-bold text-islamic-navy-800">{adminStats.totalStudents}</p>
                <p className="text-sm text-green-600">+{adminStats.newStudentsThisMonth} new</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                <p className="text-3xl font-bold text-islamic-navy-800">{adminStats.averageCompletion}%</p>
                <p className="text-sm text-green-600">+5% improvement</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
                <p className="text-3xl font-bold text-islamic-navy-800">{adminStats.certificatesIssued}</p>
                <p className="text-sm text-green-600">+8 this month</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Content</CardTitle>
                <div className="flex gap-2">
                  <Link href="/admin/education/content">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-islamic-navy-800 mb-1">
                        {content.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline" className="text-xs">
                          {content.subject}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {content.ageTier}
                        </Badge>
                        <Badge className={getStatusColor(content.status)}>
                          {content.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{content.students} students</span>
                        {content.avgScore && <span>Avg score: {content.avgScore}%</span>}
                        <span>Created {content.createdAt}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/education/content/${content.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Performing Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformingContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-islamic-navy-800">
                        {content.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {content.students} students
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        {content.completionRate}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Students Needing Help */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Students Needing Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strugglingStudents.map((student, index) => (
                  <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm text-islamic-navy-800">
                        {student.name}
                      </p>
                      <Badge variant="outline" className="text-xs text-orange-600">
                        {student.completion}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      Struggling with: {student.struggling}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last active: {student.lastActive}
                    </p>
                  </div>
                ))}
              </div>
              
              <Link href="/admin/education/students">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Students
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/admin/education/content/new">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Lesson
                  </Button>
                </Link>
                
                <Link href="/admin/education/quiz/new">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Quiz
                  </Button>
                </Link>
                
                <Link href="/admin/education/analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}