/**
 * Course API Validation Schemas
 *
 * SECURITY: Input validation with Zod to prevent injection attacks
 */

import { z } from 'zod';

// Age tier enum
export const ageTierSchema = z.enum([
  'children',
  'youth',
  'adults',
  'seniors',
]);

// Difficulty enum
export const difficultySchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
]);

// Subject enum - aligned with Strapi schema
export const subjectSchema = z.enum([
  'quran',
  'arabic',
  'fiqh',
  'hadith',
  'seerah',
  'aqeedah',
  'akhlaq',
  'tajweed',
]);

// Create course request schema
export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less')
    .trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be 255 characters or less')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly (lowercase, hyphens only)')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be 5,000 characters or less')
    .trim(),
  age_tier: ageTierSchema,
  subject: subjectSchema,
  difficulty: difficultySchema,
  duration_weeks: z.number().int().min(1).max(52),
  schedule: z
    .string()
    .max(500, 'Schedule must be 500 characters or less')
    .trim()
    .optional(),
  instructor: z
    .string()
    .max(255, 'Instructor name must be 255 characters or less')
    .trim()
    .optional(),
  is_featured: z.boolean().default(false),
  learning_outcomes: z
    .array(z.string().max(500).trim())
    .max(20, 'Maximum 20 learning outcomes')
    .optional(),
  max_students: z.number().int().min(1).max(1000).optional().nullable(),
  start_date: z.string().datetime('Invalid date format').optional().nullable(),
  end_date: z.string().datetime('Invalid date format').optional().nullable(),
});

// Update course request schema (all fields optional)
export const updateCourseSchema = createCourseSchema.partial();

// Query parameters schema
export const courseQuerySchema = z.object({
  age_tier: ageTierSchema.optional(),
  subject: subjectSchema.optional(),
  difficulty: difficultySchema.optional(),
  featured: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().min(1).max(100)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().min(0)),
});

// Type exports
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseQuery = z.infer<typeof courseQuerySchema>;
