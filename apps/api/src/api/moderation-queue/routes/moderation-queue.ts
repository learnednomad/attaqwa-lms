/**
 * moderation-queue router
 * Versioned API: /api/v1/moderation-queues
 * Custom routes (factory routes don't need to be spread)
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/v1/moderation-queues',
      handler: 'api::moderation-queue.moderation-queue.find',
      config: {
        middlewares: ['api::moderation-queue.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/moderation-queues/:id',
      handler: 'api::moderation-queue.moderation-queue.findOne',
      config: {
        middlewares: ['api::moderation-queue.rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/v1/moderation-queues/:id/review',
      handler: 'api::moderation-queue.moderation-queue.review',
      config: {
        middlewares: ['api::moderation-queue.rate-limit'],
      },
    },
  ],
};
