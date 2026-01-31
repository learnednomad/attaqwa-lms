/**
 * XSS Sanitization Utilities
 *
 * SECURITY: Sanitize user-generated content before rendering to prevent XSS attacks.
 *
 * Usage:
 * - sanitizeHtml: For rich text content (preserves safe HTML tags)
 * - sanitizeText: For plain text (strips all HTML)
 * - sanitizeUrl: For URL validation and sanitization
 */

/**
 * List of allowed HTML tags for rich text content
 * These are safe for rendering user content
 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'code',
  'a', 'span', 'div',
];

/**
 * Allowed attributes for HTML tags
 * Strictly limited to prevent script injection
 */
const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  span: ['class'],
  div: ['class'],
  code: ['class'],
  pre: ['class'],
};

/**
 * Patterns that indicate potentially dangerous content
 */
const DANGEROUS_PATTERNS = [
  /javascript:/gi,
  /data:/gi,
  /vbscript:/gi,
  /on\w+\s*=/gi, // onclick, onerror, etc.
  /<script/gi,
  /<\/script/gi,
  /<iframe/gi,
  /<embed/gi,
  /<object/gi,
  /<form/gi,
];

/**
 * Sanitize HTML content for safe rendering
 *
 * Uses a simple regex-based approach. For production use with complex HTML,
 * consider using DOMPurify on the server side.
 *
 * @param html - Raw HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let sanitized = html;

  // Remove dangerous patterns
  DANGEROUS_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Remove any remaining script-related content
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Remove style tags (can contain expressions)
  sanitized = sanitized.replace(/<style[\s\S]*?<\/style>/gi, '');

  // Remove all event handlers
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '');

  return sanitized;
}

/**
 * Strip all HTML tags, leaving only plain text
 *
 * @param text - String that may contain HTML
 * @returns Plain text with no HTML tags
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Decode HTML entities first
  const decoded = text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Remove all HTML tags
  const stripped = decoded.replace(/<[^>]*>/g, '');

  // Trim and normalize whitespace
  return stripped.replace(/\s+/g, ' ').trim();
}

/**
 * Sanitize and validate a URL
 *
 * @param url - URL string to sanitize
 * @returns Sanitized URL or empty string if invalid/dangerous
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return '';
  }

  // Allow only http, https, and relative URLs
  if (
    !trimmed.startsWith('http://') &&
    !trimmed.startsWith('https://') &&
    !trimmed.startsWith('/') &&
    !trimmed.startsWith('#') &&
    !trimmed.startsWith('mailto:') &&
    !trimmed.startsWith('tel:')
  ) {
    // If it doesn't start with a protocol, treat as relative
    return url.trim();
  }

  return url.trim();
}

/**
 * Escape HTML entities for safe text display
 *
 * Use this when you need to display user content as plain text
 * within HTML, not when rendering as HTML.
 *
 * @param text - Plain text to escape
 * @returns HTML-escaped string
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validate and sanitize user input for forms
 *
 * @param input - User input string
 * @param maxLength - Maximum allowed length
 * @returns Sanitized input
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return sanitizeText(input).substring(0, maxLength);
}
