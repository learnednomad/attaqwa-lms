/**
 * AI Routes
 * Custom routes (not factory) for AI endpoints.
 * All routes are prefixed with /api/v1/ai/
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/v1/ai/health',
      handler: 'api::ai.ai.health',
      config: {
        auth: false, // Public health check for monitoring
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/v1/ai/moderate',
      handler: 'api::ai.ai.moderate',
      config: {
        middlewares: ['api::ai.ai-rate-limit'],
      },
    },
    {
      method: 'POST',
      path: '/v1/ai/summarize',
      handler: 'api::ai.ai.summarize',
      config: {
        middlewares: ['api::ai.ai-rate-limit'],
      },
    },
    {
      method: 'POST',
      path: '/v1/ai/generate-tags',
      handler: 'api::ai.ai.generateTags',
      config: {
        middlewares: ['api::ai.ai-rate-limit'],
      },
    },
    {
      method: 'POST',
      path: '/v1/ai/generate-quiz',
      handler: 'api::ai.ai.generateQuiz',
      config: {
        middlewares: ['api::ai.ai-rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/ai/jobs/:jobId',
      handler: 'api::ai.ai.getJob',
      config: {
        middlewares: ['api::ai.ai-rate-limit'],
      },
    },
    {
      method: 'POST',
      path: '/v1/ai/search',
      handler: 'api::ai.ai.search',
      config: {
        middlewares: ['api::ai.ai-rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/ai/recommend',
      handler: 'api::ai.ai.recommend',
      config: {
        middlewares: ['api::ai.ai-rate-limit'],
      },
    },
  ],
};
