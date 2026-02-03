/**
 * quiz router
 * Versioned API: /api/v1/quizzes
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::quiz.quiz', {
  prefix: '/v1',
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  config: {
    find: {
      middlewares: ['api::quiz.rate-limit'],
    },
    findOne: {
      middlewares: ['api::quiz.rate-limit'],
    },
  },
});
