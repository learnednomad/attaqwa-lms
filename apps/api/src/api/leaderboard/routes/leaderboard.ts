/**
 * leaderboard router
 * Versioned API: /api/v1/leaderboards
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::leaderboard.leaderboard', {
  prefix: '/v1',
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      middlewares: ['api::leaderboard.rate-limit'],
    },
    findOne: {
      middlewares: ['api::leaderboard.rate-limit'],
    },
  },
});
