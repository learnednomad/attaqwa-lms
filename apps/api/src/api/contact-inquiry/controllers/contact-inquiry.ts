/**
 * contact-inquiry controller
 *
 * Public submissions always land with status="new" and submittedAt=now,
 * regardless of whatever the caller sends in the body. After persisting we
 * fire-and-forget a notification email — failures are logged but never block
 * the user's submission.
 */

import { factories } from '@strapi/strapi';

const SUBJECT_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  'prayer-times': 'Prayer Times',
  education: 'Islamic Education',
  nikah: 'Nikah (Marriage)',
  funeral: 'Janazah (Funeral)',
  counseling: 'Religious Counseling',
  donations: 'Donations & Zakat',
  events: 'Events & Programs',
  other: 'Other',
};

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

      const response = await super.create(ctx);

      // Notify the masjid inbox. Fire-and-forget — never block on email.
      const notifyTo = strapi.config.get(
        'server.notifications.contactInquiry',
        process.env.CONTACT_INQUIRY_NOTIFY_TO || process.env.EMAIL_NOTIFY_TO
      );
      const emailService = strapi.plugin('email')?.service?.('email');

      if (notifyTo && emailService) {
        const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
        const text = [
          `New contact inquiry from ${firstName} ${lastName}`,
          `Subject: ${subjectLabel}`,
          `Email:   ${email}`,
          phone ? `Phone:   ${phone}` : null,
          `Preferred contact: ${preferredContact}`,
          '',
          'Message:',
          message,
          '',
          '— Submitted via the Masjid At-Taqwa contact form',
        ]
          .filter(Boolean)
          .join('\n');

        emailService
          .send({
            to: notifyTo,
            replyTo: email,
            subject: `[Masjid Contact] ${subjectLabel} — ${firstName} ${lastName}`,
            text,
          })
          .catch((err: unknown) => {
            strapi.log.error('contact-inquiry: email notification failed', err);
          });
      } else if (!emailService) {
        strapi.log.warn(
          'contact-inquiry: email plugin not configured (set SMTP_HOST + SMTP_USER + SMTP_PASS to enable notifications)'
        );
      }

      return response;
    },
  })
);
