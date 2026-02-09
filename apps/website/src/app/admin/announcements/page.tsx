'use client';

import { useState } from 'react';
import { useAnnouncements, useDeleteAnnouncement } from '@/lib/hooks/useAnnouncements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileText, Eye, Pin } from 'lucide-react';
import Link from 'next/link';
import { formatDate, truncateText } from '@attaqwa/shared';
import type { Announcement, AnnouncementCategory } from '@/types';

const categoryColors: Record<AnnouncementCategory, string> = {
  general: 'bg-gray-100 text-gray-800',
  ramadan: 'bg-purple-100 text-purple-800',
  eid: 'bg-green-100 text-green-800',
  urgent: 'bg-red-100 text-red-800',
  community: 'bg-blue-100 text-blue-800',
  fundraising: 'bg-yellow-100 text-yellow-800',
};

export default function AnnouncementsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data, isLoading, error } = useAnnouncements({
    page: currentPage,
    limit: 10,
  });

  const deleteMutation = useDeleteAnnouncement();

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-red-600">
              Error loading announcements: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allAnnouncements: Announcement[] = data?.data || [];
  const announcements = categoryFilter === 'all'
    ? allAnnouncements
    : allAnnouncements.filter(a => a.category === categoryFilter);
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        <Button asChild className="bg-islamic-green-600 hover:bg-islamic-green-700">
          <Link href="/admin/announcements/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Link>
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategoryFilter('all')}
        >
          All
        </Button>
        {(['general', 'ramadan', 'eid', 'urgent', 'community', 'fundraising'] as AnnouncementCategory[]).map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter(cat)}
          >
            <span className="capitalize">{cat}</span>
          </Button>
        ))}
      </div>

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {pagination && `${pagination.total} Total Items`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No announcements found.</p>
              <Button asChild>
                <Link href="/admin/announcements/new">Create your first announcement</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                      <div className="flex items-center space-x-2">
                        {announcement.category && (
                          <Badge className={categoryColors[announcement.category]}>
                            <span className="capitalize">{announcement.category}</span>
                          </Badge>
                        )}
                        {announcement.isPinned && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            <Pin className="w-3 h-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                        <Badge
                          variant={announcement.isActive ? 'default' : 'secondary'}
                          className={
                            announcement.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {announcement.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                      {truncateText(announcement.content.replace(/<[^>]*>/g, ''), 150)}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Created: {formatDate(new Date(announcement.createdAt))}</span>
                      {announcement.imageUrl && (
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          Has Image
                        </span>
                      )}
                      {announcement.pdfUrl && (
                        <span className="flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          Has PDF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/announcements/${announcement.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(announcement.id, announcement.title)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600 px-3">
            Page {currentPage} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
