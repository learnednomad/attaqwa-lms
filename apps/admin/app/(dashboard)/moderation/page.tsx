/**
 * Moderation Queue Page
 * View and manage content moderation items
 */

'use client';

import { RefreshCw, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ModerationTable } from '@/components/moderation/ModerationTable';
import { useAuth } from '@/lib/hooks/use-auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export default function ModerationPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('sort', 'createdAt:desc');
      params.append('pagination[pageSize]', '50');

      if (statusFilter !== 'all') {
        params.append('filters[status][$eq]', statusFilter);
      }
      if (contentTypeFilter !== 'all') {
        params.append('filters[content_type][$eq]', contentTypeFilter);
      }

      const res = await fetch(`${API_URL}/api/v1/moderation-queues?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const json = await res.json();
        setItems(json.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch moderation queue:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token, statusFilter, contentTypeFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'needs_review', label: 'Needs Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const contentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'course', label: 'Course' },
    { value: 'lesson', label: 'Lesson' },
    { value: 'quiz', label: 'Quiz' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Content Moderation</h1>
          <p className="mt-2 text-charcoal-600">
            Review AI-flagged content and manage approvals
          </p>
        </div>
        <Button variant="outline" onClick={fetchItems} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {contentTypes.map((ct) => (
                <option key={ct.value} value={ct.value}>{ct.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <ModerationTable items={items} isLoading={isLoading} />
    </div>
  );
}
