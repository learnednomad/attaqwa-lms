/**
 * AI Service
 * Core service orchestrating all AI operations:
 * moderation, summarization, tagging, quiz generation, search, and recommendations.
 */

import * as ollamaClient from './ollama-client';
import * as jobQueue from './job-queue';
import {
  SYSTEM_CONTEXT,
  MODERATION_PROMPT,
  SUMMARIZATION_PROMPT,
  TAGGING_PROMPT,
  QUIZ_GENERATION_PROMPT,
} from './prompt-templates';

// ============================================================================
// Types
// ============================================================================

export interface ModerationResult {
  score: number;
  flags: ModerationFlag[];
  reasoning: string;
  recommendation: 'approve' | 'needs_review' | 'reject';
}

export interface ModerationFlag {
  type: 'ACCURACY' | 'AGE_APPROPRIATENESS' | 'CULTURAL_SENSITIVITY' | 'QUALITY' | 'SAFETY';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface TagSuggestion {
  subject: string;
  difficulty: string;
  ageTier: string;
  keywords: string[];
}

export interface QuizGenerationResult {
  questions: Array<{
    question: string;
    type: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    points: number;
  }>;
}

// ============================================================================
// Helper: Parse JSON from LLM response
// ============================================================================

function parseJsonResponse<T>(response: string): T {
  // Try to find JSON in the response (LLMs sometimes wrap in markdown code blocks)
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in AI response');
  }
  return JSON.parse(jsonMatch[0]) as T;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function chunkText(text: string, maxChunkSize: number = 3000): string[] {
  if (text.length <= maxChunkSize) return [text];

  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxChunkSize;
    // Try to break at a sentence boundary
    if (end < text.length) {
      const sentenceEnd = text.lastIndexOf('.', end);
      if (sentenceEnd > start + maxChunkSize / 2) {
        end = sentenceEnd + 1;
      }
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks;
}

// ============================================================================
// Service Methods
// ============================================================================

/**
 * Check if AI services are available.
 */
export async function health() {
  const ollamaHealth = await ollamaClient.getHealth();
  const queueStats = jobQueue.getQueueStats();

  return {
    ollama: ollamaHealth,
    queue: queueStats,
    features: {
      moderation: process.env.AI_MODERATION_ENABLED !== 'false',
      search: process.env.AI_SEARCH_ENABLED !== 'false',
      recommendations: process.env.AI_RECOMMENDATIONS_ENABLED !== 'false',
    },
  };
}

/**
 * Moderate content for Islamic educational appropriateness.
 * Returns a job if async, or direct result if Ollama responds quickly.
 */
export async function moderate(
  content: string,
  contentType: string,
  ageTier?: string
): Promise<ModerationResult> {
  const available = await ollamaClient.isAvailable();
  if (!available) {
    throw new Error('AI service unavailable');
  }

  const cleanContent = stripHtml(content);
  const truncated = cleanContent.slice(0, 4000); // Limit input size
  const prompt = MODERATION_PROMPT(truncated, contentType, ageTier);

  const response = await ollamaClient.generate(prompt, {
    system: SYSTEM_CONTEXT,
    temperature: 0.1, // Low temperature for consistent moderation
  });

  return parseJsonResponse<ModerationResult>(response);
}

/**
 * Submit moderation as an async job (for lifecycle hooks).
 */
export function moderateAsync(
  content: string,
  contentType: string,
  ageTier?: string
) {
  return jobQueue.submitJob<ModerationResult>('moderation', () =>
    moderate(content, contentType, ageTier)
  );
}

/**
 * Generate a summary of educational content.
 */
export async function summarize(content: string): Promise<string> {
  const available = await ollamaClient.isAvailable();
  if (!available) {
    throw new Error('AI service unavailable');
  }

  const cleanContent = stripHtml(content);
  const chunks = chunkText(cleanContent);

  if (chunks.length === 1) {
    const prompt = SUMMARIZATION_PROMPT(chunks[0]);
    return ollamaClient.generate(prompt, {
      system: SYSTEM_CONTEXT,
      temperature: 0.3,
    });
  }

  // For long content, summarize each chunk then combine
  const chunkSummaries: string[] = [];
  for (const chunk of chunks) {
    const prompt = SUMMARIZATION_PROMPT(chunk);
    const summary = await ollamaClient.generate(prompt, {
      system: SYSTEM_CONTEXT,
      temperature: 0.3,
    });
    chunkSummaries.push(summary);
  }

  // Final summarization pass
  const combinedPrompt = SUMMARIZATION_PROMPT(chunkSummaries.join('\n\n'));
  return ollamaClient.generate(combinedPrompt, {
    system: SYSTEM_CONTEXT,
    temperature: 0.3,
  });
}

/**
 * Generate tag suggestions for content.
 */
export async function generateTags(
  content: string,
  title: string
): Promise<TagSuggestion> {
  const available = await ollamaClient.isAvailable();
  if (!available) {
    throw new Error('AI service unavailable');
  }

  const cleanContent = stripHtml(content).slice(0, 4000);
  const prompt = TAGGING_PROMPT(cleanContent, title);

  const response = await ollamaClient.generate(prompt, {
    system: SYSTEM_CONTEXT,
    temperature: 0.2,
  });

  return parseJsonResponse<TagSuggestion>(response);
}

/**
 * Generate quiz questions from educational content.
 */
export async function generateQuiz(
  content: string,
  questionCount: number = 5,
  difficulty: string = 'intermediate'
): Promise<QuizGenerationResult> {
  const available = await ollamaClient.isAvailable();
  if (!available) {
    throw new Error('AI service unavailable');
  }

  const cleanContent = stripHtml(content).slice(0, 4000);
  const prompt = QUIZ_GENERATION_PROMPT(cleanContent, questionCount, difficulty);

  const response = await ollamaClient.generate(prompt, {
    system: SYSTEM_CONTEXT,
    temperature: 0.5, // Slightly more creative for diverse questions
    maxTokens: 4096,
  });

  return parseJsonResponse<QuizGenerationResult>(response);
}

/**
 * Get the status of an async AI job.
 */
export function getJob(jobId: string) {
  return jobQueue.getJob(jobId);
}
