/**
 * AI Suggestions Component
 * "AI Suggest" button for course/lesson forms.
 * Auto-populates fields with accept/reject per field.
 */

'use client';

import { Sparkles, Check, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface AISuggestionsProps {
  content: string;
  title: string;
  onAcceptField: (field: string, value: any) => void;
}

interface TagSuggestion {
  subject: string;
  difficulty: string;
  ageTier: string;
  keywords: string[];
}

export function AISuggestions({ content, title, onAcceptField }: AISuggestionsProps) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TagSuggestion | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acceptedFields, setAcceptedFields] = useState<Set<string>>(new Set());

  const fetchSuggestions = async () => {
    if (!content || !title) return;
    setIsLoading(true);
    setError(null);

    try {
      const [tagsRes, summaryRes] = await Promise.allSettled([
        fetch(`${API_URL}/api/v1/ai/generate-tags`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content, title }),
        }),
        fetch(`${API_URL}/api/v1/ai/summarize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content }),
        }),
      ]);

      if (tagsRes.status === 'fulfilled' && tagsRes.value.ok) {
        const json = await tagsRes.value.json();
        setSuggestions(json.data);
      }

      if (summaryRes.status === 'fulfilled' && summaryRes.value.ok) {
        const json = await summaryRes.value.json();
        setSummary(json.data.summary);
      }
    } catch (err: any) {
      setError('AI service is unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptField = (field: string, value: any) => {
    onAcceptField(field, value);
    setAcceptedFields((prev) => new Set(prev).add(field));
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={fetchSuggestions}
        disabled={isLoading || !content || !title}
      >
        <Sparkles className={`mr-2 h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
        {isLoading ? 'Analyzing...' : 'AI Suggest'}
      </Button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {(suggestions || summary) && (
        <Card className="space-y-4 p-4">
          <h4 className="text-sm font-semibold text-charcoal-700">AI Suggestions</h4>

          {summary && (
            <SuggestionRow
              label="Summary"
              value={summary}
              field="description"
              accepted={acceptedFields.has('description')}
              onAccept={() => acceptField('description', summary)}
            />
          )}

          {suggestions?.subject && (
            <SuggestionRow
              label="Subject"
              value={suggestions.subject}
              field="subject"
              accepted={acceptedFields.has('subject')}
              onAccept={() => acceptField('subject', suggestions.subject)}
            />
          )}

          {suggestions?.difficulty && (
            <SuggestionRow
              label="Difficulty"
              value={suggestions.difficulty}
              field="difficulty"
              accepted={acceptedFields.has('difficulty')}
              onAccept={() => acceptField('difficulty', suggestions.difficulty)}
            />
          )}

          {suggestions?.ageTier && (
            <SuggestionRow
              label="Age Tier"
              value={suggestions.ageTier}
              field="age_tier"
              accepted={acceptedFields.has('age_tier')}
              onAccept={() => acceptField('age_tier', suggestions.ageTier)}
            />
          )}

          {suggestions?.keywords && suggestions.keywords.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-xs font-medium text-charcoal-500">Keywords</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {suggestions.keywords.map((kw) => (
                    <Badge key={kw} variant="info">{kw}</Badge>
                  ))}
                </div>
              </div>
              {!acceptedFields.has('keywords') ? (
                <button
                  onClick={() => acceptField('keywords', suggestions.keywords)}
                  className="rounded p-1 text-green-600 hover:bg-green-50"
                  title="Accept"
                >
                  <Check className="h-4 w-4" />
                </button>
              ) : (
                <Badge variant="success">Accepted</Badge>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function SuggestionRow({
  label,
  value,
  field,
  accepted,
  onAccept,
}: {
  label: string;
  value: string;
  field: string;
  accepted: boolean;
  onAccept: () => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <p className="text-xs font-medium text-charcoal-500">{label}</p>
        <p className="mt-0.5 text-sm text-charcoal-800">{value}</p>
      </div>
      {!accepted ? (
        <button
          onClick={onAccept}
          className="rounded p-1 text-green-600 hover:bg-green-50"
          title="Accept suggestion"
        >
          <Check className="h-4 w-4" />
        </button>
      ) : (
        <Badge variant="success">Accepted</Badge>
      )}
    </div>
  );
}
