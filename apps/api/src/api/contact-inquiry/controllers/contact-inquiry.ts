/**
 * contact-inquiry controller
 *
 * Public submissions always land with status="new" and submittedAt=now,
 * regardless of whatever the caller sends in the body.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::contact-inquiry.contact-inquiry',
  ({ strapi }) => ({
    async create(ctx) {
      const incoming = ctx.request?.body?.data ?? {};
      const {
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
        preferredContact,
      } = incoming;

      ctx.request.body = {
        data: {
          firstName,
          lastName,
          email,
          phone,
          subject,
          message,
          preferredContact,
          status: 'new',
          submittedAt: new Date().toISOString(),
        },
      };

      // TODO(email): notify almaad2674@gmail.com via Resend/SES when configured.
      const response = await super.create(ctx);
      return response;
    },
  })
);
