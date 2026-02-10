/**
 * user-achievement router
 * Versioned API: /api/v1/user-achievements
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::user-achievement.user-achievement', {
  prefix: '/v1',
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      middlewares: ['api::user-achievement.rate-limit'],
    },
    findOne: {
      middlewares: ['api::user-achievement.rate-limit'],
    },
  },
});
