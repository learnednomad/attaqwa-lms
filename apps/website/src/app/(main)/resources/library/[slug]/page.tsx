'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Download,
  FileText,
  Languages,
  Calendar as CalendarIcon,
  User,
} from 'lucide-react';
import {
  useLibraryResource,
  resolveFileUrl,
  LIBRARY_CATEGORY_LABELS,
} from '@/lib/hooks/useLibrary';

const LANGUAGE_LABELS: Record<string, string> = {
  english: 'English',
  bengali: 'Bengali',
  arabic: 'Arabic',
  multi: 'Multi-language',
};

export default function LibraryResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: resource, isLoading, isError } = useLibraryResource(slug);

  const downloadUrl = resource ? resolveFileUrl(resource.file) : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (isError || !resource) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-3">
            Resource not found
          </h1>
          <p className="text-sm text-neutral-500 mb-6">
            It may have been removed or the link has changed.
          </p>
          <Link
            href="/resources/library"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Back to library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/resources/library"
          className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 hover:text-emerald-800 mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to library
        </Link>

        <span className="text-[10px] font-semibold tracking-wide uppercase text-emerald-700">
          {LIBRARY_CATEGORY_LABELS[resource.category]}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2 mb-4">
          {resource.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mb-8">
          <span className="flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5" />
            {LANGUAGE_LABELS[resource.language] ?? resource.language}
          </span>
          {resource.author && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {resource.author}
            </span>
          )}
          {resource.publishDate && (
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              {new Date(resource.publishDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {resource.coverImage && (
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-neutral-200 mb-8 bg-neutral-100">
            <Image
              src={resolveFileUrl({ url: resource.coverImage.url }) ?? ''}
              alt={resource.coverImage.alternativeText ?? resource.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {resource.description && (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 mb-8">
            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
              {resource.description}
            </p>
          </div>
        )}

        {downloadUrl ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-neutral-900">
                {resource.file?.name ?? 'Download file'}
              </p>
              {resource.file?.size && (
                <p className="text-xs text-neutral-500">
                  {(resource.file.size / 1024).toFixed(0)} KB
                </p>
              )}
            </div>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
          </div>
        ) : (
          <p className="text-sm text-neutral-500 italic">
            This resource does not have a download file attached.
          </p>
        )}
      </div>
    </div>
  );
}
