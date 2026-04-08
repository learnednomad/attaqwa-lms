'use client';

import React, { useState } from 'react';
import { FeatureFlagService } from '@attaqwa/shared';
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
  Upload,
  AlertCircle
} from 'lucide-react';

export default function AdminEducationPage() {
  // Feature flag protection
  if (!FeatureFlagService.canAccessEducationAdmin()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-islamic-navy-800 mb-4">Education Management</h1>
          <div className="bg-islamic-gold-50 border border-islamic-gold-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-islamic-gold-800 mb-2">Under Development</h2>
            <p className="text-islamic-gold-700">Admin education management is being enhanced.</p>
          </div>
          <Link href="/admin"><Button className="bg-islamic-green-600 hover:bg-islamic-green-700">Return to Admin Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');

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
                <p className="text-3xl font-bold text-islamic-navy-800">--</p>
                <p className="text-sm text-gray-400">No data yet</p>
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
                <p className="text-3xl font-bold text-islamic-navy-800">--</p>
                <p className="text-sm text-gray-400">No data yet</p>
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
                <p className="text-3xl font-bold text-islamic-navy-800">--</p>
                <p className="text-sm text-gray-400">No data yet</p>
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
                <p className="text-3xl font-bold text-islamic-navy-800">--</p>
                <p className="text-sm text-gray-400">No data yet</p>
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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create your first lesson, quiz, or resource to get started.
                </p>
                <Link href="/admin/education/content/new">
                  <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Content
                  </Button>
                </Link>
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
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <TrendingUp className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  Performance data will appear once students begin engaging with content.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Students Needing Help */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Students Needing Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  Students who need assistance will be flagged here once enrollment data is available.
                </p>
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
