/**
 * prayer-time-override router
 * Versioned API: /api/v1/prayer-time-overrides
 * Admin-only — all CRUD operations require admin or moderator role.
 */

const adminOrModeratorPolicy = {
  name: 'global::is-admin-or-moderator',
  config: {},
};

export default {
  routes: [
    {
      method: 'GET',
      path: '/v1/prayer-time-overrides',
      handler: 'api::prayer-time-override.prayer-time-override.find',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::prayer-time-override.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/prayer-time-overrides/:id',
      handler: 'api::prayer-time-override.prayer-time-override.findOne',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::prayer-time-override.rate-limit'],
      },
    },
    {
      method: 'POST',
      path: '/v1/prayer-time-overrides',
      handler: 'api::prayer-time-override.prayer-time-override.create',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::prayer-time-override.rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/v1/prayer-time-overrides/:id',
      handler: 'api::prayer-time-override.prayer-time-override.update',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::prayer-time-override.rate-limit'],
      },
    },
    {
      method: 'DELETE',
      path: '/v1/prayer-time-overrides/:id',
      handler: 'api::prayer-time-override.prayer-time-override.delete',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::prayer-time-override.rate-limit'],
      },
    },
  ],
};
