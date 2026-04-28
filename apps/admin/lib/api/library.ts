/**
 * Library Resource API helpers
 * CRUD + media upload for the library-resource content type.
 * All calls go through the admin proxy (/api/v1/* → Strapi).
 */

import { strapiClient } from './strapi-client';

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

export const LIBRARY_LANGUAGES = ['english', 'bengali', 'arabic', 'multi'] as const;
export type LibraryLanguage = (typeof LIBRARY_LANGUAGES)[number];

export const LIBRARY_LANGUAGE_LABELS: Record<LibraryLanguage, string> = {
  english: 'English',
  bengali: 'Bengali',
  arabic: 'Arabic',
  multi: 'Multi-language',
};

export interface LibraryMedia {
  id: number;
  url: string;
  name?: string;
  ext?: string;
  mime?: string;
  size?: number;
  alternativeText?: string;
}

export interface LibraryResource {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  description?: string;
  category: LibraryCategory;
  language: LibraryLanguage;
  author?: string;
  publishDate?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  file?: LibraryMedia | null;
  coverImage?: LibraryMedia | null;
}

const ENDPOINT = '/v1/library-resources';

interface StrapiListBody<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

type Pagination = NonNullable<NonNullable<StrapiListBody<unknown>['meta']>['pagination']>;

// strapiClient.get unwraps the axios envelope and returns the JSON body
// directly. Standard Strapi list shape is `{ data: T[], meta: {pagination} }`.
// Some older proxies double-wrap as `{ data: { data: T[], meta } }`.
// Handle both — fall through to empty if neither matches.
function normalizeList<T>(raw: unknown): { items: T[]; pagination?: Pagination } {
  const r = raw as { data?: unknown; meta?: { pagination?: Pagination } } | null | undefined;
  // Standard: { data: T[], meta }
  if (r && Array.isArray(r.data)) {
    return { items: r.data as T[], pagination: r.meta?.pagination };
  }
  // Double-wrapped: { data: { data: T[], meta } }
  const inner = r?.data as
    | { data?: unknown; meta?: { pagination?: Pagination } }
    | undefined;
  if (inner && Array.isArray(inner.data)) {
    return { items: inner.data as T[], pagination: inner.meta?.pagination };
  }
  return { items: [], pagination: undefined };
}

function normalizeEntity<T>(raw: unknown): T | null {
  const r = raw as { data?: unknown } | null | undefined;
  // Standard: { data: T }
  if (r && r.data && !Array.isArray(r.data) && typeof r.data === 'object') {
    return r.data as T;
  }
  // Double-wrapped: { data: { data: T } }
  const inner = r?.data as { data?: unknown } | undefined;
  if (inner && inner.data && typeof inner.data === 'object') {
    return inner.data as T;
  }
  return null;
}

 interface ListLibraryParams {
  q?: string | null;
  category?: LibraryCategory | 'all';
  language?: LibraryLanguage | 'all';
  isActive?: boolean | 'all';
  page?: number;
  pageSize?: number;
  sort?: string[];
}

function buildListQuery(params: ListLibraryParams = {}): URLSearchParams {
  const query = new URLSearchParams();

  query.set('populate[0]', 'file');
  query.set('populate[1]', 'coverImage');

  const sort = params.sort ?? ['displayOrder:asc', 'createdAt:desc'];
  sort.forEach((s, i) => query.set(`sort[${i}]`, s));

  query.set('pagination[page]', String(params.page ?? 1));
  query.set('pagination[pageSize]', String(params.pageSize ?? 50));

  if (params.q) {
    query.set('filters[title][$containsi]', params.q);
  }
  if (params.category && params.category !== 'all') {
    query.set('filters[category][$eq]', params.category);
  }
  if (params.language && params.language !== 'all') {
    query.set('filters[language][$eq]', params.language);
  }
  if (params.isActive !== undefined && params.isActive !== 'all') {
    query.set('filters[isActive][$eq]', String(params.isActive));
  }

  return query;
}

export async function listLibraryResources(
  params: ListLibraryParams = {}
): Promise<{ items: LibraryResource[]; pagination?: Pagination }> {
  const query = buildListQuery(params);
  const response = await strapiClient.get<LibraryResource[]>(
    `${ENDPOINT}?${query.toString()}`
  );
  const { items, pagination } = normalizeList<LibraryResource>(response);
  return { items, pagination };
}

export async function getLibraryResource(
  id: string | number
): Promise<LibraryResource | null> {
  const query = new URLSearchParams();
  query.set('populate[0]', 'file');
  query.set('populate[1]', 'coverImage');

  const response = await strapiClient.get<LibraryResource>(
    `${ENDPOINT}/${id}?${query.toString()}`
  );
  return normalizeEntity<LibraryResource>(response);
}

export interface LibraryResourcePayload {
  title: string;
  description?: string;
  category: LibraryCategory;
  language: LibraryLanguage;
  author?: string;
  publishDate?: string;
  isActive: boolean;
  displayOrder: number;
  file?: number | null;
  coverImage?: number | null;
  slug?: string;
}

export async function createLibraryResource(payload: LibraryResourcePayload) {
  return strapiClient.post<LibraryResource>(ENDPOINT, { data: payload });
}

export async function updateLibraryResource(
  id: string | number,
  payload: Partial<LibraryResourcePayload>
) {
  return strapiClient.put<LibraryResource>(`${ENDPOINT}/${id}`, { data: payload });
}

export async function deleteLibraryResource(id: string | number) {
  return strapiClient.delete<LibraryResource>(`${ENDPOINT}/${id}`);
}

/**
 * Upload a single file through the admin /api/upload proxy. Returns the
 * Strapi media id of the uploaded file (first entry).
 */
export async function uploadLibraryMedia(file: File): Promise<LibraryMedia> {
  const formData = new FormData();
  formData.append('files', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${text || res.statusText}`);
  }

  const data = (await res.json()) as LibraryMedia[];
  if (!Array.isArray(data) || !data[0]?.id) {
    throw new Error('Upload did not return a media id');
  }
  return data[0];
}

/**
 * Turn a relative Strapi upload URL into an absolute one (for previews in the
 * admin UI, which runs on a different origin than the Strapi server).
 */
export function resolveMediaUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  return `${base}${url}`;
}
