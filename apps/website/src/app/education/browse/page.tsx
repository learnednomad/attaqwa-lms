'use client';

import React, { useState } from 'react';
import { FeatureFlagService } from '@attaqwa/shared/feature-flags';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  SortAsc, 
  Grid, 
  List,
  Clock,
  User,
  BookOpen,
  Play,
  FileText
} from 'lucide-react';
import { AgeTierFilter } from '@/components/features/education/AgeTierFilter';
import { EducationContentCard } from '@/components/features/education/EducationContentCard';
import type { AgeTier, IslamicSubject, DifficultyLevel, EducationContentType } from '@attaqwa/shared';

// Mock expanded content data
const mockEducationContent = [
  {
    id: '1',
    title: 'Introduction to Quran',
    description: 'Learn the basics of Quranic reading and understanding with proper pronunciation and meaning. This comprehensive course covers Arabic letters, pronunciation rules, and basic Tajweed principles.',
    subject: 'QURAN' as IslamicSubject,
    ageTier: 'CHILDREN' as AgeTier,
    difficultyLevel: 'BEGINNER' as DifficultyLevel,
    contentType: 'LESSON' as EducationContentType,
    estimatedDuration: 30,
    thumbnailUrl: '/images/quran-basics.jpg',
    isPublished: true,
    tags: ['basics', 'reading', 'pronunciation', 'tajweed'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    author: { id: '1', name: 'Imam Abdullah' },
    _count: { userProgress: 24, quizAttempts: 18 },
    arabicContent: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    transliteration: 'Bismillah ar-Rahman ar-Raheem'
  },
  {
    id: '2',
    title: 'Five Pillars of Islam Quiz',
    description: 'Test your knowledge of the fundamental pillars that form the foundation of Islamic faith and practice.',
    subject: 'AQIDAH' as IslamicSubject,
    ageTier: 'YOUTH' as AgeTier,
    difficultyLevel: 'BEGINNER' as DifficultyLevel,
    contentType: 'QUIZ' as EducationContentType,
    estimatedDuration: 15,
    isPublished: true,
    tags: ['pillars', 'faith', 'practice', 'assessment'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    author: { id: '2', name: 'Sister Aisha' },
    _count: { userProgress: 31, quizAttempts: 25 }
  },
  {
    id: '3',
    title: 'Prayer (Salah) Fundamentals',
    description: 'Learn the correct way to perform the five daily prayers with proper movements and recitations.',
    subject: 'WORSHIP' as IslamicSubject,
    ageTier: 'ALL_AGES' as AgeTier,
    difficultyLevel: 'BEGINNER' as DifficultyLevel,
    contentType: 'VIDEO' as EducationContentType,
    estimatedDuration: 25,
    isPublished: true,
    tags: ['salah', 'prayer', 'worship', 'movements'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
    author: { id: '1', name: 'Imam Abdullah' },
    _count: { userProgress: 45, quizAttempts: 0 }
  },
  {
    id: '4',
    title: 'Stories of the Prophets',
    description: 'Engaging stories from the lives of the Prophets (peace be upon them) with moral lessons and historical context.',
    subject: 'SEERAH' as IslamicSubject,
    ageTier: 'CHILDREN' as AgeTier,
    difficultyLevel: 'BEGINNER' as DifficultyLevel,
    contentType: 'AUDIO' as EducationContentType,
    estimatedDuration: 40,
    isPublished: true,
    tags: ['prophets', 'stories', 'history', 'morals'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05'),
    author: { id: '3', name: 'Ustadh Omar' },
    _count: { userProgress: 18, quizAttempts: 8 }
  },
  {
    id: '5',
    title: 'Islamic Jurisprudence Basics',
    description: 'An introduction to Islamic law covering essential rulings for daily life including worship, transactions, and family matters.',
    subject: 'FIQH' as IslamicSubject,
    ageTier: 'ADULTS' as AgeTier,
    difficultyLevel: 'INTERMEDIATE' as DifficultyLevel,
    contentType: 'READING' as EducationContentType,
    estimatedDuration: 60,
    isPublished: true,
    tags: ['law', 'rulings', 'worship', 'transactions'],
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-25'),
    author: { id: '4', name: 'Sheikh Mansoor' },
    _count: { userProgress: 12, quizAttempts: 5 }
  },
  {
    id: '6',
    title: 'Arabic Alphabet Interactive',
    description: 'Interactive lesson to learn the Arabic alphabet with pronunciation, writing practice, and letter recognition games.',
    subject: 'ARABIC_LANGUAGE' as IslamicSubject,
    ageTier: 'CHILDREN' as AgeTier,
    difficultyLevel: 'BEGINNER' as DifficultyLevel,
    contentType: 'INTERACTIVE' as EducationContentType,
    estimatedDuration: 35,
    isPublished: true,
    tags: ['alphabet', 'writing', 'pronunciation', 'interactive'],
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-20'),
    author: { id: '5', name: 'Ustadha Fatima' },
    _count: { userProgress: 28, quizAttempts: 12 }
  }
];

const subjects: { value: IslamicSubject; label: string }[] = [
  { value: 'QURAN', label: 'Quran' },
  { value: 'HADITH', label: 'Hadith' },
  { value: 'FIQH', label: 'Fiqh' },
  { value: 'AQIDAH', label: 'Aqidah' },
  { value: 'SEERAH', label: 'Seerah' },
  { value: 'WORSHIP', label: 'Worship' },
  { value: 'ARABIC_LANGUAGE', label: 'Arabic Language' },
  { value: 'ISLAMIC_HISTORY', label: 'Islamic History' }
];

const contentTypes: { value: EducationContentType; label: string; icon: any }[] = [
  { value: 'LESSON', label: 'Lesson', icon: BookOpen },
  { value: 'QUIZ', label: 'Quiz', icon: FileText },
  { value: 'VIDEO', label: 'Video', icon: Play },
  { value: 'AUDIO', label: 'Audio', icon: '🎵' },
  { value: 'READING', label: 'Reading', icon: '📖' },
  { value: 'INTERACTIVE', label: 'Interactive', icon: '🎮' }
];

const difficultyLevels: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'BEGINNER', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { value: 'INTERMEDIATE', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ADVANCED', label: 'Advanced', color: 'bg-red-100 text-red-800' },
  { value: 'SCHOLAR', label: 'Scholar', color: 'bg-purple-100 text-purple-800' }
];

export default function EducationBrowsePage() {
  // Feature flag protection
  if (!FeatureFlagService.canAccessEducationUI()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-islamic-navy-800 mb-4">Education Browser</h1>
          <div className="bg-islamic-gold-50 border border-islamic-gold-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-islamic-gold-800 mb-2">🚧 Under Development</h2>
            <p className="text-islamic-gold-700">Educational content browsing is being enhanced.</p>
          </div>
          <Link href="/"><Button className="bg-islamic-green-600 hover:bg-islamic-green-700">Return to Home</Button></Link>
        </div>
      </div>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgeTier, setSelectedAgeTier] = useState<AgeTier | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<IslamicSubject | undefined>();
  const [selectedContentType, setSelectedContentType] = useState<EducationContentType | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | undefined>();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'duration'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredContent = mockEducationContent.filter(content => {
    const matchesSearch = !searchQuery || 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAge = !selectedAgeTier || content.ageTier === selectedAgeTier || content.ageTier === 'ALL_AGES';
    const matchesSubject = !selectedSubject || content.subject === selectedSubject;
    const matchesContentType = !selectedContentType || content.contentType === selectedContentType;
    const matchesDifficulty = !selectedDifficulty || content.difficultyLevel === selectedDifficulty;
    
    return matchesSearch && matchesAge && matchesSubject && matchesContentType && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return b._count.userProgress - a._count.userProgress;
      case 'duration':
        return a.estimatedDuration - b.estimatedDuration;
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSelectedAgeTier(undefined);
    setSelectedSubject(undefined);
    setSelectedContentType(undefined);
    setSelectedDifficulty(undefined);
    setSearchQuery('');
  };

  const activeFiltersCount = [selectedAgeTier, selectedSubject, selectedContentType, selectedDifficulty].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-islamic-navy-800 mb-4">
          Browse Educational Content
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Explore our comprehensive library of Islamic educational content. Use filters to find exactly what you're looking for.
        </p>
      </div>

      {/* Search and Controls */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lessons, topics, keywords, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-islamic-green-600 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="duration">Shortest First</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Age Tier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                  <AgeTierFilter value={selectedAgeTier} onChange={setSelectedAgeTier} />
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={selectedSubject || ''}
                    onChange={(e) => setSelectedSubject(e.target.value as IslamicSubject || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <select
                    value={selectedContentType || ''}
                    onChange={(e) => setSelectedContentType(e.target.value as EducationContentType || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                  >
                    <option value="">All Types</option>
                    {contentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty || ''}
                    onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                  >
                    <option value="">All Levels</option>
                    {difficultyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {filteredContent.length} results found with current filters
                  </p>
                  <Button variant="ghost" onClick={clearFilters} size="sm">
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredContent.length} of {mockEducationContent.length} results
        </p>
      </div>

      {/* Content Grid/List */}
      {filteredContent.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredContent.map((content) => (
            <div key={content.id} className={viewMode === 'list' ? "w-full" : ""}>
              <EducationContentCard 
                content={content}
                onClick={(content) => {
                  window.location.href = `/education/content/${content.id}`;
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No content found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}