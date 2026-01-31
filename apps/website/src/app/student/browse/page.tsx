'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentLayout } from '@/components/layout/student-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search, Filter, Grid, List, BookOpen, Loader2, ArrowLeft
} from 'lucide-react';
import { EducationContentCard } from '@/components/features/education/EducationContentCard';
import { useCourses } from '@/lib/hooks/use-strapi-courses';

const subjects = [
  { value: 'quran', label: 'Quran' },
  { value: 'hadith', label: 'Hadith' },
  { value: 'fiqh', label: 'Fiqh' },
  { value: 'aqeedah', label: 'Aqeedah' },
  { value: 'seerah', label: 'Seerah' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'islamic_history', label: 'Islamic History' },
  { value: 'akhlaq', label: 'Akhlaq' },
  { value: 'tajweed', label: 'Tajweed' },
];

const ageTiers = [
  { value: 'children', label: 'Children' },
  { value: 'youth', label: 'Youth' },
  { value: 'adults', label: 'Adults' },
  { value: 'all', label: 'All Ages' },
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function StudentBrowsePage() {
  const router = useRouter();
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
        subject: course.subject as 'quran' | 'hadith' | 'fiqh' | 'aqeedah' | 'seerah' | 'arabic' | 'islamic_history' | 'akhlaq' | 'tajweed',
        ageTier: course.age_tier as 'children' | 'youth' | 'adults' | 'all',
        difficultyLevel: course.difficulty as 'beginner' | 'intermediate' | 'advanced',
        contentType: 'LESSON' as const,
        estimatedDuration: (course.duration_weeks || 0) * 60,
        thumbnailUrl: course.thumbnail?.url,
        isPublished: true,
        tags: undefined,
        createdAt: new Date(course.createdAt),
        updatedAt: new Date(course.updatedAt),
        author: { id: '1', name: course.instructor || 'Instructor' },
        _count: { userProgress: course.lessons?.length || 0, quizAttempts: 0 },
      }));
  }, [coursesResponse]);

  const sortedCourses = useMemo(() => {
    const sorted = [...courses];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'duration': return a.estimatedDuration - b.estimatedDuration;
        default: return 0;
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
    <StudentLayout title="Browse Courses" subtitle="Find and enroll in new courses">
      <div className="mb-4">
        <Link href="/student/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> My Courses
          </Button>
        </Link>
      </div>

      {/* Search and Controls */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
                <Filter className="h-4 w-4 mr-2" /> Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-emerald-600 text-white">{activeFiltersCount}</Badge>
                )}
              </Button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="duration">Shortest</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg">
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-r-none">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-l-none">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                  <select value={selectedAgeTier || ''} onChange={(e) => setSelectedAgeTier(e.target.value || undefined)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">All Ages</option>
                    {ageTiers.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select value={selectedSubject || ''} onChange={(e) => setSelectedSubject(e.target.value || undefined)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">All Subjects</option>
                    {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select value={selectedDifficulty || ''} onChange={(e) => setSelectedDifficulty(e.target.value || undefined)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">All Levels</option>
                    {difficultyLevels.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600">{sortedCourses.length} result{sortedCourses.length !== 1 ? 's' : ''}</p>
                  <Button variant="ghost" onClick={clearFilters} size="sm">Clear All</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load courses</h3>
            <p className="text-gray-500 mb-4">{error?.message || 'Something went wrong.'}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && (
        <>
          <p className="text-sm text-gray-600 mb-4">{sortedCourses.length} course{sortedCourses.length !== 1 ? 's' : ''}</p>
          {sortedCourses.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {sortedCourses.map((content) => (
                <div key={content.id} className={viewMode === 'list' ? 'w-full' : ''}>
                  <EducationContentCard
                    content={content}
                    onClick={(c) => router.push(`/student/courses/${c.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters.</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </StudentLayout>
  );
}
