/**
 * contact-inquiry router
 * Versioned API: /api/v1/contact-inquiries
 *
 * Public POST (submission). Reads and mutations are admin/moderator-only.
 */

const adminOrModeratorPolicy = {
  name: 'global::is-admin-or-moderator',
  config: {},
};

export default {
  routes: [
    // Public submission
    {
      method: 'POST',
      path: '/v1/contact-inquiries',
      handler: 'api::contact-inquiry.contact-inquiry.create',
      config: {
        auth: false,
        middlewares: ['api::contact-inquiry.rate-limit'],
      },
    },
    // Admin-only read
    {
      method: 'GET',
      path: '/v1/contact-inquiries',
      handler: 'api::contact-inquiry.contact-inquiry.find',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::contact-inquiry.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/contact-inquiries/:id',
      handler: 'api::contact-inquiry.contact-inquiry.findOne',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::contact-inquiry.rate-limit'],
      },
    },
    // Admin-only mutations
    {
      method: 'PUT',
      path: '/v1/contact-inquiries/:id',
      handler: 'api::contact-inquiry.contact-inquiry.update',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::contact-inquiry.rate-limit'],
      },
    },
    {
      method: 'DELETE',
      path: '/v1/contact-inquiries/:id',
      handler: 'api::contact-inquiry.contact-inquiry.delete',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::contact-inquiry.rate-limit'],
      },
    },
  ],
};
