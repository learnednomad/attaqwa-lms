// import type { Core } from '@strapi/strapi';
import bootstrap from './bootstrap';

/**
 * Queue AI moderation for content after create/update.
 * Fails silently if Ollama is unavailable — content stays in manual review.
 */
async function queueModeration(strapi: any, contentType: string, result: any) {
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

    // Poll for result (non-blocking with timeout)
    const pollInterval = setInterval(async () => {
      const jobResult = aiService.getJob(job.id);
      if (!jobResult || jobResult.status === 'pending' || jobResult.status === 'processing') return;

      clearInterval(pollInterval);

      if (jobResult.status === 'completed' && jobResult.result) {
        // Update the moderation queue entry with AI results
        const entries = await strapi.entityService.findMany(
          'api::moderation-queue.moderation-queue',
          {
            filters: {
              content_type: contentType,
              content_id: String(result.documentId || result.id),
            },
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
    }, 2000);

    // Stop polling after 3 minutes
    setTimeout(() => clearInterval(pollInterval), 3 * 60 * 1000);
  } catch (error: any) {
    strapi.log.warn(`AI moderation queue failed for ${contentType}: ${error.message}`);
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
  async bootstrap({ strapi }: { strapi: any }) {
    // Run the original bootstrap (seeding, permissions)
    await bootstrap({ strapi });

    // Run embeddings migration if search is enabled
    if (process.env.OLLAMA_ENABLED !== 'false' && process.env.AI_SEARCH_ENABLED !== 'false') {
      try {
        const embeddingService = require('./api/ai/services/embedding-service');
        await embeddingService.runMigration(strapi);
      } catch (error: any) {
        strapi.log.warn(`Embeddings migration skipped: ${error.message}`);
      }
    }

    // Register lifecycle hooks for AI moderation and embedding
    if (process.env.OLLAMA_ENABLED !== 'false') {
      const modelsToWatch = ['api::course.course', 'api::lesson.lesson', 'api::quiz.quiz'];

      strapi.db.lifecycles.subscribe({
        models: modelsToWatch,

        async afterCreate(event: any) {
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
            } catch (err: any) {
              strapi.log.warn(`Embedding indexing failed: ${err.message}`);
            }
          }
        },

        async afterUpdate(event: any) {
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
              } catch (err: any) {
                strapi.log.warn(`Embedding re-indexing failed: ${err.message}`);
              }
            }
          }
        },

        async afterDelete(event: any) {
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
            } catch (err: any) {
              strapi.log.warn(`Embedding cleanup failed: ${err.message}`);
            }
          }
        },
      });

      strapi.log.info('AI lifecycle hooks registered (moderation + embeddings)');
    }
  },
};
