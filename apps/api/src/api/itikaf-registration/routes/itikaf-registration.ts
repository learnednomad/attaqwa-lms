/**
 * itikaf-registration router
 * Versioned API: /api/v1/itikaf-registrations
 * Public create (registration form), admin CRUD for management.
 */

const adminOrModeratorPolicy = {
  name: 'global::is-admin-or-moderator',
  config: {},
};

export default {
  routes: [
    // Admin-protected list and detail
    {
      method: 'GET',
      path: '/v1/itikaf-registrations',
      handler: 'api::itikaf-registration.itikaf-registration.find',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::itikaf-registration.rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/v1/itikaf-registrations/:id',
      handler: 'api::itikaf-registration.itikaf-registration.findOne',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::itikaf-registration.rate-limit'],
      },
    },
    // Public create (registration form submission)
    {
      method: 'POST',
      path: '/v1/itikaf-registrations',
      handler: 'api::itikaf-registration.itikaf-registration.create',
      config: {
        middlewares: ['api::itikaf-registration.rate-limit'],
      },
    },
    // Admin-protected update and delete
    {
      method: 'PUT',
      path: '/v1/itikaf-registrations/:id',
      handler: 'api::itikaf-registration.itikaf-registration.update',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::itikaf-registration.rate-limit'],
      },
    },
    {
      method: 'DELETE',
      path: '/v1/itikaf-registrations/:id',
      handler: 'api::itikaf-registration.itikaf-registration.delete',
      config: {
        policies: [adminOrModeratorPolicy],
        middlewares: ['api::itikaf-registration.rate-limit'],
      },
    },
  ],
};
