/**
 * legal-inquiry controller
 *
 * Public submissions always land with status="new" and submittedAt=now.
 * Answer / answeredBy / answeredAt / notes can only be set via admin routes.
 *
 * Notification routing:
 *   audience=sisters → LEGAL_INQUIRY_SISTERS_NOTIFY_TO (defaults to general)
 *   else             → LEGAL_INQUIRY_NOTIFY_TO (defaults to EMAIL_NOTIFY_TO)
 */

import { factories } from '@strapi/strapi';

const CATEGORY_LABELS: Record<string, string> = {
  fiqh: 'Fiqh (Jurisprudence)',
  'halal-haram': 'Halal / Haram',
  family: 'Family / Marriage / Parenting',
  business: 'Business / Finance (Muamalat)',
  ritual: 'Rituals & Worship (Ibadah)',
  aqeedah: 'Aqeedah (Islamic Belief)',
  other: 'Other',
};

const LANGUAGE_LABELS: Record<string, string> = {
  english: 'English',
  bengali: 'Bengali',
  arabic: 'Arabic',
};

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

      const response = await super.create(ctx);

      // Route by audience. Fire-and-forget; never block on email.
      const generalRecipient =
        process.env.LEGAL_INQUIRY_NOTIFY_TO ||
        process.env.EMAIL_NOTIFY_TO;
      const sistersRecipient =
        process.env.LEGAL_INQUIRY_SISTERS_NOTIFY_TO || generalRecipient;
      const notifyTo = audience === 'sisters' ? sistersRecipient : generalRecipient;

      const emailService = strapi.plugin('email')?.service?.('email');

      if (notifyTo && emailService) {
        const categoryLabel = CATEGORY_LABELS[category] ?? category;
        const audienceTag =
          audience === 'sisters' ? '[SISTERS] ' : audience === 'brothers' ? '[BROTHERS] ' : '';
        const languageLabel = LANGUAGE_LABELS[language] ?? language;
        const text = [
          `New Ask-an-Imam question from ${firstName} ${lastName}`,
          `Category: ${categoryLabel}`,
          `Audience: ${audience}`,
          `Language: ${languageLabel}`,
          `Email:    ${email}`,
          phone ? `Phone:    ${phone}` : null,
          '',
          'Question:',
          question,
          '',
          '— Submitted via the Masjid At-Taqwa Ask-an-Imam form',
        ]
          .filter(Boolean)
          .join('\n');

        emailService
          .send({
            to: notifyTo,
            replyTo: email,
            subject: `${audienceTag}[Ask-an-Imam] ${categoryLabel} — ${firstName} ${lastName}`,
            text,
          })
          .catch((err: unknown) => {
            strapi.log.error('legal-inquiry: email notification failed', err);
          });
      } else if (!emailService) {
        strapi.log.warn(
          'legal-inquiry: email plugin not configured (set SMTP_HOST + SMTP_USER + SMTP_PASS to enable notifications)'
        );
      }

      return response;
    },
  })
);
