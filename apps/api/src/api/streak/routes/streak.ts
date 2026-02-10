/**
 * streak router
 * Versioned API: /api/v1/streaks
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::streak.streak', {
  prefix: '/v1',
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      middlewares: ['api::streak.rate-limit'],
    },
    findOne: {
      middlewares: ['api::streak.rate-limit'],
    },
  },
});
