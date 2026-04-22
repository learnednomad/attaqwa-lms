'use client';

import { useQuery } from '@tanstack/react-query';

export const LIBRARY_CATEGORIES = [
  'books',
  'worksheets',
  'calendars',
  'ramadan',
  'hajj',
  'prayer-schedule',
  'new-muslim',
  'other',
] as const;

export type LibraryCategory = (typeof LIBRARY_CATEGORIES)[number];

export const LIBRARY_CATEGORY_LABELS: Record<LibraryCategory, string> = {
  books: 'Books',
  worksheets: 'Worksheets',
  calendars: 'Calendars',
  ramadan: 'Ramadan Guides',
  hajj: 'Hajj Guides',
  'prayer-schedule': 'Prayer Schedules',
  'new-muslim': 'New Muslim Resources',
  other: 'Other',
};

export interface LibraryResource {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  description?: string;
  category: LibraryCategory;
  language: 'english' | 'bengali' | 'arabic' | 'multi';
  author?: string;
  publishDate?: string;
  isActive: boolean;
  displayOrder?: number;
  file?: {
    url: string;
    name?: string;
    ext?: string;
    mime?: string;
    size?: number;
  };
  coverImage?: {
    url: string;
    alternativeText?: string;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface UseLibraryParams {
  categories?: LibraryCategory[];
  language?: LibraryResource['language'];
  limit?: number;
}

interface StrapiListResponse<T> {
  data: T[];
  meta?: unknown;
}

function normalizeResource(raw: unknown): LibraryResource | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const attrs = (obj.attributes as Record<string, unknown>) ?? obj;

  type Wrap = { data?: { attributes?: Record<string, unknown> } } | Record<string, unknown>;
  const unwrapMedia = (wrap: Wrap | undefined): Record<string, unknown> | undefined => {
    if (!wrap || typeof wrap !== 'object') return undefined;
    if ('data' in wrap) {
      const data = (wrap as { data?: { attributes?: Record<string, unknown> } }).data;
      return data?.attributes;
    }
    return wrap as Record<string, unknown>;
  };

  const file = unwrapMedia(attrs.file as Wrap | undefined);
  const cover = unwrapMedia(attrs.coverImage as Wrap | undefined);

  if (!attrs.title || !attrs.category) return null;

  return {
    id: Number(obj.id ?? attrs.id ?? 0),
    documentId: (obj.documentId as string) ?? (attrs.documentId as string),
    title: attrs.title as string,
    slug: (attrs.slug as string) ?? String(attrs.title).toLowerCase(),
    description: attrs.description as string | undefined,
    category: attrs.category as LibraryCategory,
    language: (attrs.language as LibraryResource['language']) ?? 'english',
    author: attrs.author as string | undefined,
    publishDate: attrs.publishDate as string | undefined,
    isActive: (attrs.isActive as boolean) ?? true,
    displayOrder: (attrs.displayOrder as number) ?? 0,
    file: file
      ? {
          url: (file.url as string) ?? '',
          name: file.name as string | undefined,
          ext: file.ext as string | undefined,
          mime: file.mime as string | undefined,
          size: file.size as number | undefined,
        }
      : undefined,
    coverImage: cover?.url
      ? {
          url: cover.url as string,
          alternativeText: cover.alternativeText as string | undefined,
        }
      : undefined,
  };
}

function buildQuery(params: UseLibraryParams): string {
  const parts = [
    'filters[isActive][$eq]=true',
    'populate=file,coverImage',
    'pagination[pageSize]=' + (params.limit ?? 100),
    'sort[0]=displayOrder:asc',
    'sort[1]=publishDate:desc',
  ];
  if (params.categories?.length) {
    params.categories.forEach((c, i) => {
      parts.push(`filters[category][$in][${i}]=${encodeURIComponent(c)}`);
    });
  }
  if (params.language) {
    parts.push(`filters[language][$eq]=${params.language}`);
  }
  return parts.join('&');
}

export function useLibraryResources(params: UseLibraryParams = {}) {
  return useQuery<LibraryResource[]>({
    queryKey: ['library-resources', params],
    queryFn: async () => {
      const query = buildQuery(params);
      const res = await fetch(`${API_BASE}/api/v1/library-resources?${query}`);
      if (!res.ok) throw new Error(`Library fetch failed: ${res.status}`);
      const json = (await res.json()) as StrapiListResponse<unknown>;
      return (json.data ?? [])
        .map(normalizeResource)
        .filter((r): r is LibraryResource => r !== null);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useLibraryResource(slug: string | undefined) {
  return useQuery<LibraryResource | null>({
    queryKey: ['library-resource', slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch(
        `${API_BASE}/api/v1/library-resources?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=file,coverImage`
      );
      if (!res.ok) throw new Error(`Library fetch failed: ${res.status}`);
      const json = (await res.json()) as StrapiListResponse<unknown>;
      const first = json.data?.[0];
      return first ? normalizeResource(first) : null;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
}

export function resolveFileUrl(file: LibraryResource['file']): string | undefined {
  if (!file?.url) return undefined;
  if (/^https?:\/\//.test(file.url)) return file.url;
  return `${API_BASE}${file.url}`;
}
