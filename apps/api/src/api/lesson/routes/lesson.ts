/**
 * lesson router
 * Versioned API: /api/v1/lessons
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::lesson.lesson', {
  prefix: '/v1',
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      middlewares: ['api::lesson.rate-limit'],
    },
    findOne: {
      middlewares: ['api::lesson.rate-limit'],
    },
  },
});
