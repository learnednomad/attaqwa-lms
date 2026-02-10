/**
 * moderation-queue service
 */

import { factories } from '@strapi/strapi';

const uid = 'api::moderation-queue.moderation-queue' as any;

export default factories.createCoreService(uid);
