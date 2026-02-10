/**
 * achievement router
 * Versioned API: /api/v1/achievements
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::achievement.achievement', {
  prefix: '/v1',
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      middlewares: ['api::achievement.rate-limit'],
    },
    findOne: {
      middlewares: ['api::achievement.rate-limit'],
    },
  },
});
