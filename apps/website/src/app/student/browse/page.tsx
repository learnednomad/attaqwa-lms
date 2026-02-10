'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StudentLayout } from '@/components/layout/student-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search, Filter, BookOpen, Loader2, ArrowLeft,
  Clock, Play, ChevronDown, ChevronUp, Plus, BarChart3
} from 'lucide-react';
import { useCourses } from '@/lib/hooks/use-strapi-courses';
import { SemanticSearch } from '@/components/features/SemanticSearch';

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

const SUBJECT_COLORS: Record<string, { text: string; icon: string; gradient: string }> = {
  quran:           { text: 'text-emerald-600', icon: 'text-emerald-500', gradient: 'from-emerald-600 to-emerald-800' },
  hadith:          { text: 'text-blue-600',    icon: 'text-blue-500',    gradient: 'from-blue-600 to-blue-800' },
  fiqh:            { text: 'text-purple-600',  icon: 'text-purple-500',  gradient: 'from-purple-600 to-purple-800' },
  aqeedah:         { text: 'text-indigo-600',  icon: 'text-indigo-500',  gradient: 'from-indigo-600 to-indigo-800' },
  seerah:          { text: 'text-amber-600',   icon: 'text-amber-500',   gradient: 'from-amber-600 to-amber-800' },
  arabic:          { text: 'text-teal-600',    icon: 'text-teal-500',    gradient: 'from-teal-600 to-teal-800' },
  islamic_history: { text: 'text-orange-600',  icon: 'text-orange-500',  gradient: 'from-orange-600 to-orange-800' },
  akhlaq:          { text: 'text-pink-600',    icon: 'text-pink-500',    gradient: 'from-pink-600 to-pink-800' },
  tajweed:         { text: 'text-cyan-600',    icon: 'text-cyan-500',    gradient: 'from-cyan-600 to-cyan-800' },
};

const SUBJECT_LABELS: Record<string, string> = {
  quran: 'Quran', hadith: 'Hadith', fiqh: 'Fiqh', aqeedah: 'Aqeedah',
  seerah: 'Seerah', arabic: 'Arabic', islamic_history: 'Islamic History',
  akhlaq: 'Akhlaq', tajweed: 'Tajweed',
};

function formatDuration(minutes: number): string {
  if (minutes <= 0) return 'Self-paced';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

interface CourseCardData {
  id: string;
  title: string;
  description: string;
  subject: string;
  ageTier: string;
  difficultyLevel: string;
  estimatedDuration: number;
  author: { id: string; name: string };
  createdAt: Date;
  lessonsCount: number;
}

function CourseCard({ course, onStart }: { course: CourseCardData; onStart: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const colors = SUBJECT_COLORS[course.subject] || SUBJECT_COLORS.quran;
  const subjectLabel = SUBJECT_LABELS[course.subject] || course.subject;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Subject Tag */}
        <div className="flex items-center gap-1.5 mb-3">
          <BarChart3 className={`h-4 w-4 ${colors.icon}`} />
          <span className={`text-sm font-semibold ${colors.text}`}>{subjectLabel}</span>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3 flex-1">
          {course.description}
        </p>

        {/* Author & Meta */}
        <div className="mt-auto">
          <p className="text-sm text-gray-700">By {course.author.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {course.difficultyLevel.charAt(0).toUpperCase() + course.difficultyLevel.slice(1)} &middot; {formatDate(course.createdAt)}
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        {!expanded ? (
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(course.estimatedDuration)}</span>
              {course.lessonsCount > 0 && (
                <span className="text-gray-300 mx-1">&middot;</span>
              )}
              {course.lessonsCount > 0 && (
                <span>{course.lessonsCount} lessons</span>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className={`bg-gradient-to-br ${colors.gradient} px-5 py-4 text-white rounded-b-xl`}>
            <button
              onClick={(e) => { e.stopPropagation(); onStart(); }}
              className="flex items-center gap-2 text-white font-semibold text-[15px] mb-2 hover:opacity-90 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="h-3.5 w-3.5 text-white fill-white" />
              </div>
              Start
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onStart(); }}
              className="flex items-center gap-2 text-white/80 text-sm hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              Enroll in course
            </button>
            <div className="flex justify-end mt-1">
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentBrowsePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgeTier, setSelectedAgeTier] = useState<string | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration'>('newest');
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
        subject: course.subject,
        ageTier: course.age_tier,
        difficultyLevel: course.difficulty,
        estimatedDuration: (course.duration_weeks || 0) * 60,
        createdAt: new Date(course.createdAt),
        author: { id: '1', name: course.instructor || 'Instructor' },
        lessonsCount: course.lessons?.length || 0,
      }));
  }, [coursesResponse]);

  const sortedCourses = useMemo(() => {
    const sorted = [...courses];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest': return a.createdAt.getTime() - b.createdAt.getTime();
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
      {/* Back to My Courses */}
      <div className="mb-5">
        <Link href="/student/courses">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" /> My Courses
          </Button>
        </Link>
      </div>

      {/* AI Semantic Search */}
      <div className="mb-6">
        <SemanticSearch />
      </div>

      {/* Keyword Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Filter courses by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-gray-400 transition-shadow"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-xl border-gray-200 px-4"
          >
            <Filter className="h-4 w-4 mr-2" /> Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-emerald-600 text-white text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'duration')}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="duration">Shortest</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="mb-6 border-gray-200 rounded-xl">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Subject</label>
                <select
                  value={selectedSubject || ''}
                  onChange={(e) => setSelectedSubject(e.target.value || undefined)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Age Group</label>
                <select
                  value={selectedAgeTier || ''}
                  onChange={(e) => setSelectedAgeTier(e.target.value || undefined)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Ages</option>
                  {ageTiers.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Difficulty</label>
                <select
                  value={selectedDifficulty || ''}
                  onChange={(e) => setSelectedDifficulty(e.target.value || undefined)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Levels</option>
                  {difficultyLevels.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">{sortedCourses.length} result{sortedCourses.length !== 1 ? 's' : ''}</p>
                <Button variant="ghost" onClick={clearFilters} size="sm" className="text-gray-500 hover:text-gray-700">Clear All</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Subject Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedSubject(undefined)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !selectedSubject
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {subjects.map(s => {
          const colors = SUBJECT_COLORS[s.value] || SUBJECT_COLORS.quran;
          const isActive = selectedSubject === s.value;
          return (
            <button
              key={s.value}
              onClick={() => setSelectedSubject(isActive ? undefined : s.value)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <Card className="rounded-xl border-gray-200">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load courses</h3>
            <p className="text-gray-500 mb-4">{error?.message || 'Something went wrong.'}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {/* Course Grid */}
      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedSubject ? SUBJECT_LABELS[selectedSubject] || 'Courses' : 'Popular courses'}
            </h2>
            <p className="text-sm text-gray-500">
              {sortedCourses.length} course{sortedCourses.length !== 1 ? 's' : ''}
            </p>
          </div>

          {sortedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {sortedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onStart={() => router.push(`/student/courses/${course.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="rounded-xl border-gray-200">
              <CardContent className="py-16 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
                <Button variant="outline" onClick={clearFilters} className="rounded-xl">Clear Filters</Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </StudentLayout>
  );
}
