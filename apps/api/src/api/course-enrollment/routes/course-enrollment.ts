/**
 * course-enrollment router
 * Versioned API: /api/v1/course-enrollments
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::course-enrollment.course-enrollment', {
  prefix: '/v1',
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      middlewares: ['api::course-enrollment.rate-limit'],
    },
    findOne: {
      middlewares: ['api::course-enrollment.rate-limit'],
    },
  },
});
