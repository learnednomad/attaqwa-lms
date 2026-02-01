/**
 * Announcement API Validation Schemas
 *
 * SECURITY: Input validation with Zod to prevent injection attacks
 */

import { z } from 'zod';

// Announcement types enum
export const announcementTypeSchema = z.enum([
  'announcement',
  'event',
  'prayer',
  'education',
]);

// Priority levels enum
export const prioritySchema = z.enum(['normal', 'medium', 'high']);

// Create announcement request schema
export const createAnnouncementSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less')
    .trim(),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(10000, 'Content must be 10,000 characters or less')
    .trim(),
  type: announcementTypeSchema.default('announcement'),
  priority: prioritySchema.default('normal'),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
  eventDate: z.string().datetime('Invalid date format').optional().nullable(),
  isActive: z.boolean().default(true),
});

// Update announcement request schema (all fields optional)
export const updateAnnouncementSchema = createAnnouncementSchema.partial();

// Query parameters schema
export const announcementQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().min(1).max(100)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().min(0)),
  type: announcementTypeSchema.optional(),
  active: z
    .string()
    .optional()
    .transform((val) => val !== 'false'),
});

// Type exports
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
export type AnnouncementQuery = z.infer<typeof announcementQuerySchema>;
