/**
 * iqamah-schedule router
 * Public read access for prayer times display.
 * Admin-only write access for managing schedules.
 */

const adminOrModeratorPolicy = {
  name: 'global::is-admin-or-moderator',
  config: {},
};

export default {
  routes: [
    // Public: get iqamah times for a specific month/day
    {
      method: 'GET',
      path: '/v1/iqamah-schedules',
      handler: 'api::iqamah-schedule.iqamah-schedule.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/v1/iqamah-schedules/:id',
      handler: 'api::iqamah-schedule.iqamah-schedule.findOne',
      config: {
        auth: false,
      },
    },
    // Admin: manage schedules
    {
      method: 'POST',
      path: '/v1/iqamah-schedules',
      handler: 'api::iqamah-schedule.iqamah-schedule.create',
      config: {
        policies: [adminOrModeratorPolicy],
      },
    },
    {
      method: 'PUT',
      path: '/v1/iqamah-schedules/:id',
      handler: 'api::iqamah-schedule.iqamah-schedule.update',
      config: {
        policies: [adminOrModeratorPolicy],
      },
    },
    {
      method: 'DELETE',
      path: '/v1/iqamah-schedules/:id',
      handler: 'api::iqamah-schedule.iqamah-schedule.delete',
      config: {
        policies: [adminOrModeratorPolicy],
      },
    },
  ],
};
