/**
 * Centralized Validation Schemas Export
 *
 * SECURITY: All API input validation schemas in one place
 */

// Re-export all schemas
export * from './announcement';
export * from './course';
export * from './auth';

// Common validation helpers
import { z, ZodError } from 'zod';
import { NextResponse } from 'next/server';

/**
 * Format Zod validation errors into a user-friendly response
 *
 * @param error - Zod validation error
 * @returns Formatted error object
 */
export function formatValidationErrors(error: ZodError) {
  const fieldErrors: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(err.message);
  });

  return {
    status: 400,
    message: 'Validation failed',
    errors: fieldErrors,
  };
}

/**
 * Validate request body against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param data - Request body data
 * @returns Validated data or NextResponse error
 */
export function validateBody<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; response: NextResponse } {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: formatValidationErrors(result.error) },
        { status: 400 }
      ),
    };
  }

  return { success: true, data: result.data };
}

/**
 * Validate query parameters against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param searchParams - URL search params
 * @returns Validated data or default values
 */
export function validateQuery<T extends z.ZodSchema>(
  schema: T,
  searchParams: URLSearchParams
): z.infer<T> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);

  if (!result.success) {
    // Return defaults for query params (don't throw errors)
    return schema.parse({});
  }

  return result.data;
}
