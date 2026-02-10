/**
 * Moderation Review Form
 * Approve/reject moderation items with admin notes
 */

'use client';

import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FlagSeverityBadge, ModerationStatusBadge } from './ModerationBadge';

interface ModerationReviewProps {
  item: {
    id: string;
    content_type: string;
    content_id: string;
    content_title: string;
    status: string;
    ai_score: number | null;
    ai_flags: Array<{ type: string; severity: string; description: string }>;
    ai_reasoning: string | null;
    reviewer_notes: string | null;
    reviewed_at: string | null;
    createdAt: string;
  };
  onReview: (action: string, notes: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function ModerationReview({ item, onReview, isSubmitting }: ModerationReviewProps) {
  const [notes, setNotes] = useState(item.reviewer_notes || '');

  return (
    <div className="space-y-6">
      {/* AI Analysis */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-charcoal-900">AI Analysis</h3>

        {item.ai_reasoning ? (
          <>
            <div className="mb-4">
              <p className="text-sm font-medium text-charcoal-600">AI Reasoning</p>
              <p className="mt-1 text-charcoal-800">{item.ai_reasoning}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-charcoal-600">Safety Score</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-charcoal-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (item.ai_score || 0) >= 0.8
                        ? 'bg-green-500'
                        : (item.ai_score || 0) >= 0.5
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${(item.ai_score || 0) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-charcoal-700">
                  {Math.round((item.ai_score || 0) * 100)}%
                </span>
              </div>
            </div>

            {item.ai_flags && item.ai_flags.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-charcoal-600">Flags</p>
                <div className="space-y-2">
                  {item.ai_flags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg bg-charcoal-50 p-3">
                      <FlagSeverityBadge type={flag.type} severity={flag.severity} />
                      <p className="text-sm text-charcoal-700">{flag.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-charcoal-500">AI analysis not yet available. Content will be reviewed manually.</p>
        )}
      </Card>

      {/* Review Form */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-charcoal-900">Admin Review</h3>

        <div className="mb-4">
          <p className="text-sm font-medium text-charcoal-600">Current Status</p>
          <div className="mt-1">
            <ModerationStatusBadge status={item.status} />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="reviewer-notes" className="mb-1 block text-sm font-medium text-charcoal-700">
            Review Notes
          </label>
          <textarea
            id="reviewer-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this review decision..."
            rows={4}
            className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => onReview('approve', notes)}
            disabled={isSubmitting}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button
            onClick={() => onReview('needs_review', notes)}
            disabled={isSubmitting}
            variant="outline"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Needs Review
          </Button>
          <Button
            onClick={() => onReview('reject', notes)}
            disabled={isSubmitting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      </Card>
    </div>
  );
}
