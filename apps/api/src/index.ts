// import type { Core } from '@strapi/strapi';
import bootstrap from './bootstrap';

interface StrapiInstance {
  log: { info: (msg: string) => void; warn: (msg: string) => void };
  entityService: {
    create: (uid: string, params: { data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
    findMany: (uid: string, params: Record<string, unknown>) => Promise<Record<string, unknown>[]>;
    update: (uid: string, id: unknown, params: { data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
  };
  db: {
    lifecycles: {
      subscribe: (config: Record<string, unknown>) => void;
    };
  };
}

interface ContentResult {
  id: string | number;
  documentId?: string;
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  subject?: string;
  difficulty?: string;
  age_tier?: string;
}

interface LifecycleEvent {
  model: { singularName: string };
  result: ContentResult;
  params?: { data?: Record<string, unknown> };
}

/**
 * Queue AI moderation for content after create/update.
 * Fails silently if Ollama is unavailable — content stays in manual review.
 */
async function queueModeration(strapi: StrapiInstance, contentType: string, result: ContentResult) {
  if (process.env.AI_AUTO_MODERATE_ON_CREATE === 'false') return;
  if (process.env.OLLAMA_ENABLED === 'false') return;

  const title = result.title || result.name || `${contentType} #${result.id}`;
  const content = result.description || result.content || '';

  if (!content) return;

  try {
    // Create a pending moderation-queue entry
    await strapi.entityService.create('api::moderation-queue.moderation-queue', {
      data: {
        content_type: contentType,
        content_id: String(result.documentId || result.id),
        content_title: title,
        status: 'pending',
      },
    });

    // Attempt async AI moderation
    const aiService = require('./api/ai/services/ai');
    const job = aiService.moderateAsync(content, contentType, result.age_tier);
    const contentId = String(result.documentId || result.id);

    // Poll for result (non-blocking with timeout)
    let pollCount = 0;
    const MAX_POLLS = 90; // 90 * 2s = 3 minutes max
    const pollInterval = setInterval(async () => {
      pollCount++;
      if (pollCount > MAX_POLLS) {
        clearInterval(pollInterval);
        return;
      }

      try {
        const jobResult = aiService.getJob(job.id);
        if (!jobResult || jobResult.status === 'pending' || jobResult.status === 'processing') return;

        clearInterval(pollInterval);

        if (jobResult.status === 'completed' && jobResult.result) {
          const entries = await strapi.entityService.findMany(
            'api::moderation-queue.moderation-queue',
            {
              filters: { content_type: contentType, content_id: contentId },
              sort: { createdAt: 'desc' },
              limit: 1,
            }
          );

          if (entries && entries.length > 0) {
            await strapi.entityService.update(
              'api::moderation-queue.moderation-queue',
              entries[0].id,
              {
                data: {
                  ai_score: jobResult.result.score,
                  ai_flags: jobResult.result.flags,
                  ai_reasoning: jobResult.result.reasoning,
                  status: jobResult.result.recommendation === 'approve'
                    ? 'approved'
                    : jobResult.result.recommendation === 'reject'
                      ? 'rejected'
                      : 'needs_review',
                },
              }
            );
          }
        }
      } catch (pollError: unknown) {
        clearInterval(pollInterval);
        strapi.log.warn(`Moderation poll error for ${contentType}:${contentId}: ${pollError instanceof Error ? pollError.message : 'Unknown error'}`);
      }
    }, 2000);
  } catch (error: unknown) {
    strapi.log.warn(`AI moderation queue failed for ${contentType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: StrapiInstance }) {
    // Run the original bootstrap (seeding, permissions)
    await bootstrap({ strapi });

    // Run embeddings migration if search is enabled
    if (process.env.OLLAMA_ENABLED !== 'false' && process.env.AI_SEARCH_ENABLED !== 'false') {
      try {
        const embeddingService = require('./api/ai/services/embedding-service');
        await embeddingService.runMigration(strapi);
      } catch (error: unknown) {
        strapi.log.warn(`Embeddings migration skipped: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Register lifecycle hooks for AI moderation and embedding
    if (process.env.OLLAMA_ENABLED !== 'false') {
      const modelsToWatch = ['api::course.course', 'api::lesson.lesson', 'api::quiz.quiz'];

      strapi.db.lifecycles.subscribe({
        models: modelsToWatch,

        async afterCreate(event: LifecycleEvent) {
          const { model, result } = event;
          const contentType = model.singularName;

          // Queue AI moderation
          if (process.env.AI_MODERATION_ENABLED !== 'false') {
            queueModeration(strapi, contentType, result);
          }

          // Generate embeddings for search
          if (process.env.AI_SEARCH_ENABLED !== 'false') {
            try {
              const embeddingService = require('./api/ai/services/embedding-service');
              const content = result.description || result.content || '';
              if (content.length > 50) {
                embeddingService.indexContent(
                  strapi, contentType,
                  String(result.documentId || result.id),
                  result.title || '',
                  content,
                  { subject: result.subject, difficulty: result.difficulty, age_tier: result.age_tier }
                );
              }
            } catch (err: unknown) {
              strapi.log.warn(`Embedding indexing failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
          }
        },

        async afterUpdate(event: LifecycleEvent) {
          const { model, result, params } = event;
          const contentFields = ['description', 'content', 'title'];
          const changedFields = Object.keys(params.data || {});
          const hasContentChange = changedFields.some((f) => contentFields.includes(f));

          if (hasContentChange) {
            const contentType = model.singularName;

            // Re-queue AI moderation
            if (process.env.AI_MODERATION_ENABLED !== 'false') {
              queueModeration(strapi, contentType, result);
            }

            // Re-generate embeddings
            if (process.env.AI_SEARCH_ENABLED !== 'false') {
              try {
                const embeddingService = require('./api/ai/services/embedding-service');
                const content = result.description || result.content || '';
                if (content.length > 50) {
                  embeddingService.indexContent(
                    strapi, contentType,
                    String(result.documentId || result.id),
                    result.title || '',
                    content,
                    { subject: result.subject, difficulty: result.difficulty, age_tier: result.age_tier }
                  );
                }
              } catch (err: unknown) {
                strapi.log.warn(`Embedding re-indexing failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
              }
            }
          }
        },

        async afterDelete(event: LifecycleEvent) {
          const { model, result } = event;
          // Remove embeddings for deleted content
          if (process.env.AI_SEARCH_ENABLED !== 'false') {
            try {
              const embeddingService = require('./api/ai/services/embedding-service');
              await embeddingService.removeContent(
                strapi,
                model.singularName,
                String(result.documentId || result.id)
              );
            } catch (err: unknown) {
              strapi.log.warn(`Embedding cleanup failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
          }
        },
      });

      strapi.log.info('AI lifecycle hooks registered (moderation + embeddings)');
    }
  },
};
