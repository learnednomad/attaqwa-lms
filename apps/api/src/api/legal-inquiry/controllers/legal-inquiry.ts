/**
 * legal-inquiry controller
 *
 * Public submissions always land with status="new" and submittedAt=now.
 * Answer / answeredBy / answeredAt / notes can only be set via admin routes.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::legal-inquiry.legal-inquiry',
  ({ strapi }) => ({
    async create(ctx) {
      const incoming = ctx.request?.body?.data ?? {};
      const {
        firstName,
        lastName,
        email,
        phone,
        category,
        audience,
        question,
        language,
      } = incoming;

      ctx.request.body = {
        data: {
          firstName,
          lastName,
          email,
          phone,
          category,
          audience,
          question,
          language,
          status: 'new',
          submittedAt: new Date().toISOString(),
        },
      };

      // TODO(email): notify the routed imam/ustadha based on `audience`.
      const response = await super.create(ctx);
      return response;
    },
  })
);
