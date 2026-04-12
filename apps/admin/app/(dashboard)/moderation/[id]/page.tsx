/**
 * Moderation Review Detail Page
 * View AI analysis and approve/reject content
 */

'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ModerationReview } from '@/components/moderation/ModerationReview';
import { ModerationStatusBadge, AIScoreBadge } from '@/components/moderation/ModerationBadge';
import { strapiClient, adminApiEndpoints } from '@/lib/api/strapi-client';

interface ModerationItem {
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
}

export default function ModerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<ModerationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItem = useCallback(async () => {
    try {
      const json = await strapiClient.get(adminApiEndpoints.moderationQueues + '/' + id + '?populate=reviewer');
      setItem((json as any).data);
    } catch (error) {
      console.error('Failed to fetch moderation item:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const handleReview = async (action: string, notes: string) => {
    setIsSubmitting(true);
    try {
      await strapiClient.put(adminApiEndpoints.moderationQueues + '/' + id + '/review', { action, notes });
      router.push('/moderation');
    } catch (error) {
      console.error('Review failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-charcoal-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <Link href="/moderation">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Queue
          </Button>
        </Link>
        <Card className="p-8 text-center">
          <p className="text-charcoal-500">Moderation item not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/moderation">
            <Button variant="outline" className="h-10 w-10 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-charcoal-900">{item.content_title}</h1>
            <p className="text-charcoal-600">
              {item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)} - ID: {item.content_id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AIScoreBadge score={item.ai_score} />
          <ModerationStatusBadge status={item.status} />
        </div>
      </div>

      {/* Review */}
      <ModerationReview
        item={item}
        onReview={handleReview}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
