'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Grid,
  List,
  BookOpen,
  Loader2
} from 'lucide-react';
import { EducationContentCard } from '@/components/features/education/EducationContentCard';
import { useCourses } from '@/lib/hooks/use-strapi-courses';

// Local type definitions matching Strapi schema
type AgeTier = 'children' | 'youth' | 'adults' | 'all';
type IslamicSubject = 'quran' | 'hadith' | 'fiqh' | 'aqeedah' | 'seerah' | 'arabic' | 'islamic_history' | 'akhlaq' | 'tajweed';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type EducationContentType = 'LESSON' | 'QUIZ' | 'VIDEO' | 'ARTICLE';

// Strapi uses lowercase values
const subjects: { value: string; label: string }[] = [
  { value: 'quran', label: 'Quran' },
  { value: 'hadith', label: 'Hadith' },
  { value: 'fiqh', label: 'Fiqh' },
  { value: 'aqeedah', label: 'Aqeedah' },
  { value: 'seerah', label: 'Seerah' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'islamic_history', label: 'Islamic History' },
  { value: 'akhlaq', label: 'Akhlaq' },
  { value: 'tajweed', label: 'Tajweed' }
];

const ageTiers: { value: string; label: string }[] = [
  { value: 'children', label: 'Children' },
  { value: 'youth', label: 'Youth' },
  { value: 'adults', label: 'Adults' },
  { value: 'all', label: 'All Ages' }
];

const difficultyLevels: { value: string; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
];

export default function EducationBrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgeTier, setSelectedAgeTier] = useState<string | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch courses with API filters
  const { data: coursesResponse, isLoading, isError, error } = useCourses({
    subject: selectedSubject,
    age_tier: selectedAgeTier,
    difficulty: selectedDifficulty, // Changed from difficulty_level
    search: searchQuery,
  });

  // Transform Strapi courses to match EducationContentCard format
  const courses = useMemo(() => {
    if (!coursesResponse?.data) return [];

    return coursesResponse.data
      .filter(course => course.subject && course.age_tier && course.difficulty)
      .map(course => ({
        id: course.documentId,
        title: course.title,
        description: course.description,
        subject: course.subject as IslamicSubject, // Keep lowercase to match Strapi
        ageTier: course.age_tier as AgeTier, // Keep lowercase to match Strapi
        difficultyLevel: course.difficulty as DifficultyLevel, // Keep lowercase to match Strapi
        contentType: 'LESSON' as EducationContentType, // Courses contain lessons
        estimatedDuration: (course.duration_weeks || 0) * 60, // Convert weeks to minutes approximation
        thumbnailUrl: course.thumbnail?.url,
        isPublished: true,
        tags: undefined, // Tags not available in Strapi course schema
        createdAt: new Date(course.createdAt),
        updatedAt: new Date(course.updatedAt),
        author: { id: '1', name: course.instructor || 'Instructor' },
        _count: {
          userProgress: course.lessons?.length || 0,
          quizAttempts: 0,
        },
      }));
  }, [coursesResponse]);

  // Client-side sorting
  const sortedCourses = useMemo(() => {
    const sorted = [...courses];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'duration':
          return a.estimatedDuration - b.estimatedDuration;
        default:
          return 0;
      }
    });
    return sorted;
  }, [courses, sortBy]);

  const clearFilters = () => {
    setSelectedAgeTier(undefined);
    setSelectedSubject(undefined);
    setSelectedDifficulty(undefined);
    setSearchQuery('');
  };

  const activeFiltersCount = [selectedAgeTier, selectedSubject, selectedDifficulty].filter(Boolean).length;

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Age Tier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                  <select
                    value={selectedAgeTier || ''}
                    onChange={(e) => setSelectedAgeTier(e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                  >
                    <option value="">All Ages</option>
                    {ageTiers.map((tier) => (
                      <option key={tier.value} value={tier.value}>
                        {tier.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={selectedSubject || ''}
                    onChange={(e) => setSelectedSubject(e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty || ''}
                    onChange={(e) => setSelectedDifficulty(e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                  >
                    <option value="">All Levels</option>
                    {difficultyLevels.map((level) => (
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
                    {sortedCourses.length} result{sortedCourses.length !== 1 ? 's' : ''} found with current filters
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-islamic-green-600" />
          <span className="ml-4 text-lg text-gray-600">Loading courses...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 text-red-400 mx-auto mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Failed to load courses</h3>
            <p className="text-gray-500 mb-4">
              {error?.message || 'Something went wrong. Please try again later.'}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!isLoading && !isError && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {sortedCourses.length} course{sortedCourses.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Content Grid/List */}
          {sortedCourses.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {sortedCourses.map((content) => (
                <div key={content.id} className={viewMode === 'list' ? 'w-full' : ''}>
                  <EducationContentCard
                    content={content}
                    onClick={(content) => {
                      window.location.href = `/education/courses/${content.id}`;
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}