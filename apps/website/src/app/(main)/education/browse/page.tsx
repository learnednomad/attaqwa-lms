'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  BookOpen,
  X,
} from 'lucide-react';
import { EducationContentCard } from '@/components/features/education/EducationContentCard';
import { useCourses } from '@/lib/hooks/use-strapi-courses';

type AgeTier = 'children' | 'youth' | 'adults' | 'all';
type IslamicSubject = 'quran' | 'hadith' | 'fiqh' | 'aqeedah' | 'seerah' | 'arabic' | 'islamic_history' | 'akhlaq' | 'tajweed';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type EducationContentType = 'LESSON' | 'QUIZ' | 'VIDEO' | 'ARTICLE';

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

const difficultyLevels: { value: string; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export default function EducationBrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgeTier, setSelectedAgeTier] = useState<string | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const { data: coursesResponse, isLoading, isError, error } = useCourses({
    subject: selectedSubject,
    age_tier: selectedAgeTier,
    difficulty: selectedDifficulty,
    search: searchQuery,
  });

  const courses = useMemo(() => {
    if (!coursesResponse?.data) return [];

    return coursesResponse.data
      .filter(course => course.subject && course.age_tier && course.difficulty)
      .map(course => ({
        id: course.documentId,
        title: course.title,
        description: course.description,
        subject: course.subject as IslamicSubject,
        ageTier: course.age_tier as AgeTier,
        difficultyLevel: course.difficulty as DifficultyLevel,
        contentType: 'LESSON' as EducationContentType,
        estimatedDuration: (course.duration_weeks || 0) * 60,
        thumbnailUrl: course.thumbnail?.url,
        isPublished: true,
        tags: undefined,
        createdAt: new Date(course.createdAt),
        updatedAt: new Date(course.updatedAt),
        author: { id: '1', name: course.instructor || 'Instructor' },
        _count: {
          userProgress: course.lessons?.length || 0,
          quizAttempts: 0,
        },
      }));
  }, [coursesResponse]);

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Education
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Browse Courses
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Explore our comprehensive library of Islamic educational content. Use filters to find exactly what you&apos;re looking for.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Search and Controls */}
        <section className="py-8">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search lessons, topics, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-medium">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="duration">Shortest First</option>
                </select>

                <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-5 pt-5 border-t border-neutral-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Age Tier Filter */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Age Group</label>
                    <select
                      value={selectedAgeTier || ''}
                      onChange={(e) => setSelectedAgeTier(e.target.value || undefined)}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
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
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Subject</label>
                    <select
                      value={selectedSubject || ''}
                      onChange={(e) => setSelectedSubject(e.target.value || undefined)}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
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
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Difficulty</label>
                    <select
                      value={selectedDifficulty || ''}
                      onChange={(e) => setSelectedDifficulty(e.target.value || undefined)}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
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
                    <p className="text-sm text-neutral-500">
                      {sortedCourses.length} result{sortedCourses.length !== 1 ? 's' : ''} found
                    </p>
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />
            <p className="mt-4 text-sm text-neutral-500">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-12 text-center">
            <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 mb-2">Failed to load courses</h3>
            <p className="text-sm text-neutral-500 mb-5 max-w-md mx-auto">
              {error?.message || 'Something went wrong. Please try again later.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !isError && (
          <section className="pb-20">
            <div className="mb-5">
              <p className="text-sm text-neutral-500">
                Showing {sortedCourses.length} course{sortedCourses.length !== 1 ? 's' : ''}
              </p>
            </div>

            {sortedCourses.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
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
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-12 text-center">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">No courses found</h3>
                <p className="text-sm text-neutral-500 mb-5 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you&apos;re looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
