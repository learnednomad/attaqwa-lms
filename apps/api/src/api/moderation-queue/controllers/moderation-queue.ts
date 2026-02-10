/**
 * moderation-queue controller
 * Factory controller + custom review action
 */

import { factories } from '@strapi/strapi';

const uid = 'api::moderation-queue.moderation-queue' as any;

export default factories.createCoreController(uid, ({ strapi }) => ({
  /**
   * PUT /api/v1/moderation-queues/:id/review
   * Admin review action: approve or reject moderation queue item
   */
  async review(ctx: any) {
    const { id } = ctx.params;
    const { action, notes } = ctx.request.body;
    const user = ctx.state?.user;

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: { message: 'Authentication required' } };
      return;
    }

    // Only admins and moderators can review content
    const userRole = user.role?.type;
    if (userRole !== 'admin' && userRole !== 'moderator') {
      ctx.status = 403;
      ctx.body = { error: { message: 'Admin or moderator role required to review content' } };
      return;
    }

    if (!['approve', 'reject', 'needs_review'].includes(action)) {
      ctx.status = 400;
      ctx.body = { error: { message: 'action must be one of: approve, reject, needs_review' } };
      return;
    }

    const statusMap: Record<string, string> = {
      approve: 'approved',
      reject: 'rejected',
      needs_review: 'needs_review',
    };

    try {
      const entry = await strapi.entityService.findOne(uid, id);

      if (!entry) {
        ctx.status = 404;
        ctx.body = { error: { message: 'Moderation queue item not found' } };
        return;
      }

      const updated = await strapi.entityService.update(uid, id, {
        data: {
          status: statusMap[action],
          reviewer: user.id,
          reviewer_notes: notes || null,
          reviewed_at: new Date().toISOString(),
        } as any,
      });

      ctx.body = { data: updated };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: { message: 'Review failed', details: error.message } };
    }
  },
}));
