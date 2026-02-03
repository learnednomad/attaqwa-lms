/**
 * user-progress router
 * Versioned API: /api/v1/user-progresses
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::user-progress.user-progress', {
  prefix: '/v1',
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      middlewares: ['api::user-progress.rate-limit'],
    },
    findOne: {
      middlewares: ['api::user-progress.rate-limit'],
    },
  },
});
