/**
 * course router
 * Versioned API: /api/v1/courses
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::course.course', {
  prefix: '/v1',
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      middlewares: ['api::course.rate-limit'],
    },
    findOne: {
      middlewares: ['api::course.rate-limit'],
    },
  },
});
