/**
 * legal-inquiry router
 * Versioned API: /api/v1/legal-inquiries
 *
 * Public POST (submission). Reads and mutations are admin/moderator-only.
 */

const adminOrModeratorPolicy = {
  name: 'global::is-admin-or-moderator',
  config: {},
};

export default {
  routes: [
    {
      method: 'POST',
      path: '/v1/legal-inquiries',
      handler: 'api::legal-inquiry.legal-inquiry.create',
      config: {
        auth: false,
        middlewares: ['api::legal-inquiry.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/legal-inquiries',
      handler: 'api::legal-inquiry.legal-inquiry.find',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::legal-inquiry.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/legal-inquiries/:id',
      handler: 'api::legal-inquiry.legal-inquiry.findOne',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::legal-inquiry.rate-limit'],
      },
    },
    {
      method: 'PUT',
      path: '/v1/legal-inquiries/:id',
      handler: 'api::legal-inquiry.legal-inquiry.update',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::legal-inquiry.rate-limit'],
      },
    },
    {
      method: 'DELETE',
      path: '/v1/legal-inquiries/:id',
      handler: 'api::legal-inquiry.legal-inquiry.delete',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::legal-inquiry.rate-limit'],
      },
    },
  ],
};
