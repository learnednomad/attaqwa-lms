'use client';

import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Download,
  FileText,
  ChevronRight,
  Languages,
} from 'lucide-react';
import {
  useLibraryResources,
  resolveFileUrl,
  LIBRARY_CATEGORY_LABELS,
  type LibraryCategory,
} from '@/lib/hooks/useLibrary';

const CALENDAR_CATEGORIES: LibraryCategory[] = [
  'calendars',
  'ramadan',
  'hajj',
  'prayer-schedule',
];

const LANGUAGE_LABELS: Record<string, string> = {
  english: 'English',
  bengali: 'Bengali',
  arabic: 'Arabic',
  multi: 'Multi-language',
};

export default function CalendarDownloadsPage() {
  const { data, isLoading, isError } = useLibraryResources({
    categories: CALENDAR_CATEGORIES,
  });
  const resources = data ?? [];

  const grouped = CALENDAR_CATEGORIES.map((category) => ({
    category,
    items: resources.filter((r) => r.category === category),
  })).filter((group) => group.items.length > 0);

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
            Islamic Calendar Downloads
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl leading-relaxed">
            Printable PDFs for prayer schedules, Ramadan timetables, Hajj guides, and the wider
            Islamic calendar — refreshed as the education team publishes them.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-8 text-center">
            <p className="text-sm text-rose-700">
              We couldn&apos;t reach the downloads right now. Please try again in a moment.
            </p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-12 text-center">
            <CalendarIcon className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">
              Calendars are being prepared
            </h3>
            <p className="text-xs text-neutral-500">
              Prayer schedules, Ramadan timetables, and Hajj guides will appear here as soon as the
              team uploads them.
            </p>
            <Link
              href="/resources/library"
              className="inline-flex items-center gap-2 mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700"
            >
              Browse the full library instead
            </Link>
          </div>
        ) : (
          grouped.map((group) => (
            <section key={group.category}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  {LIBRARY_CATEGORY_LABELS[group.category]}
                </h2>
                <div className="flex-1 h-px bg-neutral-100" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {group.items.map((resource) => {
                  const url = resolveFileUrl(resource.file);
                  return (
                    <div
                      key={resource.id}
                      className="rounded-xl border border-neutral-200 bg-white p-5 flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-1 leading-snug">
                          <Link
                            href={`/resources/library/${resource.slug}`}
                            className="hover:text-emerald-700"
                          >
                            {resource.title}
                          </Link>
                        </h3>
                        {resource.description && (
                          <p className="text-xs text-neutral-500 leading-relaxed mb-2 line-clamp-2">
                            {resource.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-[11px] text-neutral-500 mb-3">
                          <span className="inline-flex items-center gap-1">
                            <Languages className="h-3 w-3" />
                            {LANGUAGE_LABELS[resource.language] ?? resource.language}
                          </span>
                          {resource.publishDate && (
                            <span>
                              {new Date(resource.publishDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800"
                          >
                            <Download className="h-3 w-3" />
                            Download PDF
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
