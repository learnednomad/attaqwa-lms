/**
 * quiz controller
 *
 * Strips correct_answer and explanation from public quiz responses
 * to prevent answer leakage.
 */

import { factories } from '@strapi/strapi';

function stripAnswers(data: any) {
  if (!data) return data;

  const strip = (item: any) => {
    if (!item?.questions || !Array.isArray(item.questions)) return item;
    return {
      ...item,
      questions: item.questions.map((q: any) => {
        const { correct_answer, explanation, ...rest } = q;
        return rest;
      }),
    };
  };

  if (Array.isArray(data)) return data.map(strip);
  return strip(data);
}

export default factories.createCoreController('api::quiz.quiz', ({ strapi }) => ({
  async find(ctx) {
    const response = await super.find(ctx);
    if (response?.data) {
      response.data = stripAnswers(response.data);
    }
    return response;
  },

  async findOne(ctx) {
    const response = await super.findOne(ctx);
    if (response?.data) {
      response.data = stripAnswers(response.data);
    }
    return response;
  },
}));
