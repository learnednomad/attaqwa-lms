/**
 * Library Management — list page
 * View, filter, edit, and delete library resources (PDFs / downloads shown on
 * the public website).
 */

'use client';

import { Download, Edit, Eye, EyeOff, Loader2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils/formatters';

import {
  LIBRARY_CATEGORIES,
  LIBRARY_CATEGORY_LABELS,
  LIBRARY_LANGUAGES,
  LIBRARY_LANGUAGE_LABELS,
  type LibraryCategory,
  type LibraryLanguage,
  type LibraryResource,
  deleteLibraryResource,
  listLibraryResources,
  resolveMediaUrl,
  updateLibraryResource,
} from '@/lib/api/library';

type CategoryFilter = LibraryCategory | 'all';
type LanguageFilter = LibraryLanguage | 'all';
type StatusFilter = 'all' | 'active' | 'hidden';

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [language, setLanguage] = useState<LanguageFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | number | null>(null);

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const { items } = await listLibraryResources({
        q: query || null,
        category,
        language,
        isActive: status === 'all' ? 'all' : status === 'active',
        pageSize: 100,
      });
      setResources(items);
    } catch (error) {
      console.error('Failed to fetch library resources:', error);
      setResources([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, category, language, status]);

  useEffect(() => {
    const timer = setTimeout(fetchResources, 300);
    return () => clearTimeout(timer);
  }, [fetchResources]);

  const toggleActive = async (resource: LibraryResource) => {
    const id = resource.documentId || resource.id;
    setMutatingId(id);
    try {
      await updateLibraryResource(id, { isActive: !resource.isActive });
      await fetchResources();
    } catch (error) {
      console.error('Failed to toggle active state:', error);
      alert('Could not update this resource. Check the console for details.');
    } finally {
      setMutatingId(null);
    }
  };

  const handleDelete = async (resource: LibraryResource) => {
    if (!confirm(`Delete "${resource.title}"? This cannot be undone.`)) return;
    const id = resource.documentId || resource.id;
    setMutatingId(id);
    try {
      await deleteLibraryResource(id);
      await fetchResources();
    } catch (error) {
      console.error('Failed to delete library resource:', error);
      alert('Delete failed. Check the console for details.');
    } finally {
      setMutatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Library</h1>
          <p className="mt-2 text-charcoal-600">
            Books, worksheets, and downloadable resources shown on the public library page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchResources}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/library/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Resource
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-charcoal-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryFilter)}
              className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All categories</option>
              {LIBRARY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {LIBRARY_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageFilter)}
              className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All languages</option>
              {LIBRARY_LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {LIBRARY_LANGUAGE_LABELS[l]}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary-500" />
            <span className="text-charcoal-500">Loading library...</span>
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-medium text-charcoal-800">No resources found</p>
            <p className="mt-1 text-xs text-charcoal-500">
              {query || category !== 'all' || language !== 'all' || status !== 'all'
                ? 'Try clearing the filters, or'
                : 'Upload your first PDF to'}{' '}
              <Link href="/library/new" className="text-primary-600 hover:underline">
                add a new resource
              </Link>
              .
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => {
                const id = resource.documentId || resource.id;
                const fileUrl = resolveMediaUrl(resource.file?.url);
                const isMutating = mutatingId === id;
                return (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-charcoal-900">{resource.title}</p>
                        <p className="text-xs text-charcoal-500">
                          {resource.author || '—'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">
                        {LIBRARY_CATEGORY_LABELS[resource.category]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-charcoal-600">
                      {LIBRARY_LANGUAGE_LABELS[resource.language]}
                    </TableCell>
                    <TableCell>
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {resource.file?.ext?.replace('.', '').toUpperCase() || 'File'}
                        </a>
                      ) : (
                        <span className="text-xs text-charcoal-400">No file</span>
                      )}
                    </TableCell>
                    <TableCell className="text-charcoal-600">{resource.displayOrder}</TableCell>
                    <TableCell>
                      <Badge variant={resource.isActive ? 'success' : 'default'}>
                        {resource.isActive ? 'Active' : 'Hidden'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-charcoal-600">
                      {formatDate(resource.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => toggleActive(resource)}
                          disabled={isMutating}
                          className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-50"
                          aria-label={resource.isActive ? 'Hide from public library' : 'Show on public library'}
                          title={resource.isActive ? 'Hide from public library' : 'Show on public library'}
                        >
                          {resource.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <Link href={`/library/${id}`}>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
                            aria-label="Edit"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(resource)}
                          disabled={isMutating}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          aria-label="Delete"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
