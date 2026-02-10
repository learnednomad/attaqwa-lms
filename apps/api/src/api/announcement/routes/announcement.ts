/**
 * announcement router
 * Versioned API: /api/v1/announcements
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
      path: '/v1/announcements',
      handler: 'api::announcement.announcement.find',
      config: {
        middlewares: ['api::announcement.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/announcements/:id',
      handler: 'api::announcement.announcement.findOne',
      config: {
        middlewares: ['api::announcement.rate-limit'],
      },
    },
    // Admin-protected routes
    {
      method: 'POST',
      path: '/v1/announcements',
      handler: 'api::announcement.announcement.create',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::announcement.rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/v1/announcements/:id',
      handler: 'api::announcement.announcement.update',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::announcement.rate-limit'],
      },
    },
    {
      method: 'DELETE',
      path: '/v1/announcements/:id',
      handler: 'api::announcement.announcement.delete',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::announcement.rate-limit'],
      },
    },
  ],
};
