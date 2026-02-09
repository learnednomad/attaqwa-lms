/**
 * event router
 * Versioned API: /api/v1/events
 * Public read, admin-protected write.
 */

const adminOrModeratorPolicy = {
  name: 'global::is-admin-or-moderator',
  config: {},
};

export default {
  routes: [
    // Public routes
    {
      method: 'GET',
      path: '/v1/events',
      handler: 'api::event.event.find',
      config: {
        middlewares: ['api::event.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/events/:id',
      handler: 'api::event.event.findOne',
      config: {
        middlewares: ['api::event.rate-limit'],
      },
    },
    // Admin-protected routes
    {
      method: 'POST',
      path: '/v1/events',
      handler: 'api::event.event.create',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::event.rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/v1/events/:id',
      handler: 'api::event.event.update',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::event.rate-limit'],
      },
    },
    {
      method: 'DELETE',
      path: '/v1/events/:id',
      handler: 'api::event.event.delete',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::event.rate-limit'],
      },
    },
  ],
};
