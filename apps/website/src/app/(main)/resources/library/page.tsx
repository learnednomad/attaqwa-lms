'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Download, FileText, Languages, ChevronRight } from 'lucide-react';
import {
  useLibraryResources,
  resolveFileUrl,
  LIBRARY_CATEGORIES,
  LIBRARY_CATEGORY_LABELS,
  type LibraryCategory,
} from '@/lib/hooks/useLibrary';

type CategoryFilter = LibraryCategory | 'all';

const LANGUAGE_LABELS: Record<string, string> = {
  english: 'English',
  bengali: 'Bengali',
  arabic: 'Arabic',
  multi: 'Multi-language',
};

export default function LibraryPage() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const { data, isLoading, isError } = useLibraryResources(
    category === 'all' ? {} : { categories: [category] }
  );

  const resources = data ?? [];

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 hover:text-emerald-800 mb-6"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            Back to Resources
          </Link>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4 max-w-2xl">
            Library &amp; Downloads
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl leading-relaxed">
            Books, worksheets, calendars, and guides issued from Masjid At-Taqwa. Everything here
            is free to download and share with your family and community.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors ' +
              (category === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-emerald-300')
            }
          >
            All
          </button>
          {LIBRARY_CATEGORIES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCategory(c)}
              className={
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors ' +
                (category === c
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-emerald-300')
              }
            >
              {LIBRARY_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-8 text-center">
            <p className="text-sm text-rose-700">
              We couldn&apos;t reach the library right now. Please try again in a moment.
            </p>
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-12 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">
              Library is being populated
            </h3>
            <p className="text-xs text-neutral-500">
              Resources will appear here as our education team publishes them. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((resource) => {
              const downloadUrl = resolveFileUrl(resource.file);
              return (
                <div
                  key={resource.id}
                  className="rounded-xl border border-neutral-200 bg-white overflow-hidden flex flex-col"
                >
                  {resource.coverImage ? (
                    <div className="relative aspect-[4/3] bg-neutral-100">
                      <Image
                        src={resolveFileUrl({ url: resource.coverImage.url }) ?? ''}
                        alt={resource.coverImage.alternativeText ?? resource.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-emerald-50/50 flex items-center justify-center">
                      <FileText className="h-10 w-10 text-emerald-300" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-semibold tracking-wide uppercase text-emerald-700 mb-2">
                      {LIBRARY_CATEGORY_LABELS[resource.category]}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-2 leading-snug">
                      <Link
                        href={`/resources/library/${resource.slug}`}
                        className="hover:text-emerald-700"
                      >
                        {resource.title}
                      </Link>
                    </h3>
                    {resource.description && (
                      <p className="text-xs text-neutral-500 leading-relaxed mb-3 flex-1">
                        {resource.description.slice(0, 140)}
                        {resource.description.length > 140 ? '…' : ''}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 mb-4">
                      <Languages className="h-3 w-3" />
                      <span>{LANGUAGE_LABELS[resource.language] ?? resource.language}</span>
                      {resource.author && <span>· {resource.author}</span>}
                    </div>
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
