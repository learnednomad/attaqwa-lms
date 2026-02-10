/**
 * appeal router
 * Versioned API: /api/v1/appeals
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
      path: '/v1/appeals',
      handler: 'api::appeal.appeal.find',
      config: {
        middlewares: ['api::appeal.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/appeals/:id',
      handler: 'api::appeal.appeal.findOne',
      config: {
        middlewares: ['api::appeal.rate-limit'],
      },
    },
    // Admin-protected routes
    {
      method: 'POST',
      path: '/v1/appeals',
      handler: 'api::appeal.appeal.create',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::appeal.rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/v1/appeals/:id',
      handler: 'api::appeal.appeal.update',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::appeal.rate-limit'],
      },
    },
    {
      method: 'DELETE',
      path: '/v1/appeals/:id',
      handler: 'api::appeal.appeal.delete',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::appeal.rate-limit'],
      },
    },
  ],
};
