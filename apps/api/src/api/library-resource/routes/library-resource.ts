/**
 * library-resource router
 * Versioned API: /api/v1/library-resources
 *
 * Public reads, admin-protected writes.
 */

const adminOrModeratorPolicy = {
  name: 'global::is-admin-or-moderator',
  config: {},
};

export default {
  routes: [
    {
      method: 'GET',
      path: '/v1/library-resources',
      handler: 'api::library-resource.library-resource.find',
      config: {
        auth: false,
        middlewares: ['api::library-resource.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/library-resources/:id',
      handler: 'api::library-resource.library-resource.findOne',
      config: {
        auth: false,
        middlewares: ['api::library-resource.rate-limit'],
      },
    },
    {
      method: 'POST',
      path: '/v1/library-resources',
      handler: 'api::library-resource.library-resource.create',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::library-resource.rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/v1/library-resources/:id',
      handler: 'api::library-resource.library-resource.update',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::library-resource.rate-limit'],
      },
    },
    {
      method: 'DELETE',
      path: '/v1/library-resources/:id',
      handler: 'api::library-resource.library-resource.delete',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::library-resource.rate-limit'],
      },
    },
  ],
};
