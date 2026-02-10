/**
 * Semantic Search Component
 * Search input with debounce, results with relevance scores,
 * content type filter tabs, and fallback to keyword search.
 */

'use client';

import { Search, BookOpen, FileText, HelpCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { useSemanticSearch, type SearchResult } from '@/lib/hooks/useSemanticSearch';

const CONTENT_TYPE_ICONS: Record<string, React.ElementType> = {
  course: BookOpen,
  lesson: FileText,
  quiz: HelpCircle,
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  course: 'Course',
  lesson: 'Lesson',
  quiz: 'Quiz',
};

function getContentUrl(result: SearchResult): string {
  switch (result.contentType) {
    case 'course':
      return `/courses/${result.contentId}`;
    case 'lesson':
      return `/lessons/${result.contentId}`;
    case 'quiz':
      return `/quizzes/${result.contentId}`;
    default:
      return '#';
  }
}

export function SemanticSearch() {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<string | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data: results, isLoading, isFetching } = useSemanticSearch(
    debouncedQuery,
    contentTypeFilter
  );

  const clearSearch = useCallback(() => {
    setInputValue('');
    setDebouncedQuery('');
    setIsOpen(false);
  }, []);

  const showResults = isOpen && inputValue.length >= 3;

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses, lessons, quizzes..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-10 text-sm shadow-sm transition-shadow focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isFetching && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* Content Type Tabs */}
          <div className="flex gap-1 border-b border-gray-100 px-3 pt-3">
            {[undefined, 'course', 'lesson', 'quiz'].map((type) => (
              <button
                key={type || 'all'}
                onClick={() => setContentTypeFilter(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  contentTypeFilter === type
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {type ? CONTENT_TYPE_LABELS[type] : 'All'}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="p-2">
            {results && results.length > 0 ? (
              results.map((result, index) => {
                const Icon = CONTENT_TYPE_ICONS[result.contentType] || FileText;
                return (
                  <Link
                    key={`${result.contentType}-${result.contentId}-${index}`}
                    href={getContentUrl(result)}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{result.title}</p>
                      {result.snippet && (
                        <p className="mt-0.5 truncate text-xs text-gray-500">{result.snippet}</p>
                      )}
                    </div>
                    <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      {CONTENT_TYPE_LABELS[result.contentType] || result.contentType}
                    </span>
                  </Link>
                );
              })
            ) : isLoading ? (
              <div className="space-y-3 p-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="mt-1 h-3 w-full rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : debouncedQuery.length >= 3 ? (
              <p className="p-4 text-center text-sm text-gray-500">
                No results found for &ldquo;{debouncedQuery}&rdquo;
              </p>
            ) : null}
          </div>
        </div>
      )}

      {/* Click-away backdrop */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
