/**
 * Moderation Queue Table
 * Paginated, filterable table for moderation queue items
 */

'use client';

import { Eye } from 'lucide-react';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AIScoreBadge, ModerationStatusBadge } from './ModerationBadge';

interface ModerationItem {
  id: string;
  content_type: string;
  content_id: string;
  content_title: string;
  status: string;
  ai_score: number | null;
  ai_flags: any[];
  ai_reasoning: string | null;
  reviewer_notes: string | null;
  reviewed_at: string | null;
  createdAt: string;
}

interface ModerationTableProps {
  items: ModerationItem[];
  isLoading?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatContentType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function ModerationTable({ items, isLoading }: ModerationTableProps) {
  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        <p className="text-charcoal-600">Loading moderation queue...</p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Content</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>AI Score</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <p className="font-medium text-charcoal-900">
                  {item.content_title}
                </p>
              </TableCell>
              <TableCell className="text-charcoal-600">
                {formatContentType(item.content_type)}
              </TableCell>
              <TableCell>
                <ModerationStatusBadge status={item.status} />
              </TableCell>
              <TableCell>
                <AIScoreBadge score={item.ai_score} />
              </TableCell>
              <TableCell className="text-charcoal-600">
                {item.ai_flags?.length || 0} flag{(item.ai_flags?.length || 0) !== 1 ? 's' : ''}
              </TableCell>
              <TableCell className="text-charcoal-600">
                {formatDate(item.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/moderation/${item.id}`}>
                  <button
                    className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
                    aria-label="Review item"
                    title="Review"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {items.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-charcoal-500">No items in the moderation queue</p>
        </div>
      )}
    </Card>
  );
}
