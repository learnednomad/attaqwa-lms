/**
 * AI Controller
 * Handles HTTP requests for AI endpoints, validates input, and delegates to the AI service.
 */

import * as aiService from '../services/ai';
import * as embeddingService from '../services/embedding-service';
import * as recommendationService from '../services/recommendation-service';

// `strapi` is globally typed via @strapi/types

const MAX_CONTENT_LENGTH = 50000; // 50KB max for AI content input

function validateContentLength(content: string, ctx: any): boolean {
  if (content.length > MAX_CONTENT_LENGTH) {
    ctx.status = 413;
    ctx.body = { error: { message: `Content too large. Maximum ${MAX_CONTENT_LENGTH} characters allowed.` } };
    return false;
  }
  return true;
}

export default {
  /**
   * GET /api/v1/ai/health
   * Returns AI service health status. Public for monitoring.
   */
  async health(ctx: any) {
    try {
      const status = await aiService.health();
      ctx.body = { data: status };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to check AI health', details: error.message } };
    }
  },

  /**
   * POST /api/v1/ai/moderate
   * Moderate content for Islamic educational appropriateness.
   */
  async moderate(ctx: any) {
    const { content, contentType, ageTier, async: isAsync } = ctx.request.body;

    if (!content || !contentType) {
      ctx.status = 400;
      ctx.body = { error: { message: 'content and contentType are required' } };
      return;
    }

    if (!validateContentLength(content, ctx)) return;

    try {
      if (isAsync) {
        const job = aiService.moderateAsync(content, contentType, ageTier);
        ctx.status = 202;
        ctx.body = { data: { jobId: job.id, status: job.status } };
        return;
      }

      const result = await aiService.moderate(content, contentType, ageTier);
      ctx.body = { data: result };
    } catch (error: any) {
      if (error.message === 'AI service unavailable') {
        ctx.status = 503;
        ctx.body = { error: { message: 'AI service is currently unavailable. Content must be reviewed manually.' } };
        return;
      }
      ctx.status = 500;
      ctx.body = { error: { message: 'Moderation failed', details: error.message } };
    }
  },

  /**
   * POST /api/v1/ai/summarize
   * Generate a summary of educational content.
   */
  async summarize(ctx: any) {
    const { content } = ctx.request.body;

    if (!content) {
      ctx.status = 400;
      ctx.body = { error: { message: 'content is required' } };
      return;
    }

    if (!validateContentLength(content, ctx)) return;

    try {
      const summary = await aiService.summarize(content);
      ctx.body = { data: { summary } };
    } catch (error: any) {
      if (error.message === 'AI service unavailable') {
        ctx.status = 503;
        ctx.body = { error: { message: 'AI service is currently unavailable.' } };
        return;
      }
      ctx.status = 500;
      ctx.body = { error: { message: 'Summarization failed', details: error.message } };
    }
  },

  /**
   * POST /api/v1/ai/generate-tags
   * Generate tag suggestions for content.
   */
  async generateTags(ctx: any) {
    const { content, title } = ctx.request.body;

    if (!content || !title) {
      ctx.status = 400;
      ctx.body = { error: { message: 'content and title are required' } };
      return;
    }

    if (!validateContentLength(content, ctx)) return;

    try {
      const tags = await aiService.generateTags(content, title);
      ctx.body = { data: tags };
    } catch (error: any) {
      if (error.message === 'AI service unavailable') {
        ctx.status = 503;
        ctx.body = { error: { message: 'AI service is currently unavailable.' } };
        return;
      }
      ctx.status = 500;
      ctx.body = { error: { message: 'Tag generation failed', details: error.message } };
    }
  },

  /**
   * POST /api/v1/ai/generate-quiz
   * Generate quiz questions from educational content.
   */
  async generateQuiz(ctx: any) {
    const { content, questionCount, difficulty } = ctx.request.body;

    if (!content) {
      ctx.status = 400;
      ctx.body = { error: { message: 'content is required' } };
      return;
    }

    if (!validateContentLength(content, ctx)) return;

    const count = Math.min(Math.max(parseInt(questionCount) || 5, 1), 20);
    const diff = ['beginner', 'intermediate', 'advanced'].includes(difficulty)
      ? difficulty
      : 'intermediate';

    try {
      const quiz = await aiService.generateQuiz(content, count, diff);
      ctx.body = { data: quiz };
    } catch (error: any) {
      if (error.message === 'AI service unavailable') {
        ctx.status = 503;
        ctx.body = { error: { message: 'AI service is currently unavailable.' } };
        return;
      }
      ctx.status = 500;
      ctx.body = { error: { message: 'Quiz generation failed', details: error.message } };
    }
  },

  /**
   * GET /api/v1/ai/jobs/:jobId
   * Get the status of an async AI job.
   */
  async getJob(ctx: any) {
    const { jobId } = ctx.params;

    if (!jobId) {
      ctx.status = 400;
      ctx.body = { error: { message: 'jobId is required' } };
      return;
    }

    const job = aiService.getJob(jobId);

    if (!job) {
      ctx.status = 404;
      ctx.body = { error: { message: 'Job not found' } };
      return;
    }

    ctx.body = { data: job };
  },

  /**
   * POST /api/v1/ai/search
   * Semantic search using pgvector embeddings with hybrid ranking.
   */
  async search(ctx: any) {
    const { query, contentType, limit } = ctx.request.body;

    if (!query || query.length < 3) {
      ctx.status = 400;
      ctx.body = { error: { message: 'query must be at least 3 characters' } };
      return;
    }

    try {
      const results = await embeddingService.hybridSearch(strapi, query, {
        contentType,
        limit: Math.min(parseInt(limit) || 10, 50),
      });
      ctx.body = { data: results };
    } catch (error: any) {
      // Fall back to keyword-only search
      try {
        const knex = strapi.db.connection;
        const escapedQuery = query.replace(/[%_\\]/g, '\\$&');
        const searchPattern = `%${escapedQuery}%`;
        const result = await knex.raw(
          `SELECT content_type, content_id, title, chunk_text as snippet
           FROM content_embeddings
           WHERE title ILIKE ? OR chunk_text ILIKE ?
           ORDER BY updated_at DESC LIMIT ?`,
          [searchPattern, searchPattern, Math.min(parseInt(limit) || 10, 50)]
        );
        ctx.body = { data: (result.rows || []).map((r: any, i: number) => ({
          ...r,
          score: 1 / (i + 1),
          snippet: r.snippet?.slice(0, 200),
        })) };
      } catch (fallbackError: any) {
        ctx.status = 503;
        ctx.body = { error: { message: 'Search service unavailable.' } };
      }
    }
  },

  /**
   * GET /api/v1/ai/recommend
   * Personalized course recommendations for the authenticated user.
   */
  async recommend(ctx: any) {
    const user = ctx.state?.user;
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: { message: 'Authentication required' } };
      return;
    }

    try {
      const limit = Math.min(parseInt(ctx.query.limit) || 5, 20);
      const recommendations = await recommendationService.getRecommendations(
        strapi,
        user.id,
        limit
      );
      ctx.body = { data: recommendations };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Recommendations failed', details: error.message } };
    }
  },
};
