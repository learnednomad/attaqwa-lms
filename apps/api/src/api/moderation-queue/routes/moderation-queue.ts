/**
 * moderation-queue router
 * Versioned API: /api/v1/moderation-queues
 * Custom routes (factory routes don't need to be spread)
 */

/**
 * moderation-queue router
 * Versioned API: /api/v1/moderation-queues
 * All routes require admin or moderator role.
 */

const adminOrModeratorPolicy = {
  name: 'global::is-admin-or-moderator',
  config: {},
};

export default {
  routes: [
    {
      method: 'GET',
      path: '/v1/moderation-queues',
      handler: 'api::moderation-queue.moderation-queue.find',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::moderation-queue.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/moderation-queues/:id',
      handler: 'api::moderation-queue.moderation-queue.findOne',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::moderation-queue.rate-limit'],
      },
    },
    {
      method: 'POST',
      path: '/v1/moderation-queues',
      handler: 'api::moderation-queue.moderation-queue.create',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::moderation-queue.rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/v1/moderation-queues/:id',
      handler: 'api::moderation-queue.moderation-queue.update',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::moderation-queue.rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/v1/moderation-queues/:id/review',
      handler: 'api::moderation-queue.moderation-queue.review',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::moderation-queue.rate-limit'],
      },
    },
  ],
};
