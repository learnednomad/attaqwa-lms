/**
 * AI Quiz Generator Component
 * Modal to generate quiz questions from lesson content,
 * edit them before saving as a Quiz entity.
 */

'use client';

import { Sparkles, Trash2, Edit, Save, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface GeneratedQuestion {
  question: string;
  type: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

interface AIQuizGeneratorProps {
  lessonContent: string;
  lessonTitle: string;
  difficulty?: string;
  onSave: (questions: GeneratedQuestion[]) => void;
  onClose: () => void;
}

export function AIQuizGenerator({
  lessonContent,
  lessonTitle,
  difficulty = 'intermediate',
  onSave,
  onClose,
}: AIQuizGeneratorProps) {
  const { token } = useAuth();
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const generateQuiz = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/ai/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          content: lessonContent,
          questionCount,
          difficulty,
        }),
      });

      if (res.status === 503) {
        setError('AI service is unavailable. Please try again later.');
        return;
      }

      if (!res.ok) {
        setError('Failed to generate quiz. Please try again.');
        return;
      }

      const json = await res.json();
      setQuestions(json.data.questions || []);
    } catch (err) {
      setError('Failed to connect to AI service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, updated: GeneratedQuestion) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? updated : q)));
    setEditingIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-charcoal-900">AI Quiz Generator</h2>
            <p className="text-sm text-charcoal-600">Generate questions from: {lessonTitle}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-charcoal-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Controls */}
          {questions.length === 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-charcoal-700">
                    Number of Questions
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm"
                  >
                    {[3, 5, 7, 10].map((n) => (
                      <option key={n} value={n}>{n} questions</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1" />
                <Button onClick={generateQuiz} disabled={isGenerating}>
                  <Sparkles className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                  {isGenerating ? 'Generating...' : 'Generate Quiz'}
                </Button>
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </Card>
          )}

          {/* Generated Questions */}
          {questions.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-charcoal-600">
                  {questions.length} question{questions.length !== 1 ? 's' : ''} generated
                </p>
                <Button variant="outline" onClick={generateQuiz} disabled={isGenerating}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>

              {questions.map((q, index) => (
                <Card key={index} className="p-4">
                  {editingIndex === index ? (
                    <QuestionEditor
                      question={q}
                      onSave={(updated) => updateQuestion(index, updated)}
                      onCancel={() => setEditingIndex(null)}
                    />
                  ) : (
                    <div>
                      <div className="mb-2 flex items-start justify-between">
                        <p className="font-medium text-charcoal-900">
                          Q{index + 1}: {q.question}
                        </p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingIndex(index)}
                            className="rounded p-1 text-charcoal-600 hover:bg-charcoal-50"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeQuestion(index)}
                            className="rounded p-1 text-red-600 hover:bg-red-50"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-2 space-y-1">
                        {q.options.map((opt, i) => (
                          <p
                            key={i}
                            className={`text-sm ${opt === q.correctAnswer ? 'font-medium text-green-700' : 'text-charcoal-600'}`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                            {opt === q.correctAnswer && ' (correct)'}
                          </p>
                        ))}
                      </div>

                      {q.explanation && (
                        <p className="text-xs text-charcoal-500">
                          Explanation: {q.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              ))}

              {/* Save */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={() => onSave(questions)} disabled={questions.length === 0}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Quiz ({questions.length} questions)
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionEditor({
  question,
  onSave,
  onCancel,
}: {
  question: GeneratedQuestion;
  onSave: (q: GeneratedQuestion) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState({ ...question });

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-charcoal-600">Question</label>
        <input
          value={q.question}
          onChange={(e) => setQ({ ...q, question: e.target.value })}
          className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm"
        />
      </div>

      {q.options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-sm font-medium text-charcoal-600">
            {String.fromCharCode(65 + i)}.
          </span>
          <input
            value={opt}
            onChange={(e) => {
              const newOpts = [...q.options];
              newOpts[i] = e.target.value;
              setQ({ ...q, options: newOpts });
            }}
            className="flex-1 rounded-lg border border-charcoal-300 px-3 py-1.5 text-sm"
          />
          <input
            type="radio"
            name="correct"
            checked={q.correctAnswer === opt}
            onChange={() => setQ({ ...q, correctAnswer: opt })}
          />
        </div>
      ))}

      <div>
        <label className="mb-1 block text-xs font-medium text-charcoal-600">Explanation</label>
        <textarea
          value={q.explanation}
          onChange={(e) => setQ({ ...q, explanation: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(q)}>Save</Button>
      </div>
    </div>
  );
}
