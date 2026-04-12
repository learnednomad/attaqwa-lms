/**
 * AI Tools Panel
 * Contextual AI helpers surfaced inside the lesson drawer. Buttons adapt to
 * the chosen lesson type. Generated content is a *draft* — authors review
 * and paste into the form manually.
 *
 * Why clipboard-based rather than direct injection? The existing LessonForm
 * owns its state internally; round-tripping AI output through imperative
 * handles would require refactoring a 900-line component. Clipboard + a
 * visible "draft ready" banner preserves the UX win (discovery at point of
 * need) while keeping the blast radius small.
 */

'use client';

import { ClipboardCopy, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { AIQuizGenerator } from '@/components/lessons/AIQuizGenerator';
import type { LessonType } from '@/components/lessons/lesson-type-badge';
import { Button } from '@/components/ui/button';
import { strapiClient } from '@/lib/api/strapi-client';
import { cn } from '@/lib/utils/cn';

interface AIToolsPanelProps {
  lessonType: LessonType | null;
  lessonTitle: string;
  lessonContent: string;
}

type SuggestResult = {
  summary?: string;
  subject?: string;
  difficulty?: string;
  keywords?: string[];
};

export function AIToolsPanel({ lessonType, lessonTitle, lessonContent }: AIToolsPanelProps) {
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [questionsReady, setQuestionsReady] = useState<unknown[] | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestResult | null>(null);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const hasContent = lessonContent.trim().length > 20;
  const hasTitle = lessonTitle.trim().length >= 3;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore — some browsers/contexts block clipboard
    }
  };

  const fetchSuggestions = async () => {
    if (!hasTitle || !hasContent) return;
    setSuggestLoading(true);
    setSuggestError(null);
    try {
      const [tagsRes, summaryRes] = await Promise.allSettled([
        strapiClient.post<{ subject?: string; difficulty?: string; keywords?: string[] }>(
          '/v1/ai/generate-tags',
          { content: lessonContent, title: lessonTitle }
        ),
        strapiClient.post<{ summary?: string }>('/v1/ai/summarize', {
          content: lessonContent,
        }),
      ]);

      const next: SuggestResult = {};
      if (tagsRes.status === 'fulfilled') {
        const d = (tagsRes.value as any).data ?? {};
        next.subject = d.subject;
        next.difficulty = d.difficulty;
        next.keywords = d.keywords;
      }
      if (summaryRes.status === 'fulfilled') {
        const d = (summaryRes.value as any).data ?? {};
        next.summary = d.summary;
      }
      setSuggestions(next);
    } catch {
      setSuggestError('AI service is unavailable. Please try again later.');
    } finally {
      setSuggestLoading(false);
    }
  };

  if (!lessonType) return null;

  return (
    <aside
      aria-label="AI tools"
      className="rounded-lg border border-dashed border-primary-300 bg-primary-50/60 p-4"
    >
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-primary-900">AI assistant</h4>
            <p className="text-xs text-primary-800/80">
              Drafts below are suggestions — review before saving.
            </p>
          </div>

          {/* Quiz-specific action */}
          {lessonType === 'quiz' ? (
            <div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuizModalOpen(true)}
                disabled={!hasContent}
                title={!hasContent ? 'Add some lesson content first.' : undefined}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate questions with AI
              </Button>
              {questionsReady ? (
                <div className="mt-2 flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs text-charcoal-700 ring-1 ring-primary-200">
                  <span>{questionsReady.length} draft questions copied to clipboard.</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copy(JSON.stringify(questionsReady, null, 2))}
                  >
                    <ClipboardCopy className="mr-1 h-3 w-3" />
                    Copy again
                  </Button>
                </div>
              ) : null}
              {!hasContent ? (
                <p className="mt-1 text-[11px] text-primary-800/70">
                  Tip: paste the lesson body first so questions reflect the actual material.
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Video / reading — summarize + tag */}
          {(lessonType === 'video' ||
            lessonType === 'reading' ||
            lessonType === 'practice' ||
            lessonType === 'interactive') && (
            <div>
              <Button
                size="sm"
                variant="outline"
                onClick={fetchSuggestions}
                disabled={suggestLoading || !hasContent || !hasTitle}
              >
                {suggestLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest summary &amp; tags
              </Button>
              {suggestError ? (
                <p className="mt-2 text-xs text-red-600">{suggestError}</p>
              ) : null}
              {suggestions ? (
                <div className="mt-2 space-y-2 rounded-md bg-white p-3 ring-1 ring-primary-200">
                  {suggestions.summary ? (
                    <SuggestionLine
                      label="Summary"
                      value={suggestions.summary}
                      onCopy={() => copy(suggestions.summary!)}
                    />
                  ) : null}
                  {suggestions.subject ? (
                    <SuggestionLine
                      label="Subject"
                      value={suggestions.subject}
                      onCopy={() => copy(suggestions.subject!)}
                    />
                  ) : null}
                  {suggestions.difficulty ? (
                    <SuggestionLine
                      label="Difficulty"
                      value={suggestions.difficulty}
                      onCopy={() => copy(suggestions.difficulty!)}
                    />
                  ) : null}
                  {suggestions.keywords && suggestions.keywords.length ? (
                    <SuggestionLine
                      label="Keywords"
                      value={suggestions.keywords.join(', ')}
                      onCopy={() => copy(suggestions.keywords!.join(', '))}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {quizModalOpen ? (
        <AIQuizGenerator
          lessonTitle={lessonTitle || 'Untitled lesson'}
          lessonContent={lessonContent}
          difficulty="intermediate"
          onClose={() => setQuizModalOpen(false)}
          onSave={(questions) => {
            setQuestionsReady(questions);
            copy(JSON.stringify(questions, null, 2));
            setQuizModalOpen(false);
          }}
        />
      ) : null}
    </aside>
  );
}

function SuggestionLine({
  label,
  value,
  onCopy,
  className,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-charcoal-500">
          {label}
        </p>
        <p className="mt-0.5 break-words text-xs text-charcoal-800">{value}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 rounded p-1 text-charcoal-500 hover:bg-charcoal-100 hover:text-charcoal-900"
        aria-label={`Copy ${label.toLowerCase()}`}
        title="Copy to clipboard"
      >
        <ClipboardCopy className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
