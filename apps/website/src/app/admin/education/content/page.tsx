'use client';

import React, { useState } from 'react';
import { FeatureFlagService } from '@attaqwa/shared';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  Download,
  Upload,
  BookOpen,
  Play,
  FileText,
  Headphones,
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';
// Local types for this page
type IslamicSubject = 'QURAN' | 'HADITH' | 'FIQH' | 'AQIDAH' | 'SEERAH' | 'WORSHIP' | 'ARABIC_LANGUAGE' | 'ISLAMIC_HISTORY';
type EducationContentType = 'LESSON' | 'QUIZ' | 'VIDEO' | 'AUDIO' | 'READING' | 'INTERACTIVE';
type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
type AgeTier = 'CHILDREN' | 'YOUTH' | 'ADULTS' | 'ALL_AGES';

interface ContentItem {
  id: string;
  title: string;
  subject: IslamicSubject;
  ageTier: AgeTier;
  contentType: EducationContentType;
  difficultyLevel: DifficultyLevel;
  status: 'Published' | 'Draft' | 'Archived';
  students: number;
  avgScore: number | null;
  duration: number;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// Mock content data
const contentItems: ContentItem[] = [
  {
    id: '1',
    title: 'Introduction to Quran',
    subject: 'QURAN',
    ageTier: 'CHILDREN',
    contentType: 'LESSON',
    difficultyLevel: 'BEGINNER',
    status: 'Published',
    students: 24,
    avgScore: 88,
    duration: 30,
    author: 'Imam Abdullah',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Five Pillars of Islam Quiz',
    subject: 'AQIDAH',
    ageTier: 'YOUTH',
    contentType: 'QUIZ',
    difficultyLevel: 'BEGINNER',
    status: 'Published',
    students: 31,
    avgScore: 85,
    duration: 15,
    author: 'Sister Aisha',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    title: 'Prayer Fundamentals Video',
    subject: 'WORSHIP',
    ageTier: 'ALL_AGES',
    contentType: 'VIDEO',
    difficultyLevel: 'BEGINNER',
    status: 'Draft',
    students: 0,
    avgScore: null,
    duration: 25,
    author: 'Imam Abdullah',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  },
  {
    id: '4',
    title: 'Stories of the Prophets',
    subject: 'SEERAH',
    ageTier: 'CHILDREN',
    contentType: 'AUDIO',
    difficultyLevel: 'BEGINNER',
    status: 'Published',
    students: 18,
    avgScore: 92,
    duration: 40,
    author: 'Ustadh Omar',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  },
  {
    id: '5',
    title: 'Advanced Fiqh Principles',
    subject: 'FIQH',
    ageTier: 'ADULTS',
    contentType: 'READING',
    difficultyLevel: 'ADVANCED',
    status: 'Published',
    students: 12,
    avgScore: 76,
    duration: 60,
    author: 'Sheikh Mansoor',
    createdAt: '2023-12-20',
    updatedAt: '2023-12-25'
  },
  {
    id: '6',
    title: 'Arabic Alphabet Practice',
    subject: 'ARABIC_LANGUAGE',
    ageTier: 'CHILDREN',
    contentType: 'INTERACTIVE',
    difficultyLevel: 'BEGINNER',
    status: 'Published',
    students: 28,
    avgScore: 82,
    duration: 35,
    author: 'Ustadha Fatima',
    createdAt: '2023-12-15',
    updatedAt: '2023-12-20'
  }
];

export default function AdminContentPage() {
  // Feature flag protection
  if (!FeatureFlagService.canAccessEducationAdmin()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-islamic-navy-800 mb-4">Content Management</h1>
          <div className="bg-islamic-gold-50 border border-islamic-gold-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-islamic-gold-800 mb-2">🚧 Under Development</h2>
            <p className="text-islamic-gold-700">Content management system is being enhanced.</p>
          </div>
          <Link href="/admin"><Button className="bg-islamic-green-600 hover:bg-islamic-green-700">Return to Admin Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<IslamicSubject | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<'Published' | 'Draft' | 'Archived' | ''>('');
  const [selectedType, setSelectedType] = useState<EducationContentType | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = !selectedSubject || item.subject === selectedSubject;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    const matchesType = !selectedType || item.contentType === selectedType;
    
    return matchesSearch && matchesSubject && matchesStatus && matchesType;
  });

  // Status color function removed to avoid duplication

  const getTypeIcon = (type: EducationContentType) => {
    const icons = {
      'LESSON': BookOpen,
      'QUIZ': FileText,
      'VIDEO': Play,
      'AUDIO': Headphones,
      'READING': BookOpen,
      'INTERACTIVE': '🎮'
    };
    const Icon = icons[type];
    return typeof Icon === 'string' ? 
      <span className="text-lg">{Icon}</span> : 
      <Icon className="h-4 w-4" />;
  };

  // Utility function removed to avoid duplication with function below

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-islamic-navy-800">Content Library</h1>
          <p className="text-gray-600">
            Manage your Islamic educational content library
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
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content by title, author, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value as IslamicSubject)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                  >
                    <option value="">All Subjects</option>
                    <option value="QURAN">Quran</option>
                    <option value="HADITH">Hadith</option>
                    <option value="FIQH">Fiqh</option>
                    <option value="AQIDAH">Aqidah</option>
                    <option value="SEERAH">Seerah</option>
                    <option value="WORSHIP">Worship</option>
                    <option value="ARABIC_LANGUAGE">Arabic Language</option>
                    <option value="ISLAMIC_HISTORY">Islamic History</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                  >
                    <option value="">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as EducationContentType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                  >
                    <option value="">All Types</option>
                    <option value="LESSON">Lesson</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="VIDEO">Video</option>
                    <option value="AUDIO">Audio</option>
                    <option value="READING">Reading</option>
                    <option value="INTERACTIVE">Interactive</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSelectedSubject('');
                      setSelectedStatus('');
                      setSelectedType('');
                      setSearchQuery('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content Library</CardTitle>
            <p className="text-sm text-gray-600">
              Showing {filteredContent.length} of {contentItems.length} items
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContent.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4 flex-1">
                  <div className="bg-islamic-green-100 p-2 rounded-lg">
                    {getTypeIcon(item.contentType)}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-islamic-navy-800 mb-1">
                      {item.title}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {item.subject.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.ageTier.replace('_', ' ')}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.difficultyLevel}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item.students} students
                      </div>
                      {item.avgScore && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {item.avgScore}% avg score
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(item.duration)}
                      </div>
                      <span>By {item.author}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link href={`/education/content/${item.id}`}>
                    <Button variant="ghost" size="sm" title="View Content">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Link href={`/admin/education/content/${item.id}/edit`}>
                    <Button variant="ghost" size="sm" title="Edit Content">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Button variant="ghost" size="sm" title="More Options">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No content found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedSubject || selectedStatus || selectedType
                  ? "Try adjusting your search terms or filters."
                  : "Start by creating your first piece of educational content."
                }
              </p>
              <Link href="/admin/education/content/new">
                <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Content
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {filteredContent.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  className="rounded text-islamic-green-600 focus:ring-islamic-green-500"
                />
                <span className="text-sm text-gray-600">
                  Select all {filteredContent.length} items
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Bulk Edit
                </Button>
                <Button variant="outline" size="sm">
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
  }

  function getStatusColor(status: string): string {
    const colors = {
      'Published': 'bg-green-100 text-green-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Archived': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }
}