/**
 * Moderation Status & Flag Badges
 */

'use client';

import { Badge } from '@/components/ui/badge';

const STATUS_VARIANTS: Record<string, string> = {
  pending: 'default',
  approved: 'success',
  rejected: 'danger',
  needs_review: 'warning',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  needs_review: 'Needs Review',
};

export function ModerationStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] as any || 'default'}>
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

const SEVERITY_VARIANTS: Record<string, string> = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
};

export function FlagSeverityBadge({
  type,
  severity,
}: {
  type: string;
  severity: string;
}) {
  return (
    <Badge variant={SEVERITY_VARIANTS[severity] as any || 'default'}>
      {type} ({severity})
    </Badge>
  );
}

export function AIScoreBadge({ score }: { score: number | null | undefined }) {
  if (score == null) return <span className="text-charcoal-400">N/A</span>;

  const percentage = Math.round(score * 100);
  let variant: string = 'success';
  if (percentage < 50) variant = 'danger';
  else if (percentage < 80) variant = 'warning';

  return (
    <Badge variant={variant as any}>
      {percentage}%
    </Badge>
  );
}
